import { useResume } from '../../context/ResumeContext';
import type { ProfileType } from '../../types';
import { User, Mail, Phone, MapPin, Linkedin, Globe, GraduationCap, Briefcase, Code } from 'lucide-react';

export function PersonalInfoStep() {
    const { rawData, updatePersonalInfo } = useResume();
    const { personalInfo } = rawData;

    const profileTypes: { value: ProfileType; label: string; description: string; icon: React.ReactNode }[] = [
        {
            value: 'student',
            label: 'Student',
            description: 'Education-focused, internships & projects',
            icon: <GraduationCap className="w-5 h-5" />,
        },
        {
            value: 'self-taught',
            label: 'Self-Taught',
            description: 'Projects & experience first',
            icon: <Code className="w-5 h-5" />,
        },
        {
            value: 'professional',
            label: 'Professional',
            description: 'Work experience focused',
            icon: <Briefcase className="w-5 h-5" />,
        },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Personal Information</h2>
                <p className="text-slate-600 dark:text-slate-400">Let's start with your basic details</p>
            </div>

            {/* Profile Type Selection */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Profile Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {profileTypes.map(({ value, label, description, icon }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => updatePersonalInfo({ profileType: value })}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200
                ${personalInfo.profileType === value
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`${personalInfo.profileType === value ? 'text-primary-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {icon}
                                </span>
                                <span className="font-medium text-slate-900 dark:text-white">{label}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <User className="w-4 h-4" />
                        Full Name *
                    </label>
                    <input
                        type="text"
                        value={personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                        className="input-field"
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Mail className="w-4 h-4" />
                        Email *
                    </label>
                    <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                        className="input-field"
                        placeholder="john@example.com"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Phone className="w-4 h-4" />
                        Phone *
                    </label>
                    <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                        className="input-field"
                        placeholder="+1 (555) 123-4567"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <MapPin className="w-4 h-4" />
                        Location *
                    </label>
                    <input
                        type="text"
                        value={personalInfo.location}
                        onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                        className="input-field"
                        placeholder="San Francisco, CA"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn (optional)
                    </label>
                    <input
                        type="url"
                        value={personalInfo.linkedin || ''}
                        onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                        className="input-field"
                        placeholder="linkedin.com/in/johndoe"
                    />
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Globe className="w-4 h-4" />
                        Portfolio (optional)
                    </label>
                    <input
                        type="url"
                        value={personalInfo.portfolio || ''}
                        onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
                        className="input-field"
                        placeholder="johndoe.dev"
                    />
                </div>
            </div>
        </div>
    );
}
