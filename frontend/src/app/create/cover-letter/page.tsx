'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface CoverLetterData {
  recipientName: string;
  companyName: string;
  jobTitle: string;
  content: string;
}

export default function CreateCoverLetterPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetJob, setTargetJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>({
    recipientName: 'Hiring Manager',
    companyName: '',
    jobTitle: '',
    content: '',
  });

  useEffect(() => {
    const storedJob = sessionStorage.getItem('targetJob');
    if (storedJob) {
      const job = JSON.parse(storedJob);
      setTargetJob(job);
      setCoverLetter(prev => ({
        ...prev,
        companyName: job.company || '',
        jobTitle: job.title || '',
      }));
    }
  }, []);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetJob,
          recipientName: coverLetter.recipientName,
          companyName: coverLetter.companyName,
          jobTitle: coverLetter.jobTitle,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCoverLetter(prev => ({ ...prev, content: data.content }));
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/cover-letter/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coverLetter),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cover_Letter_${coverLetter.companyName.replace(/\s+/g, '_')}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
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
          Create Cover Letter
        </h1>
        {targetJob && (
          <div style={{
            background: '#eef2ff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            <span style={{ color: '#64748b' }}>For: </span>
            <span style={{ color: '#667eea', fontWeight: '600' }}>
              {targetJob.title} at {targetJob.company}
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '32px 24px',
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '32px',
      }}>
        {/* Left Panel - Settings */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          height: 'fit-content',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Letter Details
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Recipient Name</label>
              <input
                type="text"
                value={coverLetter.recipientName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setCoverLetter(prev => ({ ...prev, recipientName: e.target.value }))}
                placeholder="Hiring Manager"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Company Name *</label>
              <input
                type="text"
                value={coverLetter.companyName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setCoverLetter(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Google"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Position Applied For *</label>
              <input
                type="text"
                value={coverLetter.jobTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setCoverLetter(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="Software Engineer"
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleAIGenerate}
              disabled={isGenerating || !coverLetter.companyName || !coverLetter.jobTitle}
              style={{
                padding: '14px 24px',
                background: isGenerating ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                marginTop: '8px',
              }}
            >
              {isGenerating ? '✨ Generating...' : '✨ Generate with AI'}
            </button>
          </div>

          {targetJob && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #86efac',
            }}>
              <p style={{ fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
                💡 AI Tips
              </p>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '13px',
                color: '#15803d',
              }}>
                <li>Letter will be tailored to job requirements</li>
                <li>Key skills will be highlighted</li>
                <li>Professional tone with specific examples</li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Panel - Editor */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
              Cover Letter Content
            </h2>
            {coverLetter.content && (
              <span style={{
                background: '#dcfce7',
                color: '#166534',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
              }}>
                ✓ Generated
              </span>
            )}
          </div>

          <textarea
            value={coverLetter.content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => 
              setCoverLetter(prev => ({ ...prev, content: e.target.value }))}
            placeholder={`Dear ${coverLetter.recipientName || 'Hiring Manager'},

I am writing to express my interest in the ${coverLetter.jobTitle || '[Position]'} role at ${coverLetter.companyName || '[Company]'}...

Click "Generate with AI" to create a professional cover letter tailored to the job.`}
            style={{
              width: '100%',
              minHeight: '500px',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              lineHeight: '1.8',
              fontFamily: 'Georgia, serif',
              resize: 'vertical',
              outline: 'none',
            }}
          />

          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '20px',
          }}>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating || !coverLetter.content}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: !coverLetter.content ? '#f1f5f9' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: !coverLetter.content ? '#94a3b8' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: !coverLetter.content ? 'not-allowed' : 'pointer',
              }}
            >
              📄 Download PDF
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(coverLetter.content)}
              disabled={!coverLetter.content}
              style={{
                padding: '14px 24px',
                background: !coverLetter.content ? '#f1f5f9' : 'white',
                color: !coverLetter.content ? '#94a3b8' : '#334155',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: !coverLetter.content ? 'not-allowed' : 'pointer',
              }}
            >
              📋 Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
