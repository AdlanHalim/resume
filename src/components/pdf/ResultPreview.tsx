import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ResumeDocument } from './ResumeDocument';
import { generateDocx } from './DocxGenerator';
import type { PolishedResumeData } from '../../types';
import { Button } from '../ui/Button';
import { FileText, RefreshCw, Eye, FileType, ChevronDown, ChevronUp, Briefcase, GraduationCap, Wrench } from 'lucide-react';

interface ResultPreviewProps {
    data: PolishedResumeData;
    onStartOver: () => void;
}

export function ResultPreview({ data, onStartOver }: ResultPreviewProps) {
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
    const fileName = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume`;

    const handleDocxDownload = async () => {
        setIsDownloadingDocx(true);
        try {
            await generateDocx(data);
        } catch (error) {
            console.error('Error generating DOCX:', error);
        } finally {
            setIsDownloadingDocx(false);
        }
    };

    const formatDate = (date: string) => {
        if (!date) return '';
        const [year, month] = date.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Resume is Ready! 🎉</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Review your AI-polished content, then download as PDF or DOCX
                    </p>
                </div>
                <Button variant="secondary" onClick={onStartOver} icon={<RefreshCw className="w-4 h-4" />}>
                    Start Over
                </Button>
            </div>

            {/* AI-Generated Summary */}
            <div className="card p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        ✨
                    </span>
                    AI-Generated Professional Summary
                </h3>
                <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">{data.personalInfo.summary}</p>
            </div>

            {/* Experience Preview */}
            <div className="card p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary-500" />
                    Experience ({data.experiences.length})
                </h3>
                <div className="space-y-4">
                    {data.experiences.map((exp) => (
                        <div key={exp.id} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4">
                            <div className="flex flex-wrap items-baseline gap-2 mb-2">
                                <h4 className="font-medium text-slate-900 dark:text-white">{exp.title}</h4>
                                <span className="text-slate-400">at</span>
                                <span className="text-slate-700 dark:text-slate-300">{exp.company}</span>
                                <span className="text-sm text-slate-500">
                                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                </span>
                            </div>
                            <ul className="space-y-1">
                                {exp.bulletPoints.map((bullet, i) => (
                                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                                        <span className="text-primary-500">•</span>
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education Preview */}
            <div className="card p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary-500" />
                    Education ({data.education.length})
                </h3>
                <div className="space-y-3">
                    {data.education.map((edu) => (
                        <div key={edu.id} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4">
                            <div className="font-medium text-slate-900 dark:text-white">
                                {edu.degree} in {edu.field}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                {edu.school} • {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                                {edu.gpa && ` • GPA: ${edu.gpa}`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills Preview */}
            <div className="card p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary-500" />
                    Skills
                </h3>
                <div className="space-y-2">
                    {data.skills.technical.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Technical:</span>
                            {data.skills.technical.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 text-sm rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                    {data.skills.soft.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Soft Skills:</span>
                            {data.skills.soft.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Download Options */}
            <div className="card p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Download Your Resume</h3>
                <div className="flex flex-wrap gap-3">
                    <PDFDownloadLink
                        document={<ResumeDocument data={data} />}
                        fileName={`${fileName}.pdf`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 
                       text-white font-medium rounded-xl shadow-lg shadow-red-500/25
                       hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/30
                       transition-all duration-200"
                    >
                        {({ loading }) => (
                            <>
                                <FileText className="w-4 h-4" />
                                {loading ? 'Preparing...' : 'Download PDF'}
                            </>
                        )}
                    </PDFDownloadLink>

                    <Button
                        onClick={handleDocxDownload}
                        isLoading={isDownloadingDocx}
                        icon={<FileType className="w-4 h-4" />}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25 hover:shadow-blue-500/30"
                    >
                        Download DOCX
                    </Button>
                </div>
            </div>

            {/* PDF Preview Toggle */}
            <div className="card overflow-hidden">
                <button
                    onClick={() => setShowPdfPreview(!showPdfPreview)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-primary-500" />
                        <span className="font-medium text-slate-900 dark:text-white">Preview PDF</span>
                    </div>
                    {showPdfPreview ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {showPdfPreview && (
                    <div className="border-t border-slate-200 dark:border-slate-700">
                        <div className="bg-slate-100 dark:bg-slate-900 p-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{fileName}.pdf</span>
                        </div>
                        <div className="h-[600px] lg:h-[800px]">
                            <PDFViewer width="100%" height="100%" showToolbar={false}>
                                <ResumeDocument data={data} />
                            </PDFViewer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
