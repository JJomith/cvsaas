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
    github?: string;
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

interface TechFocusedTemplateProps {
  data: CVData;
  primaryColor?: string;
  fontFamily?: string;
}

export function TechFocusedTemplate({
  data,
  primaryColor = '#10b981',
  fontFamily = 'JetBrains Mono, monospace',
}: TechFocusedTemplateProps) {
  const styles = {
    container: {
      fontFamily: 'Inter, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '32px',
      backgroundColor: '#0d1117',
      color: '#c9d1d9',
      lineHeight: 1.6,
      borderRadius: '8px',
    },
    header: {
      marginBottom: '24px',
      paddingBottom: '20px',
      borderBottom: '1px solid #30363d',
    },
    name: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: '4px',
      fontFamily,
    },
    title: {
      fontSize: '16px',
      color: primaryColor,
      marginBottom: '12px',
    },
    contactRow: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '16px',
      fontSize: '13px',
      color: '#8b949e',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    icon: {
      color: primaryColor,
    },
    section: {
      marginBottom: '24px',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '14px',
    },
    sectionIcon: {
      color: primaryColor,
      fontSize: '18px',
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#ffffff',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      fontFamily,
    },
    summary: {
      fontSize: '14px',
      color: '#8b949e',
      padding: '12px 16px',
      backgroundColor: '#161b22',
      borderRadius: '6px',
      borderLeft: `3px solid ${primaryColor}`,
    },
    card: {
      backgroundColor: '#161b22',
      borderRadius: '6px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid #30363d',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px',
    },
    jobTitle: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#ffffff',
    },
    company: {
      fontSize: '14px',
      color: primaryColor,
    },
    date: {
      fontSize: '12px',
      color: '#8b949e',
      fontFamily,
    },
    description: {
      fontSize: '13px',
      color: '#8b949e',
      marginBottom: '10px',
    },
    achievements: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      fontSize: '13px',
    },
    achievementItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: '4px',
      color: '#c9d1d9',
    },
    bullet: {
      color: primaryColor,
      fontFamily,
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '8px',
    },
    skillCategory: {
      marginBottom: '12px',
    },
    categoryLabel: {
      fontSize: '12px',
      color: '#8b949e',
      marginBottom: '6px',
      fontFamily,
    },
    skillTag: {
      display: 'inline-block',
      backgroundColor: '#21262d',
      color: '#c9d1d9',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      border: '1px solid #30363d',
      marginRight: '6px',
      marginBottom: '6px',
    },
    highlightSkill: {
      backgroundColor: `${primaryColor}20`,
      color: primaryColor,
      borderColor: primaryColor,
    },
    projectCard: {
      backgroundColor: '#161b22',
      borderRadius: '6px',
      padding: '14px',
      marginBottom: '10px',
      border: '1px solid #30363d',
    },
    projectName: {
      fontSize: '14px',
      fontWeight: 600,
      color: primaryColor,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    techStack: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '4px',
      marginTop: '8px',
    },
    techTag: {
      fontSize: '11px',
      backgroundColor: '#21262d',
      color: '#8b949e',
      padding: '2px 8px',
      borderRadius: '4px',
    },
    education: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #30363d',
    },
    certGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
    },
    certCard: {
      backgroundColor: '#161b22',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #30363d',
    },
  };

  // Group skills by category
  const skillsByCategory = data.skills?.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof data.skills>);

  return (
    <div style={styles.container} id="cv-content">
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.name}>{data.personalInfo.name}</h1>
        <div style={styles.contactRow}>
          <span style={styles.contactItem}>
            <span style={styles.icon}>📧</span>
            {data.personalInfo.email}
          </span>
          <span style={styles.contactItem}>
            <span style={styles.icon}>📱</span>
            {data.personalInfo.phone}
          </span>
          <span style={styles.contactItem}>
            <span style={styles.icon}>📍</span>
            {data.personalInfo.location}
          </span>
          {data.personalInfo.github && (
            <span style={styles.contactItem}>
              <span style={styles.icon}>💻</span>
              {data.personalInfo.github}
            </span>
          )}
          {data.personalInfo.linkedin && (
            <span style={styles.contactItem}>
              <span style={styles.icon}>🔗</span>
              {data.personalInfo.linkedin}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>{'>'}</span>
            <h2 style={styles.sectionTitle}>About</h2>
          </div>
          <p style={styles.summary}>{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {skillsByCategory && Object.keys(skillsByCategory).length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>{'⚡'}</span>
            <h2 style={styles.sectionTitle}>Tech Stack</h2>
          </div>
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category} style={styles.skillCategory}>
              <div style={styles.categoryLabel}>{category}</div>
              <div style={styles.skillsContainer}>
                {skills?.map((skill) => (
                  <span
                    key={skill.id}
                    style={{
                      ...styles.skillTag,
                      ...(skill.level === 'Expert' || skill.level === 'Advanced'
                        ? styles.highlightSkill
                        : {}),
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>{'💼'}</span>
            <h2 style={styles.sectionTitle}>Experience</h2>
          </div>
          {data.experience.map((exp) => (
            <div key={exp.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.jobTitle}>{exp.title}</div>
                  <div style={styles.company}>{exp.company}</div>
                </div>
                <div style={styles.date}>
                  {exp.startDate} → {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.description && <p style={styles.description}>{exp.description}</p>}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul style={styles.achievements}>
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} style={styles.achievementItem}>
                      <span style={styles.bullet}>▹</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>{'🚀'}</span>
            <h2 style={styles.sectionTitle}>Projects</h2>
          </div>
          {data.projects.map((project) => (
            <div key={project.id} style={styles.projectCard}>
              <div style={styles.projectName}>
                <span>📦</span>
                {project.name}
              </div>
              <p style={styles.description}>{project.description}</p>
              <div style={styles.techStack}>
                {project.technologies.map((tech, i) => (
                  <span key={i} style={styles.techTag}>{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>{'🎓'}</span>
            <h2 style={styles.sectionTitle}>Education</h2>
          </div>
          {data.education.map((edu) => (
            <div key={edu.id} style={styles.education}>
              <div>
                <div style={styles.jobTitle}>{edu.degree} in {edu.field}</div>
                <div style={styles.company}>{edu.institution}</div>
              </div>
              <div style={styles.date}>{edu.startDate} - {edu.endDate}</div>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>{'🏆'}</span>
            <h2 style={styles.sectionTitle}>Certifications</h2>
          </div>
          <div style={styles.certGrid}>
            {data.certifications.map((cert) => (
              <div key={cert.id} style={styles.certCard}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                  {cert.name}
                </div>
                <div style={{ fontSize: '12px', color: primaryColor }}>{cert.issuer}</div>
                <div style={{ fontSize: '11px', color: '#8b949e' }}>{cert.issueDate}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default TechFocusedTemplate;
