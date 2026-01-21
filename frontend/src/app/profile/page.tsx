'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ProfileData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    linkedin: string;
    website: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    highlights: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
}

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
      linkedin: '',
      website: '',
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
    },
  });

  const [newSkill, setNewSkill] = useState({ technical: '', soft: '', languages: '' });

  const handlePersonalChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          highlights: [],
        },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
        },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addSkill = (type: 'technical' | 'soft' | 'languages') => {
    if (!newSkill[type].trim()) return;
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...prev.skills[type], newSkill[type].trim()],
      },
    }));
    setNewSkill(prev => ({ ...prev, [type]: '' }));
  };

  const removeSkill = (type: 'technical' | 'soft' | 'languages', skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter(s => s !== skill),
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'settings', label: 'Account Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold">Profile Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Personal Info Section */}
              {activeSection === 'personal' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profile.personalInfo.fullName}
                        onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Title *
                      </label>
                      <input
                        type="text"
                        value={profile.personalInfo.title}
                        onChange={(e) => handlePersonalChange('title', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={profile.personalInfo.email}
                        onChange={(e) => handlePersonalChange('email', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.personalInfo.phone}
                        onChange={(e) => handlePersonalChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profile.personalInfo.location}
                        onChange={(e) => handlePersonalChange('location', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={profile.personalInfo.linkedin}
                        onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website / Portfolio
                      </label>
                      <input
                        type="url"
                        value={profile.personalInfo.website}
                        onChange={(e) => handlePersonalChange('website', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://johndoe.dev"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Summary
                      </label>
                      <textarea
                        value={profile.personalInfo.summary}
                        onChange={(e) => handlePersonalChange('summary', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief summary of your professional background and career goals..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {activeSection === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
                    <button
                      onClick={addExperience}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      + Add Experience
                    </button>
                  </div>

                  {profile.experience.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No experience added yet</p>
                      <button
                        onClick={addExperience}
                        className="mt-4 text-blue-600 hover:underline"
                      >
                        Add your first experience
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {profile.experience.map((exp, index) => (
                        <div key={exp.id} className="p-6 border rounded-lg bg-gray-50">
                          <div className="flex items-start justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">
                              Experience #{index + 1}
                            </span>
                            <button
                              onClick={() => removeExperience(exp.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Company"
                              className="px-4 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              placeholder="Position"
                              className="px-4 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              placeholder="Start Date (e.g., Jan 2020)"
                              className="px-4 py-2 border rounded-lg"
                            />
                            <div className="flex items-center gap-4">
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                placeholder="End Date"
                                disabled={exp.current}
                                className="flex-1 px-4 py-2 border rounded-lg disabled:bg-gray-200"
                              />
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={exp.current}
                                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                />
                                Current
                              </label>
                            </div>
                            <textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              placeholder="Description of your role and responsibilities..."
                              rows={3}
                              className="col-span-2 px-4 py-2 border rounded-lg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Education Section */}
              {activeSection === 'education' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Education</h2>
                    <button
                      onClick={addEducation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      + Add Education
                    </button>
                  </div>

                  {profile.education.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No education added yet</p>
                      <button
                        onClick={addEducation}
                        className="mt-4 text-blue-600 hover:underline"
                      >
                        Add your first education
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {profile.education.map((edu, index) => (
                        <div key={edu.id} className="p-6 border rounded-lg bg-gray-50">
                          <div className="flex items-start justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">
                              Education #{index + 1}
                            </span>
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="Institution"
                              className="px-4 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="Degree (e.g., Bachelor's)"
                              className="px-4 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                              placeholder="Field of Study"
                              className="px-4 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                              placeholder="GPA (optional)"
                              className="px-4 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                              placeholder="Start Year"
                              className="px-4 py-2 border rounded-lg"
                            />
                            <input
                              type="text"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                              placeholder="End Year"
                              className="px-4 py-2 border rounded-lg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold text-gray-900">Skills</h2>

                  {/* Technical Skills */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Technical Skills</h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill.technical}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, technical: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill('technical')}
                        placeholder="Add a technical skill"
                        className="flex-1 px-4 py-2 border rounded-lg"
                      />
                      <button
                        onClick={() => addSkill('technical')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.technical.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill('technical', skill)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Soft Skills</h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill.soft}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, soft: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill('soft')}
                        placeholder="Add a soft skill"
                        className="flex-1 px-4 py-2 border rounded-lg"
                      />
                      <button
                        onClick={() => addSkill('soft')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.soft.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill('soft', skill)}
                            className="text-green-500 hover:text-green-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Languages</h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill.languages}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, languages: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill('languages')}
                        placeholder="Add a language (e.g., English - Native)"
                        className="flex-1 px-4 py-2 border rounded-lg"
                      />
                      <button
                        onClick={() => addSkill('languages')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center gap-2"
                        >
                          {lang}
                          <button
                            onClick={() => removeSkill('languages', lang)}
                            className="text-purple-500 hover:text-purple-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings Section */}
              {activeSection === 'settings' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>

                  {/* Change Password */}
                  <div className="p-6 border rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Email Preferences */}
                  <div className="p-6 border rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Email Preferences</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>Document ready notifications</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>Low credit warnings</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" />
                        <span>Weekly usage summary</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>Product updates and tips</span>
                      </label>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                    <h3 className="text-lg font-medium text-red-800 mb-4">Danger Zone</h3>
                    <p className="text-sm text-red-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
