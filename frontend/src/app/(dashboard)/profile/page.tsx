'use client';

import { useState } from 'react';
import { 
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Globe,
  Plus,
  Trash2,
  Save,
  Linkedin,
  Upload,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Mock profile data
const initialProfile = {
  basics: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    headline: 'Senior Software Engineer',
    summary: 'Passionate software engineer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    githubUrl: 'https://github.com/johndoe',
    website: 'https://johndoe.dev',
  },
  experiences: [
    {
      id: '1',
      company: 'Tech Corp',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Leading frontend development team, implementing new features and improving performance.',
      achievements: [
        'Reduced page load time by 40%',
        'Mentored 5 junior developers',
        'Led migration to microservices architecture',
      ],
    },
    {
      id: '2',
      company: 'StartupXYZ',
      title: 'Software Engineer',
      location: 'New York, NY',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: 'Full-stack development using React and Node.js.',
      achievements: [
        'Built real-time collaboration feature',
        'Improved test coverage to 85%',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2014-08',
      endDate: '2018-05',
      gpa: '3.8',
      description: '',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript', level: 'Expert', category: 'Programming' },
    { id: '2', name: 'TypeScript', level: 'Expert', category: 'Programming' },
    { id: '3', name: 'React', level: 'Expert', category: 'Frontend' },
    { id: '4', name: 'Node.js', level: 'Advanced', category: 'Backend' },
    { id: '5', name: 'Python', level: 'Intermediate', category: 'Programming' },
    { id: '6', name: 'AWS', level: 'Advanced', category: 'Cloud' },
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2023-06',
      expiryDate: '2026-06',
      credentialId: 'AWS-123456',
      url: '',
    },
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'Native' },
    { id: '2', name: 'Spanish', proficiency: 'Intermediate' },
  ],
  projects: [
    {
      id: '1',
      name: 'Open Source CLI Tool',
      description: 'A command-line tool for automating development workflows',
      technologies: ['Node.js', 'TypeScript'],
      url: 'https://github.com/johndoe/cli-tool',
      startDate: '2022-01',
      endDate: '2022-06',
    },
  ],
};

type SectionKey = 'basics' | 'experiences' | 'education' | 'skills' | 'certifications' | 'languages' | 'projects';

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(
    new Set(['basics', 'experiences', 'education', 'skills'])
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggleSection = (section: SectionKey) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    section 
  }: { 
    title: string; 
    icon: React.ElementType; 
    section: SectionKey;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {expandedSections.has(section) ? (
        <ChevronUp className="h-5 w-5 text-gray-400" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Keep your profile updated for better AI-generated content
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Linkedin className="h-4 w-4" />
            Import from LinkedIn
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4" />
            Upload Resume
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader title="Basic Information" icon={User} section="basics" />
        {expandedSections.has('basics') && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.basics.firstName}
                  onChange={(e) => setProfile({
                    ...profile,
                    basics: { ...profile.basics, firstName: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.basics.lastName}
                  onChange={(e) => setProfile({
                    ...profile,
                    basics: { ...profile.basics, lastName: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
              <input
                type="text"
                value={profile.basics.headline}
                onChange={(e) => setProfile({
                  ...profile,
                  basics: { ...profile.basics, headline: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Software Engineer at Google"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.basics.email}
                  onChange={(e) => setProfile({
                    ...profile,
                    basics: { ...profile.basics, email: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={profile.basics.phone}
                  onChange={(e) => setProfile({
                    ...profile,
                    basics: { ...profile.basics, phone: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={profile.basics.location}
                onChange={(e) => setProfile({
                  ...profile,
                  basics: { ...profile.basics, location: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State/Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea
                value={profile.basics.summary}
                onChange={(e) => setProfile({
                  ...profile,
                  basics: { ...profile.basics, summary: e.target.value }
                })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Brief overview of your professional background and goals..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={profile.basics.linkedinUrl}
                  onChange={(e) => setProfile({
                    ...profile,
                    basics: { ...profile.basics, linkedinUrl: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={profile.basics.githubUrl}
                  onChange={(e) => setProfile({
                    ...profile,
                    basics: { ...profile.basics, githubUrl: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
                <input
                  type="url"
                  value={profile.basics.website}
                  onChange={(e) => setProfile({
                    ...profile,
                    basics: { ...profile.basics, website: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Work Experience */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader title="Work Experience" icon={Briefcase} section="experiences" />
        {expandedSections.has('experiences') && (
          <div className="p-6 border-t border-gray-200 space-y-6">
            {profile.experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900">{exp.title} at {exp.company}</h3>
                  <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="month"
                      value={exp.startDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="month"
                      value={exp.endDate}
                      disabled={exp.current}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <input type="checkbox" checked={exp.current} className="rounded" />
                      Currently working here
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={exp.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements</label>
                  <div className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-gray-400">•</span>
                        <input
                          type="text"
                          value={achievement}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add achievement
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader title="Education" icon={GraduationCap} section="education" />
        {expandedSections.has('education') && (
          <div className="p-6 border-t border-gray-200 space-y-6">
            {profile.education.map((edu) => (
              <div key={edu.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h3>
                  <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={edu.field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="month"
                      value={edu.startDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="month"
                      value={edu.endDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Add Education
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader title="Skills" icon={Code} section="skills" />
        {expandedSections.has('skills') && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full group"
                >
                  <span className="text-sm text-gray-700">{skill.name}</span>
                  <span className="text-xs text-gray-500">({skill.level})</span>
                  <button className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader title="Certifications" icon={Award} section="certifications" />
        {expandedSections.has('certifications') && (
          <div className="p-6 border-t border-gray-200 space-y-6">
            {profile.certifications.map((cert) => (
              <div key={cert.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                    <input
                      type="month"
                      value={cert.issueDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="month"
                      value={cert.expiryDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Add Certification
            </button>
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SectionHeader title="Languages" icon={Globe} section="languages" />
        {expandedSections.has('languages') && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            <div className="space-y-3">
              {profile.languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={lang.name}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select 
                    value={lang.proficiency}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Add Language
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
