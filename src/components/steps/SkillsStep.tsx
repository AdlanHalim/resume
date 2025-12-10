import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { X, Code, Users, Languages, Award } from 'lucide-react';

interface SkillTagInputProps {
    label: string;
    icon: React.ReactNode;
    skills: string[];
    onChange: (skills: string[]) => void;
    placeholder: string;
}

function SkillTagInput({ label, icon, skills, onChange, placeholder }: SkillTagInputProps) {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const trimmed = input.trim();
            if (trimmed && !skills.includes(trimmed)) {
                onChange([...skills, trimmed]);
            }
            setInput('');
        } else if (e.key === 'Backspace' && !input && skills.length > 0) {
            onChange(skills.slice(0, -1));
        }
    };

    const removeSkill = (index: number) => {
        onChange(skills.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {icon}
                {label}
            </label>
            <div className="input-field min-h-[48px] flex flex-wrap gap-2 p-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                       bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="p-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-w-[150px] bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder={skills.length === 0 ? placeholder : 'Add more...'}
                />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Press Enter or comma to add</p>
        </div>
    );
}

export function SkillsStep() {
    const { rawData, updateSkills } = useResume();
    const { skills } = rawData;

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Skills</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Add your technical skills, soft skills, and languages
                </p>
            </div>

            <div className="space-y-6">
                <SkillTagInput
                    label="Technical Skills"
                    icon={<Code className="w-4 h-4" />}
                    skills={skills.technical}
                    onChange={(technical) => updateSkills({ technical })}
                    placeholder="JavaScript, React, Python, AWS..."
                />

                <SkillTagInput
                    label="Soft Skills"
                    icon={<Users className="w-4 h-4" />}
                    skills={skills.soft}
                    onChange={(soft) => updateSkills({ soft })}
                    placeholder="Leadership, Communication, Problem Solving..."
                />

                <SkillTagInput
                    label="Languages (optional)"
                    icon={<Languages className="w-4 h-4" />}
                    skills={skills.languages || []}
                    onChange={(languages) => updateSkills({ languages })}
                    placeholder="English (Native), Spanish (Fluent)..."
                />

                <SkillTagInput
                    label="Certifications (optional)"
                    icon={<Award className="w-4 h-4" />}
                    skills={skills.certifications || []}
                    onChange={(certifications) => updateSkills({ certifications })}
                    placeholder="AWS Solutions Architect, PMP..."
                />
            </div>
        </div>
    );
}
