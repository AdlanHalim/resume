import { useResume } from '../../context/ResumeContext';
import { Button } from '../ui/Button';
import { Sparkles, User, Briefcase, GraduationCap, Wrench, AlertCircle } from 'lucide-react';

export function ReviewStep() {
    const { rawData, generateResume, isGenerating, error } = useResume();
    const { personalInfo, experiences, education, skills } = rawData;

    const formatDate = (date: string) => {
        if (!date) return '';
        const [year, month] = date.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const isValid = personalInfo.fullName && personalInfo.email && experiences.length > 0;

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Review Your Information</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Review your details before generating your AI-polished resume
                </p>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-red-800 dark:text-red-200">Error generating resume</p>
                        <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                    </div>
                </div>
            )}

            {/* Personal Info Summary */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Personal Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                        <span className="text-slate-500 dark:text-slate-400">Name:</span>{' '}
                        <span className="text-slate-900 dark:text-white">{personalInfo.fullName || '—'}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 dark:text-slate-400">Email:</span>{' '}
                        <span className="text-slate-900 dark:text-white">{personalInfo.email || '—'}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 dark:text-slate-400">Phone:</span>{' '}
                        <span className="text-slate-900 dark:text-white">{personalInfo.phone || '—'}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 dark:text-slate-400">Location:</span>{' '}
                        <span className="text-slate-900 dark:text-white">{personalInfo.location || '—'}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 dark:text-slate-400">Profile Type:</span>{' '}
                        <span className="text-slate-900 dark:text-white capitalize">{personalInfo.profileType}</span>
                    </div>
                </div>
            </div>

            {/* Experience Summary */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Experience ({experiences.length})</h3>
                </div>
                {experiences.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No experience added</p>
                ) : (
                    <div className="space-y-3">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="text-sm border-l-2 border-primary-200 dark:border-primary-800 pl-3">
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {exp.title} <span className="text-slate-400">at</span> {exp.company}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400">
                                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Education Summary */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Education ({education.length})</h3>
                </div>
                {education.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No education added</p>
                ) : (
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id} className="text-sm border-l-2 border-primary-200 dark:border-primary-800 pl-3">
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {edu.degree} in {edu.field}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400">{edu.school}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Skills Summary */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Skills</h3>
                </div>
                <div className="space-y-2">
                    {skills.technical.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {skills.technical.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                    {skills.soft.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {skills.soft.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
                <Button
                    onClick={generateResume}
                    isLoading={isGenerating}
                    disabled={!isValid || isGenerating}
                    icon={<Sparkles className="w-5 h-5" />}
                    className="w-full"
                    size="lg"
                >
                    {isGenerating ? 'Generating with AI...' : 'Generate Resume with AI'}
                </Button>
                {!isValid && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 text-center">
                        Please add your name, email, and at least one experience to continue
                    </p>
                )}
            </div>
        </div>
    );
}
