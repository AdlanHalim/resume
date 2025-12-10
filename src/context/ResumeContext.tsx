import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
    ResumeContextType,
    RawResumeData,
    PolishedResumeData,
    PersonalInfo,
    ExperienceBlock,
    EducationEntry,
    Skills,
    FormStep,
} from '../types';

const initialRawData: RawResumeData = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        summary: '',
        profileType: 'professional',
    },
    experiences: [],
    education: [],
    skills: {
        technical: [],
        soft: [],
        languages: [],
        certifications: [],
    },
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
    const [rawData, setRawData] = useState<RawResumeData>(initialRawData);
    const [polishedData, setPolishedData] = useState<PolishedResumeData | null>(null);
    const [currentStep, setCurrentStep] = useState<FormStep>('personal');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
        setRawData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, ...info },
        }));
    }, []);

    const addExperience = useCallback((exp: ExperienceBlock) => {
        setRawData((prev) => ({
            ...prev,
            experiences: [...prev.experiences, exp],
        }));
    }, []);

    const updateExperience = useCallback((id: string, exp: Partial<ExperienceBlock>) => {
        setRawData((prev) => ({
            ...prev,
            experiences: prev.experiences.map((e) =>
                e.id === id ? { ...e, ...exp } : e
            ),
        }));
    }, []);

    const removeExperience = useCallback((id: string) => {
        setRawData((prev) => ({
            ...prev,
            experiences: prev.experiences.filter((e) => e.id !== id),
        }));
    }, []);

    const addEducation = useCallback((edu: EducationEntry) => {
        setRawData((prev) => ({
            ...prev,
            education: [...prev.education, edu],
        }));
    }, []);

    const updateEducation = useCallback((id: string, edu: Partial<EducationEntry>) => {
        setRawData((prev) => ({
            ...prev,
            education: prev.education.map((e) =>
                e.id === id ? { ...e, ...edu } : e
            ),
        }));
    }, []);

    const removeEducation = useCallback((id: string) => {
        setRawData((prev) => ({
            ...prev,
            education: prev.education.filter((e) => e.id !== id),
        }));
    }, []);

    const updateSkills = useCallback((skills: Partial<Skills>) => {
        setRawData((prev) => ({
            ...prev,
            skills: { ...prev.skills, ...skills },
        }));
    }, []);

    const generateResume = useCallback(async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/.netlify/functions/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rawData),
            });

            // Get response text first to handle empty responses
            const responseText = await response.text();

            if (!responseText) {
                throw new Error('Empty response from server. Make sure you are running "npx netlify dev" instead of "npm run dev"');
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch {
                throw new Error('Invalid response from server. The API may be down or misconfigured.');
            }

            if (!response.ok) {
                throw new Error(data.error || data.details || 'Failed to generate resume');
            }

            setPolishedData(data);
            setCurrentStep('generate');
        } catch (err) {
            if (err instanceof TypeError && err.message.includes('fetch')) {
                setError('Network error. Make sure the server is running with "npx netlify dev"');
            } else {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        } finally {
            setIsGenerating(false);
        }
    }, [rawData]);

    const resetForm = useCallback(() => {
        setRawData(initialRawData);
        setPolishedData(null);
        setCurrentStep('personal');
        setError(null);
    }, []);

    return (
        <ResumeContext.Provider
            value={{
                rawData,
                polishedData,
                currentStep,
                isGenerating,
                error,
                updatePersonalInfo,
                addExperience,
                updateExperience,
                removeExperience,
                addEducation,
                updateEducation,
                removeEducation,
                updateSkills,
                setCurrentStep,
                generateResume,
                resetForm,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
}
