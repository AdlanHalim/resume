import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ResumeDocument } from './ResumeDocument';
import type { PolishedResumeData } from '../../types';
import { Button } from '../ui/Button';
import { Download, FileText, RefreshCw } from 'lucide-react';

interface PDFPreviewProps {
    data: PolishedResumeData;
    onStartOver: () => void;
}

export function PDFPreview({ data, onStartOver }: PDFPreviewProps) {
    const fileName = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Resume is Ready! 🎉</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Preview your AI-polished resume below
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={onStartOver} icon={<RefreshCw className="w-4 h-4" />}>
                        Start Over
                    </Button>
                    <PDFDownloadLink
                        document={<ResumeDocument data={data} />}
                        fileName={fileName}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 
                       text-white font-medium rounded-xl shadow-lg shadow-primary-500/25
                       hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:shadow-primary-500/30
                       transition-all duration-200"
                    >
                        {({ loading }) => (
                            <>
                                <Download className="w-4 h-4" />
                                {loading ? 'Preparing...' : 'Download PDF'}
                            </>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="card overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-900 p-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{fileName}</span>
                </div>
                <div className="h-[600px] lg:h-[800px]">
                    <PDFViewer width="100%" height="100%" showToolbar={false}>
                        <ResumeDocument data={data} />
                    </PDFViewer>
                </div>
            </div>

            {/* AI-Generated Summary Preview */}
            <div className="card p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">AI-Generated Professional Summary</h3>
                <p className="text-slate-600 dark:text-slate-400 italic">{data.personalInfo.summary}</p>
            </div>
        </div>
    );
}
