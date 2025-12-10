import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { PolishedResumeData } from '../../types';

// Register fonts
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2', fontWeight: 500 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2', fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Inter',
        fontSize: 10,
        color: '#1a1a2e',
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb',
        paddingBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 4,
    },
    contactItem: {
        fontSize: 9,
        color: '#475569',
    },
    contactLink: {
        fontSize: 9,
        color: '#2563eb',
        textDecoration: 'none',
    },
    summary: {
        fontSize: 10,
        color: '#334155',
        lineHeight: 1.5,
        marginTop: 10,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 4,
    },
    experienceItem: {
        marginBottom: 12,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    expTitle: {
        fontSize: 11,
        fontWeight: 600,
        color: '#0f172a',
    },
    expDate: {
        fontSize: 9,
        color: '#64748b',
        fontWeight: 500,
    },
    expCompany: {
        fontSize: 10,
        color: '#475569',
        marginBottom: 4,
    },
    bulletPoints: {
        paddingLeft: 12,
    },
    bullet: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    bulletDot: {
        width: 12,
        fontSize: 10,
        color: '#2563eb',
    },
    bulletText: {
        flex: 1,
        fontSize: 9,
        color: '#334155',
        lineHeight: 1.4,
    },
    educationItem: {
        marginBottom: 8,
    },
    eduHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    eduDegree: {
        fontSize: 11,
        fontWeight: 600,
        color: '#0f172a',
    },
    eduSchool: {
        fontSize: 10,
        color: '#475569',
    },
    eduDetails: {
        fontSize: 9,
        color: '#64748b',
        marginTop: 2,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillCategory: {
        marginBottom: 6,
    },
    skillLabel: {
        fontSize: 9,
        fontWeight: 600,
        color: '#475569',
        marginBottom: 3,
    },
    skillTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    skillTag: {
        fontSize: 8,
        color: '#334155',
        backgroundColor: '#f1f5f9',
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
    },
});

interface ResumeDocumentProps {
    data: PolishedResumeData;
}

export function ResumeDocument({ data }: ResumeDocumentProps) {
    const { personalInfo, experiences, education, skills } = data;
    const isStudent = personalInfo.profileType === 'student';

    const formatDate = (date: string) => {
        if (!date) return '';
        const [year, month] = date.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const ExperienceSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experiences.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                    <View style={styles.expHeader}>
                        <Text style={styles.expTitle}>{exp.title}</Text>
                        <Text style={styles.expDate}>
                            {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </Text>
                    </View>
                    <Text style={styles.expCompany}>
                        {exp.company}
                        {exp.technologies && exp.technologies.length > 0 && ` • ${exp.technologies.join(', ')}`}
                    </Text>
                    <View style={styles.bulletPoints}>
                        {exp.bulletPoints.map((bullet, i) => (
                            <View key={i} style={styles.bullet}>
                                <Text style={styles.bulletDot}>•</Text>
                                <Text style={styles.bulletText}>{bullet}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    const EducationSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
                <View key={edu.id} style={styles.educationItem}>
                    <View style={styles.eduHeader}>
                        <Text style={styles.eduDegree}>{edu.degree} in {edu.field}</Text>
                        <Text style={styles.expDate}>
                            {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
                        </Text>
                    </View>
                    <Text style={styles.eduSchool}>{edu.school}</Text>
                    {(edu.gpa || edu.achievements) && (
                        <Text style={styles.eduDetails}>
                            {edu.gpa && `GPA: ${edu.gpa}`}
                            {edu.gpa && edu.achievements && ' | '}
                            {edu.achievements}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );

    const SkillsSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.technical.length > 0 && (
                <View style={styles.skillCategory}>
                    <Text style={styles.skillLabel}>Technical Skills</Text>
                    <View style={styles.skillTags}>
                        {skills.technical.map((skill, i) => (
                            <Text key={i} style={styles.skillTag}>{skill}</Text>
                        ))}
                    </View>
                </View>
            )}
            {skills.soft.length > 0 && (
                <View style={styles.skillCategory}>
                    <Text style={styles.skillLabel}>Soft Skills</Text>
                    <View style={styles.skillTags}>
                        {skills.soft.map((skill, i) => (
                            <Text key={i} style={styles.skillTag}>{skill}</Text>
                        ))}
                    </View>
                </View>
            )}
            {skills.languages && skills.languages.length > 0 && (
                <View style={styles.skillCategory}>
                    <Text style={styles.skillLabel}>Languages</Text>
                    <View style={styles.skillTags}>
                        {skills.languages.map((lang, i) => (
                            <Text key={i} style={styles.skillTag}>{lang}</Text>
                        ))}
                    </View>
                </View>
            )}
            {skills.certifications && skills.certifications.length > 0 && (
                <View style={styles.skillCategory}>
                    <Text style={styles.skillLabel}>Certifications</Text>
                    <View style={styles.skillTags}>
                        {skills.certifications.map((cert, i) => (
                            <Text key={i} style={styles.skillTag}>{cert}</Text>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personalInfo.fullName}</Text>
                    <View style={styles.contactRow}>
                        <Text style={styles.contactItem}>{personalInfo.email}</Text>
                        <Text style={styles.contactItem}>•</Text>
                        <Text style={styles.contactItem}>{personalInfo.phone}</Text>
                        <Text style={styles.contactItem}>•</Text>
                        <Text style={styles.contactItem}>{personalInfo.location}</Text>
                        {personalInfo.linkedin && (
                            <>
                                <Text style={styles.contactItem}>•</Text>
                                <Link src={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} style={styles.contactLink}>
                                    LinkedIn
                                </Link>
                            </>
                        )}
                        {personalInfo.portfolio && (
                            <>
                                <Text style={styles.contactItem}>•</Text>
                                <Link src={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} style={styles.contactLink}>
                                    Portfolio
                                </Link>
                            </>
                        )}
                    </View>
                    {personalInfo.summary && (
                        <Text style={styles.summary}>{personalInfo.summary}</Text>
                    )}
                </View>

                {/* Conditional section ordering based on profile type */}
                {isStudent ? (
                    <>
                        <EducationSection />
                        <ExperienceSection />
                        <SkillsSection />
                    </>
                ) : (
                    <>
                        <ExperienceSection />
                        <EducationSection />
                        <SkillsSection />
                    </>
                )}
            </Page>
        </Document>
    );
}
