import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import type { EducationEntry } from '../../types';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

function generateId() {
    return Math.random().toString(36).substring(2, 11);
}

const DEGREE_OPTIONS = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor of Arts (BA)',
    'Bachelor of Science (BS)',
    'Bachelor of Engineering (BE)',
    'Master of Arts (MA)',
    'Master of Science (MS)',
    'Master of Business Administration (MBA)',
    'Doctor of Philosophy (PhD)',
    'Doctor of Medicine (MD)',
    'Juris Doctor (JD)',
    'Certificate',
    'Bootcamp',
    'Other',
];

interface EducationCardProps {
    education: EducationEntry;
    onUpdate: (edu: Partial<EducationEntry>) => void;
    onRemove: () => void;
}

function EducationCard({ education, onUpdate, onRemove }: EducationCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [customDegree, setCustomDegree] = useState(
        !DEGREE_OPTIONS.includes(education.degree) && education.degree ? education.degree : ''
    );

    const handleDegreeChange = (value: string) => {
        if (value === 'Other') {
            onUpdate({ degree: customDegree || 'Other' });
        } else {
            onUpdate({ degree: value });
            setCustomDegree('');
        }
    };

    const handleCustomDegreeChange = (value: string) => {
        setCustomDegree(value);
        onUpdate({ degree: value });
    };

    const isCustomDegree = !DEGREE_OPTIONS.includes(education.degree) || education.degree === 'Other';

    return (
        <div className="card p-4 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-3 text-left flex-1"
                >
                    <span className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        <GraduationCap className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                            {education.degree || 'Degree'} {education.field && `in ${education.field}`}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {education.school || 'School Name'}
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
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">School / University *</label>
                            <input
                                type="text"
                                value={education.school}
                                onChange={(e) => onUpdate({ school: e.target.value })}
                                className="input-field"
                                placeholder="University of California, Berkeley"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Degree *</label>
                            <select
                                value={DEGREE_OPTIONS.includes(education.degree) ? education.degree : 'Other'}
                                onChange={(e) => handleDegreeChange(e.target.value)}
                                className="input-field"
                            >
                                <option value="">Select Degree</option>
                                {DEGREE_OPTIONS.map(degree => (
                                    <option key={degree} value={degree}>{degree}</option>
                                ))}
                            </select>
                            {isCustomDegree && (
                                <input
                                    type="text"
                                    value={customDegree}
                                    onChange={(e) => handleCustomDegreeChange(e.target.value)}
                                    className="input-field mt-2"
                                    placeholder="Enter custom degree"
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Field of Study *</label>
                            <input
                                type="text"
                                value={education.field}
                                onChange={(e) => onUpdate({ field: e.target.value })}
                                className="input-field"
                                placeholder="Computer Science"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">GPA (optional)</label>
                            <input
                                type="text"
                                value={education.gpa || ''}
                                onChange={(e) => {
                                    // Only allow numbers, dots, and forward slash
                                    const value = e.target.value.replace(/[^0-9./]/g, '');
                                    onUpdate({ gpa: value });
                                }}
                                className="input-field"
                                placeholder="3.8/4.0 or 3.8"
                                pattern="[0-9.\/]+"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DatePicker
                            label="Start Date"
                            value={education.startDate}
                            onChange={(value) => onUpdate({ startDate: value })}
                            required
                        />
                        <DatePicker
                            label="End Date"
                            value={education.endDate}
                            onChange={(value) => onUpdate({ endDate: value })}
                            disabled={education.current}
                        />
                        <div className="flex items-end pb-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={education.current}
                                    onChange={(e) => onUpdate({ current: e.target.checked, endDate: e.target.checked ? '' : education.endDate })}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Currently Enrolled</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Achievements & Activities (optional)</label>
                        <textarea
                            value={education.achievements || ''}
                            onChange={(e) => onUpdate({ achievements: e.target.value })}
                            className="input-field min-h-[80px] resize-y"
                            placeholder="Dean's List, Student Organizations, Awards, Relevant Coursework..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export function EducationStep() {
    const { rawData, addEducation, updateEducation, removeEducation } = useResume();
    const { education } = rawData;

    const handleAddEducation = () => {
        const newEdu: EducationEntry = {
            id: generateId(),
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            current: false,
            gpa: '',
            achievements: '',
        };
        addEducation(newEdu);
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Education</h2>
                <p className="text-slate-600 dark:text-slate-400">Add your educational background</p>
            </div>

            <Button variant="secondary" size="sm" onClick={handleAddEducation} icon={<Plus className="w-4 h-4" />}>
                Add Education
            </Button>

            {education.length === 0 ? (
                <div className="card p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <GraduationCap className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No education added yet</h3>
                    <p className="text-slate-500 dark:text-slate-400">Add your degrees, certifications, or relevant coursework</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {education.map((edu) => (
                        <EducationCard
                            key={edu.id}
                            education={edu}
                            onUpdate={(updates) => updateEducation(edu.id, updates)}
                            onRemove={() => removeEducation(edu.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
