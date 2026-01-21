'use client';

import React from 'react';

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    linkedin?: string;
    website?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  awards?: Array<{
    name: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
}

interface ExecutiveTemplateProps {
  data: CVData;
  className?: string;
}

export function ExecutiveTemplate({ data, className = '' }: ExecutiveTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, awards } = data;

  return (
    <div className={`bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg ${className}`} style={{ fontFamily: 'Georgia, serif' }}>
      {/* Elegant header */}
      <div className="bg-slate-900 text-white px-10 py-8">
        <div className="border-b border-slate-700 pb-6">
          <h1 className="text-3xl font-light tracking-widest uppercase">
            {personalInfo.fullName}
          </h1>
          <p className="text-slate-400 mt-2 text-lg tracking-wide">
            {personalInfo.title}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-sm text-slate-300">
          <div className="flex items-center gap-6">
            <span>{personalInfo.email}</span>
            <span className="text-slate-600">|</span>
            <span>{personalInfo.phone}</span>
            <span className="text-slate-600">|</span>
            <span>{personalInfo.location}</span>
          </div>
          {personalInfo.linkedin && (
            <span className="text-slate-400">LinkedIn</span>
          )}
        </div>
      </div>

      <div className="px-10 py-8">
        {/* Executive Summary */}
        {personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-500 mb-3">
              Executive Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-[15px]">
              {personalInfo.summary}
            </p>
          </section>
        )}

        <div className="grid grid-cols-4 gap-8">
          {/* Main content - 3 cols */}
          <div className="col-span-3 space-y-8">
            {/* Professional Experience */}
            {experience.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-500 mb-4 border-b border-slate-200 pb-2">
                  Professional Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{exp.position}</h3>
                          <p className="text-slate-600 italic">{exp.company}</p>
                        </div>
                        <span className="text-sm text-slate-500">
                          {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-2 text-sm leading-relaxed">{exp.description}</p>
                      {exp.highlights.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {exp.highlights.map((highlight, hIndex) => (
                            <li key={hIndex} className="text-slate-600 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Awards & Recognition */}
            {awards && awards.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-500 mb-4 border-b border-slate-200 pb-2">
                  Awards & Recognition
                </h2>
                <div className="space-y-3">
                  {awards.map((award, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <span className="font-semibold text-slate-800">{award.name}</span>
                        <span className="text-slate-600 ml-2">— {award.issuer}</span>
                        {award.description && (
                          <p className="text-slate-500 text-sm mt-1">{award.description}</p>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">{award.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - 1 col */}
          <div className="space-y-6 border-l border-slate-200 pl-6">
            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-500 mb-3">
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index}>
                      <p className="font-semibold text-slate-800 text-sm">{edu.degree}</p>
                      <p className="text-slate-600 text-sm">{edu.field}</p>
                      <p className="text-slate-500 text-sm italic">{edu.institution}</p>
                      <p className="text-slate-400 text-xs">{edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Core Competencies */}
            {skills.technical.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-500 mb-3">
                  Core Competencies
                </h2>
                <ul className="space-y-1">
                  {skills.technical.map((skill, index) => (
                    <li key={index} className="text-slate-600 text-sm">
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Leadership Skills */}
            {skills.soft.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-500 mb-3">
                  Leadership
                </h2>
                <ul className="space-y-1">
                  {skills.soft.map((skill, index) => (
                    <li key={index} className="text-slate-600 text-sm">
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {skills.languages.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-500 mb-3">
                  Languages
                </h2>
                <ul className="space-y-1">
                  {skills.languages.map((lang, index) => (
                    <li key={index} className="text-slate-600 text-sm">
                      {lang}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-500 mb-3">
                  Certifications
                </h2>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index}>
                      <p className="text-slate-700 text-sm font-medium">{cert.name}</p>
                      <p className="text-slate-500 text-xs">{cert.issuer}, {cert.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-10 py-4 mt-auto border-t border-slate-200">
        <p className="text-xs text-slate-400 text-center tracking-wide">
          References available upon request
        </p>
      </div>
    </div>
  );
}

export const executiveMeta = {
  id: 'executive',
  name: 'Executive',
  description: 'Sophisticated design for senior executives and C-level professionals',
  thumbnail: '/templates/executive-thumb.png',
  category: 'professional',
  isPremium: true,
  colors: {
    primary: '#0f172a',
    secondary: '#64748b',
    accent: '#0f172a',
  },
};
