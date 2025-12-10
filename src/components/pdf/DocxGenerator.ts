import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, TabStopType, TabStopPosition } from 'docx';
import { saveAs } from 'file-saver';
import type { PolishedResumeData, PolishedExperience } from '../../types';

function formatDate(date: string): string {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}

function createSectionHeader(title: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 22, // 11pt
            }),
        ],
        border: {
            bottom: { style: BorderStyle.SINGLE, size: 12, color: '2d5986' },
        },
        spacing: { before: 240, after: 120 },
    });
}

function createBulletPoint(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: `• ${text}`,
                size: 20, // 10pt
            }),
        ],
        indent: { left: 360 },
        spacing: { after: 40 },
    });
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
                    text: personalInfo.fullName.toUpperCase(),
                    bold: true,
                    size: 44, // 22pt
                    color: '1a365d',
                }),
            ],
            spacing: { after: 40 },
        })
    );

    // Tagline from first sentence of summary
    if (personalInfo.summary) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: personalInfo.summary.split('.')[0].trim(),
                        size: 24, // 12pt
                        color: '333333',
                    }),
                ],
                spacing: { after: 160 },
            })
        );
    }

    // Contact Info Grid
    const contactInfo = [
        { label: 'Phone Number', value: personalInfo.phone },
        { label: 'Email', value: personalInfo.email },
        { label: 'LinkedIn', value: personalInfo.linkedin },
        { label: 'Address', value: personalInfo.location },
    ].filter(c => c.value);

    for (const contact of contactInfo) {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: contact.label, size: 20 }),
                    new TextRun({ text: '\t:\t', size: 20 }),
                    new TextRun({
                        text: contact.value || '',
                        size: 20,
                        color: contact.label === 'Email' || contact.label === 'LinkedIn' ? '2d5986' : '000000',
                    }),
                ],
                tabStops: [
                    { type: TabStopType.LEFT, position: TabStopPosition.MAX / 10 },
                ],
                spacing: { after: 40 },
            })
        );
    }

    // Summary Section
    if (personalInfo.summary) {
        children.push(createSectionHeader('Summary'));
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: personalInfo.summary, size: 20 }),
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 120 },
            })
        );
    }

    // Helper function to add experience items
    const addExperienceSection = (title: string, items: PolishedExperience[]) => {
        if (items.length === 0) return;

        children.push(createSectionHeader(title));

        for (const item of items) {
            // Title and date
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: item.title, bold: true, size: 22 }),
                        new TextRun({ text: '\t', size: 22 }),
                        new TextRun({
                            text: `${formatDate(item.startDate)}-${item.current ? 'Present' : formatDate(item.endDate)}`,
                            size: 20,
                        }),
                    ],
                    tabStops: [
                        { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
                    ],
                    spacing: { before: 120 },
                })
            );

            // Company/Description
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: item.company + (item.technologies && item.technologies.length > 0 ? ` | ${item.technologies.join(', ')}` : ''),
                            italics: true,
                            size: 20,
                            color: '333333',
                        }),
                    ],
                    spacing: { after: 60 },
                })
            );

            // Bullets
            for (const bullet of item.bulletPoints) {
                children.push(createBulletPoint(bullet));
            }
        }
    };

    // Education Section
    const addEducationSection = () => {
        if (education.length === 0) return;

        children.push(createSectionHeader('Education'));

        for (const edu of education) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `${edu.degree} (${edu.field})`, bold: true, size: 22 }),
                        new TextRun({ text: '\t', size: 22 }),
                        new TextRun({
                            text: `${formatDate(edu.startDate)}-${edu.current ? 'Present' : formatDate(edu.endDate)}`,
                            size: 20,
                        }),
                    ],
                    tabStops: [
                        { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
                    ],
                    spacing: { before: 120 },
                })
            );

            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.school, italics: true, size: 20, color: '333333' }),
                    ],
                })
            );

            if (edu.gpa) {
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `CGPA: ${edu.gpa}`, size: 20 }),
                        ],
                    })
                );
            }
        }
    };

    // Skills Section
    const addSkillsSection = () => {
        children.push(createSectionHeader('Skills'));

        if (skills.soft.length > 0) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Interpersonal: ', bold: true, size: 20 }),
                        new TextRun({ text: skills.soft.join(', '), size: 20 }),
                    ],
                    spacing: { after: 60 },
                })
            );
        }

        if (skills.technical.length > 0) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Technical: ', bold: true, size: 20 }),
                        new TextRun({ text: skills.technical.join(', '), size: 20 }),
                    ],
                    spacing: { after: 60 },
                })
            );
        }

        if (skills.languages && skills.languages.length > 0) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Languages: ', bold: true, size: 20 }),
                        new TextRun({ text: skills.languages.join(', '), size: 20 }),
                    ],
                })
            );
        }
    };

    // Certifications Section
    const addCertificationsSection = () => {
        if (!skills.certifications || skills.certifications.length === 0) return;

        children.push(createSectionHeader('Certification'));

        for (const cert of skills.certifications) {
            children.push(createBulletPoint(cert));
        }
    };

    // Build sections based on profile type
    const jobs = experiences.filter(e => e.type === 'job');
    const projects = experiences.filter(e => e.type === 'project');
    const volunteer = experiences.filter(e => e.type === 'volunteer');

    if (isStudent) {
        addEducationSection();
        addExperienceSection('Work Experience', jobs);
        addExperienceSection('Academic Projects', projects);
        addExperienceSection('Extracurricular Activities', volunteer);
        addSkillsSection();
        addCertificationsSection();
    } else {
        addExperienceSection('Work Experience', jobs);
        addExperienceSection('Projects', projects);
        addExperienceSection('Volunteer Experience', volunteer);
        addEducationSection();
        addSkillsSection();
        addCertificationsSection();
    }

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 720,
                        bottom: 720,
                        left: 720,
                        right: 720,
                    },
                },
            },
            children,
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`);
}
