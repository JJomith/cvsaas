'use client';

import React from 'react';

interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
    category: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }>;
}

interface ModernMinimalTemplateProps {
  data: CVData;
  primaryColor?: string;
  fontFamily?: string;
}

export function ModernMinimalTemplate({
  data,
  primaryColor = '#2563eb',
  fontFamily = 'Inter, sans-serif',
}: ModernMinimalTemplateProps) {
  const styles = {
    container: {
      fontFamily,
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      lineHeight: 1.6,
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '32px',
      borderBottom: `2px solid ${primaryColor}`,
      paddingBottom: '24px',
    },
    name: {
      fontSize: '32px',
      fontWeight: 700,
      color: primaryColor,
      marginBottom: '8px',
    },
    contactInfo: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
      gap: '16px',
      fontSize: '14px',
      color: '#6b7280',
    },
    section: {
      marginBottom: '28px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: primaryColor,
      marginBottom: '16px',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
    },
    summary: {
      fontSize: '15px',
      color: '#4b5563',
    },
    experienceItem: {
      marginBottom: '20px',
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px',
    },
    jobTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#1f2937',
    },
    company: {
      fontSize: '15px',
      color: primaryColor,
    },
    dateLocation: {
      fontSize: '13px',
      color: '#6b7280',
      textAlign: 'right' as const,
    },
    description: {
      fontSize: '14px',
      color: '#4b5563',
      marginBottom: '8px',
    },
    achievements: {
      listStyle: 'disc',
      paddingLeft: '20px',
      fontSize: '14px',
      color: '#4b5563',
    },
    skillsGrid: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '8px',
    },
    skillTag: {
      backgroundColor: `${primaryColor}15`,
      color: primaryColor,
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '13px',
      fontWeight: 500,
    },
    educationItem: {
      marginBottom: '16px',
    },
    projectItem: {
      marginBottom: '16px',
    },
    projectName: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#1f2937',
    },
    technologies: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '6px',
      marginTop: '6px',
    },
    techTag: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px',
    },
  };

  return (
    <div style={styles.container} id="cv-content">
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.name}>{data.personalInfo.name}</h1>
        <div style={styles.contactInfo}>
          <span>{data.personalInfo.email}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span>{data.personalInfo.location}</span>
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{data.personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Professional Summary</h2>
          <p style={styles.summary}>{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={styles.experienceItem}>
              <div style={styles.jobHeader}>
                <div>
                  <div style={styles.jobTitle}>{exp.title}</div>
                  <div style={styles.company}>{exp.company}</div>
                </div>
                <div style={styles.dateLocation}>
                  <div>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                  <div>{exp.location}</div>
                </div>
              </div>
              {exp.description && <p style={styles.description}>{exp.description}</p>}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul style={styles.achievements}>
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={styles.educationItem}>
              <div style={styles.jobHeader}>
                <div>
                  <div style={styles.jobTitle}>{edu.degree} in {edu.field}</div>
                  <div style={styles.company}>{edu.institution}</div>
                </div>
                <div style={styles.dateLocation}>
                  <div>{edu.startDate} - {edu.endDate}</div>
                  {edu.gpa && <div>GPA: {edu.gpa}</div>}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <div style={styles.skillsGrid}>
            {data.skills.map((skill) => (
              <span key={skill.id} style={styles.skillTag}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          {data.projects.map((project) => (
            <div key={project.id} style={styles.projectItem}>
              <div style={styles.projectName}>{project.name}</div>
              <p style={styles.description}>{project.description}</p>
              <div style={styles.technologies}>
                {project.technologies.map((tech, i) => (
                  <span key={i} style={styles.techTag}>{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} style={styles.educationItem}>
              <div style={styles.jobHeader}>
                <div>
                  <div style={styles.jobTitle}>{cert.name}</div>
                  <div style={styles.company}>{cert.issuer}</div>
                </div>
                <div style={styles.dateLocation}>
                  <div>{cert.issueDate}</div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default ModernMinimalTemplate;
