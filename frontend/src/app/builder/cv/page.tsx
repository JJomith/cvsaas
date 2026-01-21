'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  Download,
  Eye,
  Wand2,
  Target,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Palette,
  Type,
  Layout
} from 'lucide-react';

// Mock CV data
const mockCVData = {
  basics: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    headline: 'Senior Software Engineer',
    summary: 'Passionate software engineer with 8+ years of experience building scalable web applications.',
    linkedinUrl: 'linkedin.com/in/johndoe',
    githubUrl: 'github.com/johndoe',
  },
  experiences: [
    {
      id: '1',
      company: 'Tech Corp',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Mar 2021',
      endDate: 'Present',
      description: 'Leading frontend development team, implementing new features and improving performance.',
      achievements: [
        'Reduced page load time by 40% through optimization',
        'Mentored 5 junior developers',
        'Led migration to microservices architecture',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      startDate: '2014',
      endDate: '2018',
      gpa: '3.8',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
};

// CV Templates
const templates = [
  { id: 'modern', name: 'Modern Minimal', preview: '📄' },
  { id: 'professional', name: 'Professional', preview: '📋' },
  { id: 'creative', name: 'Creative', preview: '🎨' },
  { id: 'tech', name: 'Tech Focused', preview: '💻' },
];

const colorThemes = [
  { id: 'blue', name: 'Blue', primary: '#2563eb', secondary: '#3b82f6' },
  { id: 'green', name: 'Green', primary: '#059669', secondary: '#10b981' },
  { id: 'purple', name: 'Purple', primary: '#7c3aed', secondary: '#8b5cf6' },
  { id: 'gray', name: 'Gray', primary: '#374151', secondary: '#6b7280' },
  { id: 'red', name: 'Red', primary: '#dc2626', secondary: '#ef4444' },
];

export default function CVBuilderPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'preview'>('content');
  const [cvData, setCvData] = useState(mockCVData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [isGenerating, setIsGenerating] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [showJobInput, setShowJobInput] = useState(true);

  // Get job description from URL if present
  useEffect(() => {
    const job = searchParams.get('job');
    if (job) {
      setJobDescription(decodeURIComponent(job));
      setShowJobInput(false);
    }
  }, [searchParams]);

  const handleGenerateWithAI = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description first');
      return;
    }
    
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setAtsScore(92);
  };

  const handleCheckATS = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAtsScore(Math.floor(Math.random() * 20) + 80);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/documents" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="font-semibold text-gray-900">CV Builder</h1>
                <p className="text-sm text-gray-500">Untitled CV</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {atsScore && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  atsScore >= 90 ? 'bg-green-100 text-green-700' : 
                  atsScore >= 75 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  <Target className="h-4 w-4" />
                  ATS Score: {atsScore}%
                </div>
              )}
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Editor */}
          <div className="space-y-6">
            {/* Job Description Input */}
            {showJobInput && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Job Description</h2>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to generate a tailored CV..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    The AI will tailor your CV to match this job description
                  </p>
                  <button
                    onClick={handleGenerateWithAI}
                    disabled={isGenerating || !jobDescription.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'content'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'design'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Design
                </button>
              </div>

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="p-6 space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={cvData.basics.firstName}
                          onChange={(e) => setCvData({
                            ...cvData,
                            basics: { ...cvData.basics, firstName: e.target.value }
                          })}
                          placeholder="First Name"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={cvData.basics.lastName}
                          onChange={(e) => setCvData({
                            ...cvData,
                            basics: { ...cvData.basics, lastName: e.target.value }
                          })}
                          placeholder="Last Name"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        value={cvData.basics.headline}
                        onChange={(e) => setCvData({
                          ...cvData,
                          basics: { ...cvData.basics, headline: e.target.value }
                        })}
                        placeholder="Professional Headline"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="email"
                          value={cvData.basics.email}
                          onChange={(e) => setCvData({
                            ...cvData,
                            basics: { ...cvData.basics, email: e.target.value }
                          })}
                          placeholder="Email"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="tel"
                          value={cvData.basics.phone}
                          onChange={(e) => setCvData({
                            ...cvData,
                            basics: { ...cvData.basics, phone: e.target.value }
                          })}
                          placeholder="Phone"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        value={cvData.basics.location}
                        onChange={(e) => setCvData({
                          ...cvData,
                          basics: { ...cvData.basics, location: e.target.value }
                        })}
                        placeholder="Location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Professional Summary</h3>
                      <button 
                        onClick={handleGenerateWithAI}
                        disabled={isGenerating}
                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        Enhance with AI
                      </button>
                    </div>
                    <textarea
                      value={cvData.basics.summary}
                      onChange={(e) => setCvData({
                        ...cvData,
                        basics: { ...cvData.basics, summary: e.target.value }
                      })}
                      rows={4}
                      placeholder="Brief professional summary..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Work Experience</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700">+ Add</button>
                    </div>
                    {cvData.experiences.map((exp) => (
                      <div key={exp.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={exp.title}
                            placeholder="Job Title"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            placeholder="Company"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <textarea
                          value={exp.description}
                          rows={3}
                          placeholder="Job description and achievements..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                        >
                          {skill}
                          <button className="text-gray-400 hover:text-red-500">×</button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add skill..."
                        className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement;
                            if (target.value.trim()) {
                              setCvData({
                                ...cvData,
                                skills: [...cvData.skills, target.value.trim()]
                              });
                              target.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Design Tab */}
              {activeTab === 'design' && (
                <div className="p-6 space-y-6">
                  {/* Template Selection */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      Template
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-3xl">{template.preview}</span>
                          <p className="text-sm font-medium mt-2">{template.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Theme */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Color Theme
                    </h3>
                    <div className="flex gap-3">
                      {colorThemes.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            selectedColor === color.id
                              ? 'border-gray-900 scale-110'
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.primary }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Font
                    </h3>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="inter">Inter</option>
                      <option value="roboto">Roboto</option>
                      <option value="opensans">Open Sans</option>
                      <option value="lato">Lato</option>
                      <option value="merriweather">Merriweather</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* ATS Check Button */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">ATS Optimization</h3>
                  <p className="text-sm text-gray-500">Check how well your CV matches the job</p>
                </div>
                <button
                  onClick={handleCheckATS}
                  disabled={isGenerating}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Target className="h-4 w-4" />
                  )}
                  Check ATS Score
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-xl border border-gray-200 h-full overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Live Preview</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-500">Page 1 of 1</span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* CV Preview */}
              <div className="flex-1 overflow-auto p-6 bg-gray-100">
                <div 
                  className="bg-white shadow-lg mx-auto"
                  style={{ 
                    width: '100%', 
                    maxWidth: '595px', 
                    minHeight: '842px',
                    padding: '40px'
                  }}
                >
                  {/* CV Header */}
                  <div className="text-center mb-6" style={{ borderBottom: `3px solid ${colorThemes.find(c => c.id === selectedColor)?.primary}` }}>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {cvData.basics.firstName} {cvData.basics.lastName}
                    </h1>
                    <p className="text-lg" style={{ color: colorThemes.find(c => c.id === selectedColor)?.primary }}>
                      {cvData.basics.headline}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-2 pb-4">
                      <span>{cvData.basics.email}</span>
                      <span>•</span>
                      <span>{cvData.basics.phone}</span>
                      <span>•</span>
                      <span>{cvData.basics.location}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-6">
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-2"
                      style={{ color: colorThemes.find(c => c.id === selectedColor)?.primary }}
                    >
                      Professional Summary
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {cvData.basics.summary}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-6">
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-3"
                      style={{ color: colorThemes.find(c => c.id === selectedColor)?.primary }}
                    >
                      Work Experience
                    </h2>
                    {cvData.experiences.map((exp) => (
                      <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                            <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
                          </div>
                          <span className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                        <ul className="mt-2 space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span style={{ color: colorThemes.find(c => c.id === selectedColor)?.primary }}>•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div className="mb-6">
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-3"
                      style={{ color: colorThemes.find(c => c.id === selectedColor)?.primary }}
                    >
                      Education
                    </h2>
                    {cvData.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                        </div>
                        <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div>
                    <h2 
                      className="text-sm font-bold uppercase tracking-wider mb-3"
                      style={{ color: colorThemes.find(c => c.id === selectedColor)?.primary }}
                    >
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded"
                          style={{ 
                            backgroundColor: `${colorThemes.find(c => c.id === selectedColor)?.primary}15`,
                            color: colorThemes.find(c => c.id === selectedColor)?.primary
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
