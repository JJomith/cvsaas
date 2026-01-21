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
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

interface CreativeBoldTemplateProps {
  data: CVData;
  className?: string;
}

export function CreativeBoldTemplate({ data, className = '' }: CreativeBoldTemplateProps) {
  const { personalInfo, experience, education, skills, certifications, projects } = data;

  return (
    <div className={`bg-white min-h-[297mm] w-[210mm] mx-auto ${className}`} style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header with bold accent */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {personalInfo.fullName}
          </h1>
          <p className="text-xl font-light tracking-wide opacity-90 mb-4">
            {personalInfo.title}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              ✉️ {personalInfo.email}
            </span>
            <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              📱 {personalInfo.phone}
            </span>
            <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              📍 {personalInfo.location}
            </span>
            {personalInfo.linkedin && (
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                🔗 LinkedIn
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed text-lg italic border-l-4 border-purple-500 pl-4">
              "{personalInfo.summary}"
            </p>
          </div>
        )}

        {/* Two column layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main content - 2 cols */}
          <div className="col-span-2 space-y-8">
            {/* Experience */}
            {experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">💼</span>
                  Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-purple-200">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 bg-purple-500 rounded-full" />
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{exp.position}</h3>
                          <p className="text-purple-600 font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                      {exp.highlights.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.highlights.map((highlight, hIndex) => (
                            <li key={hIndex} className="text-gray-600 text-sm flex items-start gap-2">
                              <span className="text-pink-500 mt-1">▸</span>
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

            {/* Projects */}
            {projects && projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg flex items-center justify-center text-white text-sm">🚀</span>
                  Projects
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <h3 className="font-bold text-gray-800">{project.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, tIndex) => (
                          <span key={tIndex} className="text-xs bg-white px-2 py-1 rounded-full text-purple-600 border border-purple-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - 1 col */}
          <div className="space-y-6">
            {/* Skills */}
            <section className="bg-gray-50 rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded flex items-center justify-center text-white text-xs">⚡</span>
                Skills
              </h2>
              
              {skills.technical.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Technical</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((skill, index) => (
                      <span key={index} className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {skills.soft.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((skill, index) => (
                      <span key={index} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {skills.languages.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.languages.map((lang, index) => (
                      <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Education */}
            {education.length > 0 && (
              <section className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-400 rounded flex items-center justify-center text-white text-xs">🎓</span>
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-800 text-sm">{edu.degree}</h3>
                      <p className="text-purple-600 text-sm">{edu.institution}</p>
                      <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                      {edu.gpa && (
                        <p className="text-xs text-gray-600 mt-1">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-orange-400 to-yellow-400 rounded flex items-center justify-center text-white text-xs">🏆</span>
                  Certifications
                </h2>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-semibold text-gray-800">{cert.name}</p>
                      <p className="text-gray-500 text-xs">{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const creativeBoldMeta = {
  id: 'creative-bold',
  name: 'Creative Bold',
  description: 'Eye-catching design with vibrant gradients, perfect for creative professionals',
  thumbnail: '/templates/creative-bold-thumb.png',
  category: 'creative',
  isPremium: false,
  colors: {
    primary: '#9333ea',
    secondary: '#ec4899',
    accent: '#f97316',
  },
};
