import { useResume } from '../context/ResumeContext';
import type { FormStep } from '../types';
import { ProgressBar } from './ui/ProgressBar';
import { Button } from './ui/Button';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ReviewStep } from './steps/ReviewStep';
import { ResultPreview } from './pdf/ResultPreview';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STEPS: { key: FormStep; label: string }[] = [
    { key: 'personal', label: 'Personal' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'review', label: 'Review' },
];

export function MultiStepForm() {
    const { currentStep, setCurrentStep, polishedData, resetForm } = useResume();

    const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

    const goNext = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentStepIndex + 1].key);
        }
    };

    const goPrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(STEPS[currentStepIndex - 1].key);
        }
    };

    // If we have polished data and are on 'generate' step, show result preview
    if (currentStep === 'generate' && polishedData) {
        return <ResultPreview data={polishedData} onStartOver={resetForm} />;
    }

    const renderStep = () => {
        switch (currentStep) {
            case 'personal':
                return <PersonalInfoStep />;
            case 'experience':
                return <ExperienceStep />;
            case 'education':
                return <EducationStep />;
            case 'skills':
                return <SkillsStep />;
            case 'review':
                return <ReviewStep />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <ProgressBar
                currentStep={currentStepIndex}
                totalSteps={STEPS.length}
                steps={STEPS.map((s) => s.label)}
                onStepClick={(index) => setCurrentStep(STEPS[index].key)}
            />

            <div className="card p-6 sm:p-8">
                {renderStep()}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button
                        variant="secondary"
                        onClick={goPrev}
                        disabled={currentStepIndex === 0}
                        icon={<ChevronLeft className="w-4 h-4" />}
                    >
                        Previous
                    </Button>
                    {currentStep !== 'review' && (
                        <Button
                            onClick={goNext}
                            icon={<ChevronRight className="w-4 h-4" />}
                            className="flex-row-reverse"
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
