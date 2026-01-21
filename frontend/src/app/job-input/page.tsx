'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  keywords: string[];
  salary?: string;
  employmentType?: string;
}

export default function JobInputPage() {
  const router = useRouter();
  const [inputMethod, setInputMethod] = useState<'paste' | 'url' | 'linkedin'>('paste');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analyzedJob, setAnalyzedJob] = useState<JobData | null>(null);

  const handlePasteSubmit = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/jobs/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: jobDescription }),
      });

      if (!response.ok) throw new Error('Failed to analyze job');
      
      const data = await response.json();
      setAnalyzedJob(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze job description');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!jobUrl.trim()) {
      setError('Please enter a job URL');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/jobs/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl }),
      });

      if (!response.ok) throw new Error('Failed to scrape job URL');
      
      const data = await response.json();
      setAnalyzedJob(data);
    } catch (err: any) {
      setError(err.message || 'Failed to scrape job URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSubmit = async () => {
    if (!linkedinUrl.trim()) {
      setError('Please enter a LinkedIn job URL');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/jobs/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkedinUrl }),
      });

      if (!response.ok) throw new Error('Failed to import from LinkedIn');
      
      const data = await response.json();
      setAnalyzedJob(data);
    } catch (err: any) {
      setError(err.message || 'Failed to import from LinkedIn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (analyzedJob) {
      // Store job data and navigate to CV creation
      sessionStorage.setItem('targetJob', JSON.stringify(analyzedJob));
      router.push('/create/cv');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
      padding: '40px 20px' 
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          textAlign: 'center',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Target Your Dream Job
        </h1>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '32px' }}>
          Provide the job details to create an ATS-optimized CV tailored to this position
        </p>

        {/* Input Method Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px',
          justifyContent: 'center' 
        }}>
          {[
            { id: 'paste', label: '📋 Paste Description', icon: '📋' },
            { id: 'url', label: '🔗 Job URL', icon: '🔗' },
            { id: 'linkedin', label: '💼 LinkedIn', icon: '💼' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setInputMethod(tab.id as any);
                setError('');
                setAnalyzedJob(null);
              }}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: inputMethod === tab.id ? '2px solid #667eea' : '2px solid #e2e8f0',
                background: inputMethod === tab.id ? '#eef2ff' : 'white',
                color: inputMethod === tab.id ? '#667eea' : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginBottom: '24px',
        }}>
          {inputMethod === 'paste' && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#334155' 
              }}>
                Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                style={{
                  width: '100%',
                  minHeight: '300px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
              <button
                onClick={handlePasteSubmit}
                disabled={isLoading}
                style={{
                  marginTop: '16px',
                  padding: '14px 32px',
                  background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Job Description'}
              </button>
            </div>
          )}

          {inputMethod === 'url' && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#334155' 
              }}>
                Job Listing URL
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://example.com/jobs/software-engineer"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '12px', 
                marginTop: '8px' 
              }}>
                Supported: Indeed, Glassdoor, Monster, company career pages, and more
              </p>
              <button
                onClick={handleUrlSubmit}
                disabled={isLoading}
                style={{
                  marginTop: '16px',
                  padding: '14px 32px',
                  background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {isLoading ? 'Scraping...' : 'Import from URL'}
              </button>
            </div>
          )}

          {inputMethod === 'linkedin' && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#334155' 
              }}>
                LinkedIn Job URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/jobs/view/123456789"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '12px', 
                marginTop: '8px' 
              }}>
                Paste a LinkedIn job posting URL to import job details
              </p>
              <button
                onClick={handleLinkedInSubmit}
                disabled={isLoading}
                style={{
                  marginTop: '16px',
                  padding: '14px 32px',
                  background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {isLoading ? 'Importing...' : 'Import from LinkedIn'}
              </button>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Analyzed Job Preview */}
        {analyzedJob && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '24px',
            }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                Job Analyzed Successfully
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}>
                  {analyzedJob.title}
                </h3>
                <p style={{ color: '#667eea', fontWeight: '600' }}>
                  {analyzedJob.company}
                </p>
                <p style={{ color: '#64748b' }}>{analyzedJob.location}</p>
              </div>

              {analyzedJob.keywords.length > 0 && (
                <div>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: '8px',
                  }}>
                    KEY SKILLS DETECTED
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {analyzedJob.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#eef2ff',
                          color: '#667eea',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analyzedJob.requirements.length > 0 && (
                <div>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: '8px',
                  }}>
                    REQUIREMENTS
                  </h4>
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: '20px',
                    color: '#334155',
                  }}>
                    {analyzedJob.requirements.slice(0, 5).map((req, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{req}</li>
                    ))}
                    {analyzedJob.requirements.length > 5 && (
                      <li style={{ color: '#94a3b8' }}>
                        +{analyzedJob.requirements.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleContinue}
              style={{
                marginTop: '24px',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                fontSize: '16px',
              }}
            >
              Continue to Create CV →
            </button>
          </div>
        )}

        {/* Skip Option */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => router.push('/create/cv')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Skip and create a general CV →
          </button>
        </div>
      </div>
    </div>
  );
}
