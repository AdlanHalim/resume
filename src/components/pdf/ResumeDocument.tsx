import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { PolishedResumeData } from '../../types';

// Using Helvetica (built-in) for ATS compatibility and reliability

const ACCENT_COLOR = '#2d5986';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        paddingTop: 35,
        paddingBottom: 35,
        fontFamily: 'Helvetica',
        fontSize: 11,
        color: '#000000',
        backgroundColor: '#ffffff',
        lineHeight: 1.3,
    },
    // Header styles
    headerContainer: {
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: 700,
        color: '#1a365d',
        marginBottom: 2,
    },
    tagline: {
        fontSize: 12,
        color: '#333333',
        marginBottom: 8,
    },
    contactGrid: {
        marginBottom: 0,
    },
    contactRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    contactLabel: {
        width: 75,
        fontSize: 10,
        color: '#000000',
    },
    contactColon: {
        width: 10,
        fontSize: 10,
        color: '#000000',
    },
    contactValue: {
        flex: 1,
        fontSize: 10,
        color: '#000000',
    },
    contactLink: {
        fontSize: 10,
        color: ACCENT_COLOR,
        textDecoration: 'none',
    },
    // Section styles
    section: {
        marginBottom: 12,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: 700,
        color: '#000000',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: ACCENT_COLOR,
        paddingBottom: 2,
        marginBottom: 6,
    },
    // Summary
    summaryText: {
        fontSize: 10,
        color: '#000000',
        lineHeight: 1.4,
        textAlign: 'justify',
    },
    // Education & Experience items
    itemContainer: {
        marginBottom: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,
    },
    itemTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: '#000000',
        flex: 1,
    },
    itemDate: {
        fontSize: 10,
        color: '#000000',
        textAlign: 'right',
    },
    itemSubtitle: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#333333',
        marginBottom: 2,
    },
    itemDetail: {
        fontSize: 10,
        color: '#000000',
    },
    // Bullet points
    bulletContainer: {
        marginTop: 3,
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    bulletDot: {
        width: 15,
        fontSize: 10,
        color: '#000000',
        paddingLeft: 5,
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        color: '#000000',
        lineHeight: 1.35,
        textAlign: 'justify',
    },
    // Skills inline format
    skillRow: {
        flexDirection: 'row',
        marginBottom: 3,
        flexWrap: 'wrap',
    },
    skillLabel: {
        fontSize: 10,
        fontWeight: 700,
        color: '#000000',
        marginRight: 5,
    },
    skillText: {
        fontSize: 10,
        color: '#000000',
        flex: 1,
    },
    // Certifications
    certItem: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    certDot: {
        width: 15,
        fontSize: 10,
    },
    certText: {
        fontSize: 10,
        color: '#000000',
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
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    };

    // Header Section
    const HeaderSection = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.name}>{personalInfo.fullName.toUpperCase()}</Text>
            {personalInfo.summary && (
                <Text style={styles.tagline}>
                    {personalInfo.summary.split('.')[0].trim()}
                </Text>
            )}
            <View style={styles.contactGrid}>
                <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>Phone Number</Text>
                    <Text style={styles.contactColon}>:</Text>
                    <Text style={styles.contactValue}>{personalInfo.phone}</Text>
                </View>
                <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactColon}>:</Text>
                    <Link src={`mailto:${personalInfo.email}`} style={styles.contactLink}>
                        {personalInfo.email}
                    </Link>
                </View>
                {personalInfo.linkedin && (
                    <View style={styles.contactRow}>
                        <Text style={styles.contactLabel}>LinkedIn</Text>
                        <Text style={styles.contactColon}>:</Text>
                        <Link
                            src={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                            style={styles.contactLink}
                        >
                            {personalInfo.linkedin.replace(/^https?:\/\//, '')}
                        </Link>
                    </View>
                )}
                <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>Address</Text>
                    <Text style={styles.contactColon}>:</Text>
                    <Text style={styles.contactValue}>{personalInfo.location}</Text>
                </View>
            </View>
        </View>
    );

    // Summary Section
    const SummarySection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>SUMMARY</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
        </View>
    );

    // Education Section
    const EducationSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>EDUCATION</Text>
            {education.map((edu) => (
                <View key={edu.id} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{edu.degree} ({edu.field})</Text>
                        <Text style={styles.itemDate}>
                            {formatDate(edu.startDate)}-{edu.current ? 'Present' : formatDate(edu.endDate)}
                        </Text>
                    </View>
                    <Text style={styles.itemSubtitle}>{edu.school}</Text>
                    {edu.gpa && <Text style={styles.itemDetail}>CGPA: {edu.gpa}</Text>}
                    {edu.achievements && (
                        <View style={styles.bulletContainer}>
                            {edu.achievements.split('\n').filter(Boolean).map((achievement, i) => (
                                <View key={i} style={styles.bulletRow}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{achievement.trim()}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );

    // Work Experience Section
    const ExperienceSection = () => {
        const jobs = experiences.filter(e => e.type === 'job');
        if (jobs.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>WORK EXPERIENCE</Text>
                {jobs.map((exp) => (
                    <View key={exp.id} style={styles.itemContainer}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>{exp.title}</Text>
                            <Text style={styles.itemDate}>
                                {formatDate(exp.startDate)}-{exp.current ? 'Present' : formatDate(exp.endDate)}
                            </Text>
                        </View>
                        <Text style={styles.itemSubtitle}>{exp.company}</Text>
                        <View style={styles.bulletContainer}>
                            {exp.bulletPoints.map((bullet, i) => (
                                <View key={i} style={styles.bulletRow}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    // Academic Projects Section
    const ProjectsSection = () => {
        const projects = experiences.filter(e => e.type === 'project');
        if (projects.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>ACADEMIC PROJECTS</Text>
                {projects.map((proj) => (
                    <View key={proj.id} style={styles.itemContainer}>
                        <Text style={styles.itemTitle}>{proj.title}</Text>
                        <Text style={styles.itemSubtitle}>
                            {proj.company}
                            {proj.technologies && proj.technologies.length > 0 && ` | ${proj.technologies.join(', ')}`}
                        </Text>
                        <View style={styles.bulletContainer}>
                            {proj.bulletPoints.map((bullet, i) => (
                                <View key={i} style={styles.bulletRow}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    // Volunteer/Extracurricular Section
    const VolunteerSection = () => {
        const volunteer = experiences.filter(e => e.type === 'volunteer');
        if (volunteer.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>EXTRACURRICULAR ACTIVITIES</Text>
                {volunteer.map((vol) => (
                    <View key={vol.id} style={styles.itemContainer}>
                        <Text style={styles.itemTitle}>{vol.company} – {vol.title}</Text>
                        <View style={styles.bulletContainer}>
                            {vol.bulletPoints.map((bullet, i) => (
                                <View key={i} style={styles.bulletRow}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    // Skills Section
    const SkillsSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>SKILLS</Text>
            {skills.soft.length > 0 && (
                <View style={styles.skillRow}>
                    <Text style={styles.skillLabel}>Interpersonal:</Text>
                    <Text style={styles.skillText}>{skills.soft.join(', ')}</Text>
                </View>
            )}
            {skills.technical.length > 0 && (
                <View style={styles.skillRow}>
                    <Text style={styles.skillLabel}>Technical:</Text>
                    <Text style={styles.skillText}>{skills.technical.join(', ')}</Text>
                </View>
            )}
            {skills.languages && skills.languages.length > 0 && (
                <View style={styles.skillRow}>
                    <Text style={styles.skillLabel}>Languages:</Text>
                    <Text style={styles.skillText}>{skills.languages.join(', ')}</Text>
                </View>
            )}
        </View>
    );

    // Certifications Section
    const CertificationsSection = () => {
        if (!skills.certifications || skills.certifications.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>CERTIFICATION</Text>
                {skills.certifications.map((cert, i) => (
                    <View key={i} style={styles.certItem}>
                        <Text style={styles.certDot}>•</Text>
                        <Text style={styles.certText}>{cert}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <HeaderSection />

                {personalInfo.summary && <SummarySection />}

                {/* Conditional section ordering based on profile type */}
                {isStudent ? (
                    <>
                        <EducationSection />
                        <ExperienceSection />
                        <ProjectsSection />
                        <VolunteerSection />
                        <SkillsSection />
                        <CertificationsSection />
                    </>
                ) : (
                    <>
                        <ExperienceSection />
                        <ProjectsSection />
                        <VolunteerSection />
                        <EducationSection />
                        <SkillsSection />
                        <CertificationsSection />
                    </>
                )}
            </Page>
        </Document>
    );
}
