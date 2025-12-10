import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import type { ExperienceBlock, ExperienceType } from '../../types';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { Plus, Trash2, Briefcase, FolderGit2, Heart, ChevronDown, ChevronUp } from 'lucide-react';

function generateId() {
    return Math.random().toString(36).substring(2, 11);
}

interface ExperienceCardProps {
    experience: ExperienceBlock;
    onUpdate: (exp: Partial<ExperienceBlock>) => void;
    onRemove: () => void;
}

function ExperienceCard({ experience, onUpdate, onRemove }: ExperienceCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const typeConfig = {
        job: { label: 'Work Experience', icon: <Briefcase className="w-4 h-4" />, titleLabel: 'Job Title', companyLabel: 'Company' },
        project: { label: 'Project', icon: <FolderGit2 className="w-4 h-4" />, titleLabel: 'Project Name', companyLabel: 'Description' },
        volunteer: { label: 'Volunteer', icon: <Heart className="w-4 h-4" />, titleLabel: 'Role', companyLabel: 'Organization' },
    };

    const config = typeConfig[experience.type];

    return (
        <div className="card p-4 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-3 text-left flex-1"
                >
                    <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        {config.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                            {experience.title || config.titleLabel}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {experience.company || config.companyLabel}
                        </p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                <Button variant="ghost" size="sm" onClick={onRemove} className="ml-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {isExpanded && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                {config.titleLabel} *
                            </label>
                            <input
                                type="text"
                                value={experience.title}
                                onChange={(e) => onUpdate({ title: e.target.value })}
                                className="input-field"
                                placeholder={config.titleLabel}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                {config.companyLabel} *
                            </label>
                            <input
                                type="text"
                                value={experience.company}
                                onChange={(e) => onUpdate({ company: e.target.value })}
                                className="input-field"
                                placeholder={config.companyLabel}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DatePicker
                            label="Start Date"
                            value={experience.startDate}
                            onChange={(value) => onUpdate({ startDate: value })}
                            required
                        />
                        <DatePicker
                            label="End Date"
                            value={experience.endDate}
                            onChange={(value) => onUpdate({ endDate: value })}
                            disabled={experience.current}
                        />
                        <div className="flex items-end pb-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={experience.current}
                                    onChange={(e) => onUpdate({ current: e.target.checked, endDate: e.target.checked ? '' : experience.endDate })}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Current</span>
                            </label>
                        </div>
                    </div>

                    {experience.type === 'project' && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Technologies Used</label>
                            <input
                                type="text"
                                value={experience.technologies?.join(', ') || ''}
                                onChange={(e) => onUpdate({ technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                className="input-field"
                                placeholder="React, TypeScript, Node.js (comma separated)"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            What did you do? * <span className="text-slate-400 font-normal">(AI will polish this)</span>
                        </label>
                        <textarea
                            value={experience.description}
                            onChange={(e) => onUpdate({ description: e.target.value })}
                            className="input-field min-h-[120px] resize-y"
                            placeholder="Describe your responsibilities, achievements, and impact. Be specific about what you built, problems you solved, and any metrics or results. Don't worry about formatting - our AI will create professional bullet points."
                            required
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export function ExperienceStep() {
    const { rawData, addExperience, updateExperience, removeExperience } = useResume();
    const { experiences } = rawData;

    const handleAddExperience = (type: ExperienceType) => {
        const newExp: ExperienceBlock = {
            id: generateId(),
            type,
            title: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            technologies: type === 'project' ? [] : undefined,
        };
        addExperience(newExp);
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Experience</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Add your work experience, projects, and volunteer work
                </p>
            </div>

            {/* Add buttons */}
            <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => handleAddExperience('job')} icon={<Plus className="w-4 h-4" />}>
                    Add Job
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleAddExperience('project')} icon={<Plus className="w-4 h-4" />}>
                    Add Project
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleAddExperience('volunteer')} icon={<Plus className="w-4 h-4" />}>
                    Add Volunteer
                </Button>
            </div>

            {/* Experience cards */}
            {experiences.length === 0 ? (
                <div className="card p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No experience added yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                        Add your work experience, personal projects, or volunteer work
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <ExperienceCard
                            key={exp.id}
                            experience={exp}
                            onUpdate={(updates) => updateExperience(exp.id, updates)}
                            onRemove={() => removeExperience(exp.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
