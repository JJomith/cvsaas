'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  achievements: string[];
}

interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
  languages: string[];
}

const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
};

export default function CreateCVPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-minimal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetJob, setTargetJob] = useState<any>(null);

  const steps = [
    { id: 1, title: 'Personal Info', icon: '👤' },
    { id: 2, title: 'Experience', icon: '💼' },
    { id: 3, title: 'Education', icon: '🎓' },
    { id: 4, title: 'Skills', icon: '⚡' },
    { id: 5, title: 'Template', icon: '🎨' },
    { id: 6, title: 'Review', icon: '✅' },
  ];

  useEffect(() => {
    // Load target job from session storage
    const storedJob = sessionStorage.getItem('targetJob');
    if (storedJob) {
      setTargetJob(JSON.parse(storedJob));
    }
  }, []);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    setCvData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      achievements: [],
    };
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleAIEnhance = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/enhance-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, targetJob }),
      });

      if (response.ok) {
        const enhanced = await response.json();
        setCvData(enhanced);
      }
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/cv/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, template: selectedTemplate }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const templates = [
    { id: 'modern-minimal', name: 'Modern Minimal', color: '#667eea' },
    { id: 'professional-classic', name: 'Professional Classic', color: '#1e3a5f' },
    { id: 'tech-focused', name: 'Tech Focused', color: '#0f172a' },
    { id: 'creative-bold', name: 'Creative Bold', color: '#ec4899' },
    { id: 'executive', name: 'Executive', color: '#0d9488' },
    { id: 'academic', name: 'Academic', color: '#7c3aed' },
  ];

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500' as const,
    color: '#334155',
    fontSize: '14px',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
          Create Your CV
        </h1>
        {targetJob && (
          <div style={{
            background: '#eef2ff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            <span style={{ color: '#64748b' }}>Targeting: </span>
            <span style={{ color: '#667eea', fontWeight: '600' }}>
              {targetJob.title} at {targetJob.company}
            </span>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: currentStep === step.id ? '#667eea' : 
                           currentStep > step.id ? '#e0e7ff' : 'transparent',
                color: currentStep === step.id ? 'white' : 
                       currentStep > step.id ? '#667eea' : '#64748b',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              <span>{step.icon}</span>
              <span style={{ display: 'none' }}>{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
              Personal Information
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  value={cvData.personalInfo.fullName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="John Doe"
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updatePersonalInfo('email', e.target.value)}
                  placeholder="john@example.com"
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  value={cvData.personalInfo.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>Location</label>
                <input
                  type="text"
                  value={cvData.personalInfo.location}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updatePersonalInfo('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>LinkedIn URL</label>
                <input
                  type="url"
                  value={cvData.personalInfo.linkedin}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  style={inputStyle}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Professional Summary</label>
                <textarea
                  value={cvData.personalInfo.summary}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updatePersonalInfo('summary', e.target.value)}
                  placeholder="A brief summary of your professional background and career objectives..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' as const }}
                />
                <button
                  onClick={handleAIEnhance}
                  disabled={isGenerating}
                  style={{
                    marginTop: '8px',
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ✨ {isGenerating ? 'Enhancing...' : 'AI Enhance Summary'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Experience */}
        {currentStep === 2 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                Work Experience
              </h2>
              <button
                onClick={addExperience}
                style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                + Add Experience
              </button>
            </div>

            {cvData.experiences.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px',
                background: '#f8fafc',
                borderRadius: '12px',
                color: '#64748b',
              }}>
                <p style={{ marginBottom: '16px' }}>No experience added yet</p>
                <button
                  onClick={addExperience}
                  style={{
                    padding: '12px 24px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Add Your First Experience
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {cvData.experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '24px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontWeight: '600', color: '#667eea' }}>Experience #{index + 1}</span>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Job Title *</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateExperience(exp.id, 'title', e.target.value)}
                          placeholder="Software Engineer"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Company *</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Google"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Start Date</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateExperience(exp.id, 'startDate', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>End Date</label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                          style={{ ...inputStyle, opacity: exp.current ? 0.5 : 1 }}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '13px' }}>
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => updateExperience(exp.id, 'current', e.target.checked)}
                          />
                          Currently working here
                        </label>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Description & Achievements</label>
                        <textarea
                          value={exp.description}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and key achievements..."
                          rows={4}
                          style={{ ...inputStyle, resize: 'vertical' as const }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Education */}
        {currentStep === 3 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                Education
              </h2>
              <button
                onClick={addEducation}
                style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                + Add Education
              </button>
            </div>

            {cvData.education.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px',
                background: '#f8fafc',
                borderRadius: '12px',
                color: '#64748b',
              }}>
                <p style={{ marginBottom: '16px' }}>No education added yet</p>
                <button
                  onClick={addEducation}
                  style={{
                    padding: '12px 24px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Add Your Education
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {cvData.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '24px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontWeight: '600', color: '#667eea' }}>Education #{index + 1}</span>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Degree *</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bachelor of Science in Computer Science"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Institution *</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="Stanford University"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Graduation Date</label>
                        <input
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>GPA (optional)</label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateEducation(edu.id, 'gpa', e.target.value)}
                          placeholder="3.8/4.0"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Skills */}
        {currentStep === 4 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
              Skills & Expertise
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Technical Skills</label>
              <input
                type="text"
                placeholder="Type a skill and press Enter (e.g., JavaScript, React, Python)"
                style={inputStyle}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    setCvData((prev) => ({
                      ...prev,
                      skills: [...prev.skills, e.currentTarget.value.trim()],
                    }));
                    e.currentTarget.value = '';
                  }
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {cvData.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#eef2ff',
                      color: '#667eea',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => setCvData((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((_, i) => i !== index),
                      }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        color: '#667eea',
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {targetJob && targetJob.keywords && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                <p style={{ fontWeight: '600', color: '#166534', marginBottom: '12px' }}>
                  💡 Suggested skills from target job:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {targetJob.keywords.filter((k: string) => !cvData.skills.includes(k)).slice(0, 10).map((keyword: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCvData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, keyword],
                      }))}
                      style={{
                        background: 'white',
                        color: '#166534',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        border: '1px solid #86efac',
                        cursor: 'pointer',
                      }}
                    >
                      + {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Languages</label>
              <input
                type="text"
                placeholder="Type a language and press Enter (e.g., English - Native)"
                style={inputStyle}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    setCvData((prev) => ({
                      ...prev,
                      languages: [...prev.languages, e.currentTarget.value.trim()],
                    }));
                    e.currentTarget.value = '';
                  }
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {cvData.languages.map((lang, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#f3e8ff',
                      color: '#7c3aed',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {lang}
                    <button
                      onClick={() => setCvData((prev) => ({
                        ...prev,
                        languages: prev.languages.filter((_, i) => i !== index),
                      }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        color: '#7c3aed',
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Template Selection */}
        {currentStep === 5 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
              Choose Your Template
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  style={{
                    border: selectedTemplate === template.id ? '3px solid #667eea' : '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedTemplate === template.id ? '#f5f3ff' : 'white',
                  }}
                >
                  <div style={{
                    height: '120px',
                    background: template.color,
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                    Preview
                  </div>
                  <p style={{ fontWeight: '600', textAlign: 'center', margin: 0 }}>
                    {template.name}
                  </p>
                  {selectedTemplate === template.id && (
                    <p style={{ textAlign: 'center', color: '#667eea', fontSize: '13px', marginTop: '4px' }}>
                      ✓ Selected
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {currentStep === 6 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
              Review Your CV
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>Personal Information</h3>
              <p style={{ fontWeight: '600', fontSize: '20px' }}>{cvData.personalInfo.fullName || 'Not provided'}</p>
              <p>{cvData.personalInfo.email} • {cvData.personalInfo.phone}</p>
              <p>{cvData.personalInfo.location}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>
                Experience ({cvData.experiences.length})
              </h3>
              {cvData.experiences.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '12px' }}>
                  <p style={{ fontWeight: '600' }}>{exp.title}</p>
                  <p style={{ color: '#64748b' }}>{exp.company}</p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>
                Education ({cvData.education.length})
              </h3>
              {cvData.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <p style={{ fontWeight: '600' }}>{edu.degree}</p>
                  <p style={{ color: '#64748b' }}>{edu.institution}</p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>
                Skills ({cvData.skills.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {cvData.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#f1f5f9',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
            }}>
              <p style={{ fontWeight: '600', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✅ ATS Optimized
              </p>
              <p style={{ color: '#166534', fontSize: '14px', marginTop: '4px' }}>
                Your CV is formatted to pass Applicant Tracking Systems
              </p>
            </div>

            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              style={{
                width: '100%',
                padding: '16px',
                background: isGenerating ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
              }}
            >
              {isGenerating ? 'Generating PDF...' : '📄 Generate & Download PDF'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '24px',
        }}>
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            style={{
              padding: '12px 24px',
              background: currentStep === 1 ? '#f1f5f9' : 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              color: currentStep === 1 ? '#94a3b8' : '#334155',
            }}
          >
            ← Previous
          </button>
          
          {currentStep < 6 && (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              style={{
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
