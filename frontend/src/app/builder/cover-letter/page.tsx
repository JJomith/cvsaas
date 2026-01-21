'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  Download,
  Wand2,
  Loader2,
  Building,
  User,
  Sparkles
} from 'lucide-react';

// Cover letter templates
const templates = [
  { id: 'professional', name: 'Professional', preview: '📋' },
  { id: 'modern', name: 'Modern', preview: '✨' },
  { id: 'creative', name: 'Creative', preview: '🎨' },
];

export default function CoverLetterBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetterData, setCoverLetterData] = useState({
    recipientName: 'Hiring Manager',
    companyName: '',
    jobTitle: '',
    opening: '',
    body: '',
    closing: '',
    signature: 'John Doe',
  });

  const handleGenerateWithAI = async () => {
    if (!jobDescription.trim() || !coverLetterData.companyName.trim()) {
      alert('Please enter the job description and company name');
      return;
    }
    
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCoverLetterData({
      ...coverLetterData,
      opening: `I am writing to express my strong interest in the ${coverLetterData.jobTitle || 'position'} at ${coverLetterData.companyName}. With my extensive background in software development and passion for building innovative solutions, I am confident that I would be a valuable addition to your team.`,
      body: `Throughout my career, I have developed a deep expertise in modern web technologies and have successfully delivered numerous high-impact projects. My experience aligns perfectly with the requirements outlined in your job posting.\n\nAt my current role, I have led cross-functional teams to deliver complex features, improved application performance by 40%, and mentored junior developers. I am particularly drawn to ${coverLetterData.companyName}'s commitment to innovation and would love the opportunity to contribute to your mission.`,
      closing: `I am excited about the possibility of bringing my skills and experience to ${coverLetterData.companyName}. I would welcome the opportunity to discuss how my background, skills, and enthusiasm can benefit your team.\n\nThank you for considering my application. I look forward to hearing from you.`,
    });
    
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
                <h1 className="font-semibold text-gray-900">Cover Letter Builder</h1>
                <p className="text-sm text-gray-500">Untitled Cover Letter</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Job</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={coverLetterData.companyName}
                        onChange={(e) => setCoverLetterData({ ...coverLetterData, companyName: e.target.value })}
                        placeholder="e.g., Google"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={coverLetterData.jobTitle}
                      onChange={(e) => setCoverLetterData({ ...coverLetterData, jobTitle: e.target.value })}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || !coverLetterData.companyName.trim()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Cover Letter...
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

            {/* Template Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-3">Template</h3>
              <div className="grid grid-cols-3 gap-3">
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
                    <span className="text-2xl">{template.preview}</span>
                    <p className="text-sm font-medium mt-1">{template.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="font-medium text-gray-900">Content</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={coverLetterData.recipientName}
                      onChange={(e) => setCoverLetterData({ ...coverLetterData, recipientName: e.target.value })}
                      placeholder="Hiring Manager"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={coverLetterData.signature}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, signature: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Opening Paragraph</label>
                  <button className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Enhance
                  </button>
                </div>
                <textarea
                  value={coverLetterData.opening}
                  onChange={(e) => setCoverLetterData({ ...coverLetterData, opening: e.target.value })}
                  placeholder="Introduction and why you're interested..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Body</label>
                  <button className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Enhance
                  </button>
                </div>
                <textarea
                  value={coverLetterData.body}
                  onChange={(e) => setCoverLetterData({ ...coverLetterData, body: e.target.value })}
                  placeholder="Your experience, skills, and why you're a good fit..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Closing Paragraph</label>
                  <button className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Enhance
                  </button>
                </div>
                <textarea
                  value={coverLetterData.closing}
                  onChange={(e) => setCoverLetterData({ ...coverLetterData, closing: e.target.value })}
                  placeholder="Call to action and thank you..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-xl border border-gray-200 h-full overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Live Preview</h3>
              </div>
              
              {/* Cover Letter Preview */}
              <div className="flex-1 overflow-auto p-6 bg-gray-100">
                <div 
                  className="bg-white shadow-lg mx-auto"
                  style={{ 
                    width: '100%', 
                    maxWidth: '595px', 
                    minHeight: '842px',
                    padding: '60px 50px'
                  }}
                >
                  {/* Header */}
                  <div className="mb-8">
                    <h1 className="text-xl font-bold text-gray-900">{coverLetterData.signature}</h1>
                    <p className="text-sm text-gray-600">john.doe@example.com • +1 (555) 123-4567</p>
                    <p className="text-sm text-gray-600">San Francisco, CA</p>
                  </div>

                  {/* Date */}
                  <div className="mb-6 text-sm text-gray-600">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>

                  {/* Recipient */}
                  <div className="mb-6 text-sm">
                    <p className="text-gray-900">Dear {coverLetterData.recipientName},</p>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                    {coverLetterData.opening && (
                      <p>{coverLetterData.opening}</p>
                    )}
                    
                    {coverLetterData.body && (
                      <div className="whitespace-pre-line">{coverLetterData.body}</div>
                    )}
                    
                    {coverLetterData.closing && (
                      <div className="whitespace-pre-line">{coverLetterData.closing}</div>
                    )}
                    
                    {!coverLetterData.opening && !coverLetterData.body && !coverLetterData.closing && (
                      <p className="text-gray-400 italic">
                        Your cover letter content will appear here. Fill in the job details and click &quot;Generate with AI&quot; to get started.
                      </p>
                    )}
                  </div>

                  {/* Signature */}
                  <div className="mt-8 text-sm">
                    <p className="text-gray-700">Sincerely,</p>
                    <p className="mt-4 font-semibold text-gray-900">{coverLetterData.signature}</p>
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
