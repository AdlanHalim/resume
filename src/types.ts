export type ProfileType = 'student' | 'self-taught' | 'professional';

export type ExperienceType = 'job' | 'project' | 'volunteer';

export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
    summary?: string;
    profileType: ProfileType;
}

export interface ExperienceBlock {
    id: string;
    type: ExperienceType;
    title: string; // Job title, Project name, or Role
    company: string; // Company, Project description, or Organization
    startDate: string;
    endDate: string;
    current: boolean;
    description: string; // "What did you do?" - raw input
    technologies?: string[]; // For projects
    link?: string; // For projects/portfolio
}

export interface EducationEntry {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
    achievements?: string;
}

export interface Skills {
    technical: string[];
    soft: string[];
    languages?: string[];
    certifications?: string[];
}

export interface RawResumeData {
    personalInfo: PersonalInfo;
    experiences: ExperienceBlock[];
    education: EducationEntry[];
    skills: Skills;
}

// Polished data after AI processing
export interface PolishedExperience {
    id: string;
    type: ExperienceType;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bulletPoints: string[]; // AI-polished bullet points
    technologies?: string[];
    link?: string;
}

export interface PolishedResumeData {
    personalInfo: PersonalInfo & { summary: string };
    experiences: PolishedExperience[];
    education: EducationEntry[];
    skills: Skills;
}

export type FormStep = 'personal' | 'experience' | 'education' | 'skills' | 'review' | 'generate';

export interface ResumeContextType {
    rawData: RawResumeData;
    polishedData: PolishedResumeData | null;
    currentStep: FormStep;
    isGenerating: boolean;
    error: string | null;
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    addExperience: (exp: ExperienceBlock) => void;
    updateExperience: (id: string, exp: Partial<ExperienceBlock>) => void;
    removeExperience: (id: string) => void;
    addEducation: (edu: EducationEntry) => void;
    updateEducation: (id: string, edu: Partial<EducationEntry>) => void;
    removeEducation: (id: string) => void;
    updateSkills: (skills: Partial<Skills>) => void;
    setCurrentStep: (step: FormStep) => void;
    generateResume: () => Promise<void>;
    resetForm: () => void;
}
