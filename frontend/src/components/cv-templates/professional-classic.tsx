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

interface ProfessionalClassicTemplateProps {
  data: CVData;
  primaryColor?: string;
  fontFamily?: string;
}

export function ProfessionalClassicTemplate({
  data,
  primaryColor = '#1e3a5f',
  fontFamily = 'Georgia, serif',
}: ProfessionalClassicTemplateProps) {
  const styles = {
    container: {
      fontFamily,
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#ffffff',
      color: '#333333',
      lineHeight: 1.5,
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
      gap: '30px',
    },
    sidebar: {
      backgroundColor: primaryColor,
      color: '#ffffff',
      padding: '30px 20px',
      marginLeft: '-40px',
      marginTop: '-40px',
      marginBottom: '-40px',
      minHeight: 'calc(100% + 80px)',
    },
    mainContent: {
      padding: '0',
    },
    name: {
      fontSize: '24px',
      fontWeight: 700,
      marginBottom: '8px',
      color: '#ffffff',
    },
    title: {
      fontSize: '14px',
      marginBottom: '24px',
      opacity: 0.9,
    },
    sidebarSection: {
      marginBottom: '24px',
    },
    sidebarTitle: {
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      marginBottom: '12px',
      borderBottom: '1px solid rgba(255,255,255,0.3)',
      paddingBottom: '6px',
    },
    contactItem: {
      fontSize: '13px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    skillItem: {
      fontSize: '13px',
      marginBottom: '6px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skillBar: {
      width: '60px',
      height: '4px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    skillFill: {
      height: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '2px',
    },
    mainSection: {
      marginBottom: '24px',
    },
    mainTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: primaryColor,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      marginBottom: '16px',
      borderBottom: `2px solid ${primaryColor}`,
      paddingBottom: '6px',
    },
    summary: {
      fontSize: '14px',
      color: '#555555',
      fontStyle: 'italic' as const,
    },
    experienceItem: {
      marginBottom: '18px',
    },
    jobHeader: {
      marginBottom: '6px',
    },
    jobTitle: {
      fontSize: '15px',
      fontWeight: 700,
      color: '#333333',
    },
    company: {
      fontSize: '14px',
      color: primaryColor,
      fontWeight: 500,
    },
    dateLocation: {
      fontSize: '12px',
      color: '#777777',
      marginBottom: '6px',
    },
    description: {
      fontSize: '13px',
      color: '#555555',
      marginBottom: '6px',
    },
    achievements: {
      listStyle: 'disc',
      paddingLeft: '18px',
      fontSize: '13px',
      color: '#555555',
      margin: 0,
    },
    educationItem: {
      marginBottom: '14px',
    },
    certItem: {
      marginBottom: '10px',
    },
  };

  const getSkillLevel = (level: string): number => {
    const levels: Record<string, number> = {
      'Beginner': 25,
      'Intermediate': 50,
      'Advanced': 75,
      'Expert': 100,
    };
    return levels[level] || 50;
  };

  return (
    <div style={styles.container} id="cv-content">
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h1 style={styles.name}>{data.personalInfo.name}</h1>
        
        {/* Contact */}
        <div style={styles.sidebarSection}>
          <h3 style={styles.sidebarTitle}>Contact</h3>
          <div style={styles.contactItem}>
            <span>✉</span>
            <span>{data.personalInfo.email}</span>
          </div>
          <div style={styles.contactItem}>
            <span>📱</span>
            <span>{data.personalInfo.phone}</span>
          </div>
          <div style={styles.contactItem}>
            <span>📍</span>
            <span>{data.personalInfo.location}</span>
          </div>
          {data.personalInfo.linkedin && (
            <div style={styles.contactItem}>
              <span>🔗</span>
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Skills</h3>
            {data.skills.map((skill) => (
              <div key={skill.id} style={styles.skillItem}>
                <span>{skill.name}</span>
                <div style={styles.skillBar}>
                  <div style={{ ...styles.skillFill, width: `${getSkillLevel(skill.level)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Certifications</h3>
            {data.certifications.map((cert) => (
              <div key={cert.id} style={styles.certItem}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{cert.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{cert.issuer}</div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Summary */}
        {data.summary && (
          <section style={styles.mainSection}>
            <h2 style={styles.mainTitle}>Professional Profile</h2>
            <p style={styles.summary}>{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section style={styles.mainSection}>
            <h2 style={styles.mainTitle}>Professional Experience</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} style={styles.experienceItem}>
                <div style={styles.jobHeader}>
                  <div style={styles.jobTitle}>{exp.title}</div>
                  <div style={styles.company}>{exp.company}</div>
                </div>
                <div style={styles.dateLocation}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate} | {exp.location}
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
          <section style={styles.mainSection}>
            <h2 style={styles.mainTitle}>Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} style={styles.educationItem}>
                <div style={styles.jobTitle}>{edu.degree} in {edu.field}</div>
                <div style={styles.company}>{edu.institution}</div>
                <div style={styles.dateLocation}>
                  {edu.startDate} - {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section style={styles.mainSection}>
            <h2 style={styles.mainTitle}>Projects</h2>
            {data.projects.map((project) => (
              <div key={project.id} style={styles.educationItem}>
                <div style={styles.jobTitle}>{project.name}</div>
                <p style={styles.description}>{project.description}</p>
                <div style={{ fontSize: '12px', color: primaryColor }}>
                  {project.technologies.join(' • ')}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default ProfessionalClassicTemplate;
