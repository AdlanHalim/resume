interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    steps: string[];
    onStepClick?: (stepIndex: number) => void;
}

export function ProgressBar({ currentStep, totalSteps, steps, onStepClick }: ProgressBarProps) {
    const progress = ((currentStep) / (totalSteps - 1)) * 100;

    return (
        <div className="w-full mb-8">
            {/* Step labels */}
            <div className="flex justify-between mb-3">
                {steps.map((step, index) => (
                    <button
                        key={step}
                        type="button"
                        onClick={() => onStepClick?.(index)}
                        disabled={!onStepClick}
                        className={`flex flex-col items-center transition-all duration-300 ${index <= currentStep
                                ? 'text-primary-500 dark:text-primary-400'
                                : 'text-slate-400 dark:text-slate-600'
                            } ${onStepClick ? 'cursor-pointer hover:scale-105' : ''}`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 transition-all duration-300
                ${index < currentStep
                                    ? 'bg-primary-500 text-white'
                                    : index === currentStep
                                        ? 'bg-primary-500 text-white animate-pulse-glow'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            {index < currentStep ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                index + 1
                            )}
                        </div>
                        <span className="text-xs font-medium hidden sm:block">{step}</span>
                    </button>
                ))}
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
