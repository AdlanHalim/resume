import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import type { PolishedResumeData } from '../../types';

function formatDate(date: string): string {
    if (!date) return '';
    const [year, month] = date.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export async function generateDocx(data: PolishedResumeData): Promise<void> {
    const { personalInfo, experiences, education, skills } = data;
    const isStudent = personalInfo.profileType === 'student';

    const children: Paragraph[] = [];

    // Header - Name
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: personalInfo.fullName,
                    bold: true,
                    size: 48, // 24pt
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
        })
    );

    // Contact line
    const contactParts = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.location,
    ].filter(Boolean);

    if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
    if (personalInfo.portfolio) contactParts.push(personalInfo.portfolio);

    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: contactParts.join(' | '),
                    size: 20, // 10pt
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            border: {
                bottom: { style: BorderStyle.SINGLE, size: 12, color: '2563eb' },
            },
        })
    );

    // Summary
    if (personalInfo.summary) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: personalInfo.summary,
                        italics: true,
                        size: 20,
                    }),
                ],
                spacing: { before: 200, after: 300 },
            })
        );
    }

    // Helper function to add a section
    const addSection = (title: string, content: Paragraph[]) => {
        children.push(
            new Paragraph({
                text: title.toUpperCase(),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 100 },
                border: {
                    bottom: { style: BorderStyle.SINGLE, size: 6, color: 'cccccc' },
                },
            })
        );
        children.push(...content);
    };

    // Experience section
    const experienceContent: Paragraph[] = [];
    for (const exp of experiences) {
        experienceContent.push(
            new Paragraph({
                children: [
                    new TextRun({ text: exp.title, bold: true, size: 22 }),
                    new TextRun({ text: ` at ${exp.company}`, size: 22 }),
                    new TextRun({
                        text: `  |  ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`,
                        size: 18,
                        color: '666666',
                    }),
                ],
                spacing: { before: 150 },
            })
        );

        for (const bullet of exp.bulletPoints) {
            experienceContent.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `• ${bullet}`, size: 20 }),
                    ],
                    spacing: { before: 50 },
                    indent: { left: 360 },
                })
            );
        }
    }

    // Education section
    const educationContent: Paragraph[] = [];
    for (const edu of education) {
        educationContent.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 22 }),
                    new TextRun({
                        text: `  |  ${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}`,
                        size: 18,
                        color: '666666',
                    }),
                ],
                spacing: { before: 150 },
            })
        );
        educationContent.push(
            new Paragraph({
                children: [
                    new TextRun({ text: edu.school, size: 20 }),
                    ...(edu.gpa ? [new TextRun({ text: ` | GPA: ${edu.gpa}`, size: 20, color: '666666' })] : []),
                ],
            })
        );
        if (edu.achievements) {
            educationContent.push(
                new Paragraph({
                    children: [new TextRun({ text: edu.achievements, size: 18, italics: true })],
                    spacing: { before: 50 },
                })
            );
        }
    }

    // Skills section
    const skillsContent: Paragraph[] = [];
    if (skills.technical.length > 0) {
        skillsContent.push(
            new Paragraph({
                children: [
                    new TextRun({ text: 'Technical: ', bold: true, size: 20 }),
                    new TextRun({ text: skills.technical.join(', '), size: 20 }),
                ],
                spacing: { before: 100 },
            })
        );
    }
    if (skills.soft.length > 0) {
        skillsContent.push(
            new Paragraph({
                children: [
                    new TextRun({ text: 'Soft Skills: ', bold: true, size: 20 }),
                    new TextRun({ text: skills.soft.join(', '), size: 20 }),
                ],
            })
        );
    }
    if (skills.languages && skills.languages.length > 0) {
        skillsContent.push(
            new Paragraph({
                children: [
                    new TextRun({ text: 'Languages: ', bold: true, size: 20 }),
                    new TextRun({ text: skills.languages.join(', '), size: 20 }),
                ],
            })
        );
    }

    // Add sections based on profile type
    if (isStudent) {
        addSection('Education', educationContent);
        addSection('Experience', experienceContent);
    } else {
        addSection('Experience', experienceContent);
        addSection('Education', educationContent);
    }
    addSection('Skills', skillsContent);

    const doc = new Document({
        sections: [{
            properties: {},
            children,
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`);
}
