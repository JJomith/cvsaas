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
    orcid?: string;
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
    thesis?: string;
    advisor?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  publications?: Array<{
    title: string;
    authors: string;
    journal: string;
    year: string;
    doi?: string;
  }>;
  research?: Array<{
    title: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  teaching?: Array<{
    course: string;
    institution: string;
    role: string;
    dates: string;
  }>;
  grants?: Array<{
    title: string;
    agency: string;
    amount: string;
    year: string;
  }>;
  presentations?: Array<{
    title: string;
    conference: string;
    location: string;
    date: string;
  }>;
}

interface AcademicTemplateProps {
  data: CVData;
  className?: string;
}

export function AcademicTemplate({ data, className = '' }: AcademicTemplateProps) {
  const { personalInfo, experience, education, skills, publications, research, teaching, grants, presentations } = data;

  return (
    <div className={`bg-white min-h-[297mm] w-[210mm] mx-auto ${className}`} style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Academic Header */}
      <div className="px-12 pt-10 pb-6 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          {personalInfo.fullName}
        </h1>
        <p className="text-lg text-gray-700 text-center mt-1">
          {personalInfo.title}
        </p>
        
        <div className="flex justify-center flex-wrap gap-4 mt-4 text-sm text-gray-600">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.location}</span>
          {personalInfo.orcid && (
            <>
              <span>•</span>
              <span>ORCID: {personalInfo.orcid}</span>
            </>
          )}
        </div>
      </div>

      <div className="px-12 py-8 space-y-6">
        {/* Research Interests / Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Research Interests
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{edu.degree} in {edu.field}</p>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.thesis && (
                        <p className="text-gray-600 text-sm italic mt-1">
                          Thesis: "{edu.thesis}"
                        </p>
                      )}
                      {edu.advisor && (
                        <p className="text-gray-600 text-sm">Advisor: {edu.advisor}</p>
                      )}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Research Experience */}
        {research && research.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Research Experience
            </h2>
            <div className="space-y-4">
              {research.map((res, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{res.title}</p>
                      <p className="text-gray-700">{res.institution}</p>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {res.startDate} – {res.endDate}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 text-justify">{res.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic Appointments / Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Academic Appointments
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{exp.position}</p>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 text-justify">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications */}
        {publications && publications.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Publications
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              {publications.map((pub, index) => (
                <li key={index} className="text-gray-700 text-sm">
                  {pub.authors}. ({pub.year}). "{pub.title}." <em>{pub.journal}</em>.
                  {pub.doi && <span className="text-gray-500 ml-1">DOI: {pub.doi}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Teaching Experience */}
        {teaching && teaching.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Teaching Experience
            </h2>
            <div className="space-y-2">
              {teaching.map((course, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-gray-900">{course.course}</span>
                    <span className="text-gray-600 ml-2">({course.role})</span>
                    <p className="text-gray-700 text-sm">{course.institution}</p>
                  </div>
                  <span className="text-gray-600 text-sm">{course.dates}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grants & Funding */}
        {grants && grants.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Grants & Funding
            </h2>
            <div className="space-y-2">
              {grants.map((grant, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-gray-900">{grant.title}</span>
                    <p className="text-gray-600 text-sm">{grant.agency} • {grant.amount}</p>
                  </div>
                  <span className="text-gray-600 text-sm">{grant.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Presentations */}
        {presentations && presentations.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Conference Presentations
            </h2>
            <ul className="space-y-2">
              {presentations.map((pres, index) => (
                <li key={index} className="text-gray-700 text-sm">
                  "{pres.title}." <em>{pres.conference}</em>, {pres.location}, {pres.date}.
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills & Technical Proficiencies */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
            Skills & Proficiencies
          </h2>
          <div className="space-y-2 text-sm">
            {skills.technical.length > 0 && (
              <p>
                <span className="font-semibold text-gray-900">Technical: </span>
                <span className="text-gray-700">{skills.technical.join(', ')}</span>
              </p>
            )}
            {skills.languages.length > 0 && (
              <p>
                <span className="font-semibold text-gray-900">Languages: </span>
                <span className="text-gray-700">{skills.languages.join(', ')}</span>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export const academicMeta = {
  id: 'academic',
  name: 'Academic',
  description: 'Traditional academic CV format for researchers, professors, and scholars',
  thumbnail: '/templates/academic-thumb.png',
  category: 'academic',
  isPremium: true,
  colors: {
    primary: '#111827',
    secondary: '#4b5563',
    accent: '#111827',
  },
};
