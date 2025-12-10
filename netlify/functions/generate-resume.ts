import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ExperienceBlock {
    id: string;
    type: 'job' | 'project' | 'volunteer';
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    technologies?: string[];
    link?: string;
}

interface ResumeInput {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        linkedin?: string;
        portfolio?: string;
        summary?: string;
        profileType: 'student' | 'self-taught' | 'professional';
    };
    experiences: ExperienceBlock[];
    education: Array<{
        id: string;
        school: string;
        degree: string;
        field: string;
        startDate: string;
        endDate: string;
        current: boolean;
        gpa?: string;
        achievements?: string;
    }>;
    skills: {
        technical: string[];
        soft: string[];
        languages?: string[];
        certifications?: string[];
    };
}

const SYSTEM_PROMPT = `You are an expert resume writer and career coach. Your task is to transform raw, informal descriptions of work experience into polished, professional resume bullet points.

INSTRUCTIONS:
1. Convert each experience description into 3-5 impactful bullet points
2. Use strong action verbs at the start of each bullet (e.g., "Developed", "Led", "Implemented", "Achieved")
3. Include quantifiable metrics when possible (%, numbers, timeframes)
4. Focus on achievements and impact, not just responsibilities
5. Keep each bullet point concise (1-2 lines max)
6. Write a compelling professional summary (2-3 sentences) based on the person's overall profile
7. Maintain factual accuracy - do not invent specific metrics or achievements not implied by the input

OUTPUT FORMAT:
Return a valid JSON object with this exact structure:
{
  "personalInfo": {
    ...original personalInfo fields,
    "summary": "Generated professional summary"
  },
  "experiences": [
    {
      ...original experience fields,
      "bulletPoints": ["Bullet 1", "Bullet 2", "Bullet 3"]
    }
  ],
  "education": [...original education array],
  "skills": {...original skills object}
}

Important: Return ONLY the JSON object, no markdown formatting, no code fences, no explanations.`;

function cleanJsonResponse(text: string): string {
    // Remove markdown code fences if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
        cleaned = cleaned.slice(0, -3);
    }
    return cleaned.trim();
}

export const handler: Handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
            };
        }

        const userData: ResumeInput = JSON.parse(event.body || '{}');

        if (!userData.personalInfo || !userData.experiences) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid resume data' }),
            };
        }

        // Initialize Gemini - use gemini-2.5-flash (latest free tier model)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
        });

        const userPrompt = `Transform the following resume data into a polished, professional format:

${JSON.stringify(userData, null, 2)}

Remember to:
- Create 3-5 bullet points for each experience
- Write a compelling professional summary
- Use strong action verbs and quantify achievements where possible`;

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: userPrompt },
        ]);

        const responseText = result.response.text();
        const cleanedJson = cleanJsonResponse(responseText);

        // Validate JSON
        const polishedData = JSON.parse(cleanedJson);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(polishedData),
        };
    } catch (error) {
        console.error('Error generating resume:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to generate resume',
                details: errorMessage,
            }),
        };
    }
};
