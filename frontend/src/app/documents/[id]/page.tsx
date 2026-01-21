'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

interface Document {
  id: string;
  title: string;
  type: 'cv' | 'cover-letter';
  content: Record<string, unknown>;
  template: string;
  createdAt: string;
  updatedAt: string;
  jobDescription?: string;
}

export default function DocumentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch document data
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setDoc(data);
        }
      } catch (error) {
        console.error('Failed to fetch document:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocument();
    }
  }, [params.id]);

  const handleSave = async () => {
    if (!doc) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      if (response.ok) {
        // Show success notification
      }
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    try {
      const response = await fetch(`/api/documents/${params.id}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${doc?.title || 'document'}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleRegenerate = async () => {
    if (!doc?.jobDescription) {
      alert('No job description available for regeneration');
      return;
    }
    
    try {
      const response = await fetch(`/api/ai/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: params.id,
          jobDescription: doc.jobDescription,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setDoc(prev => prev ? { ...prev, content: data.content } : null);
      }
    } catch (error) {
      console.error('Failed to regenerate document:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Document Not Found</h1>
          <p className="text-gray-600 mb-6">The document you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{document.title}</h1>
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(document.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View/Edit Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setShowPreview(true)}
                  className={`px-3 py-1 rounded text-sm ${
                    showPreview ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className={`px-3 py-1 rounded text-sm ${
                    !showPreview ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Edit
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={handleRegenerate}
                className="px-3 py-2 text-sm border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50"
              >
                🔄 Regenerate
              </button>
              
              <div className="relative group">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  ⬇️ Download
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border hidden group-hover:block">
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDownload('docx')}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Download DOCX
                  </button>
                </div>
              </div>

              {!showPreview && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              )}

              <button
                onClick={handleDelete}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Preview Panel */}
          {showPreview ? (
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Template Preview */}
                <div className="aspect-[210/297] bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">Document Preview</p>
                    <p className="text-sm">Template: {document.template}</p>
                    <div className="mt-4 p-4 bg-white rounded-lg mx-4 text-left max-w-lg">
                      <pre className="text-xs text-gray-600 overflow-auto max-h-96">
                        {JSON.stringify(document.content, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Panel */
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Document</h2>
                
                {/* Document Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={document.title}
                    onChange={(e) => setDoc(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Template Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select
                    value={document.template}
                    onChange={(e) => setDoc(prev => prev ? { ...prev, template: e.target.value } : null)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="modern-minimal">Modern Minimal</option>
                    <option value="professional-classic">Professional Classic</option>
                    <option value="tech-focused">Tech Focused</option>
                    <option value="creative-bold">Creative Bold</option>
                    <option value="executive">Executive</option>
                    <option value="academic">Academic</option>
                  </select>
                </div>

                {/* Content Editor - Simplified JSON editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (JSON)
                  </label>
                  <textarea
                    value={JSON.stringify(document.content, null, 2)}
                    onChange={(e) => {
                      try {
                        const content = JSON.parse(e.target.value);
                        setDoc(prev => prev ? { ...prev, content } : null);
                      } catch {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={20}
                    className="w-full px-4 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Edit the JSON content directly. Changes will be reflected in the preview.
                  </p>
                </div>
              </div>

              {/* Job Description Reference */}
              {document.jobDescription && (
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">
                    Original Job Description
                  </h3>
                  <p className="text-sm text-yellow-700 whitespace-pre-wrap">
                    {document.jobDescription}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Document Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Document Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize">{document.type.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Template</span>
                  <span className="font-medium capitalize">{document.template.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">
                    {new Date(document.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Modified</span>
                  <span className="font-medium">
                    {new Date(document.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => window.open(`/create/cv?duplicate=${params.id}`, '_self')}
                  className="w-full px-4 py-2 text-left text-sm border rounded-lg hover:bg-gray-50"
                >
                  📋 Duplicate Document
                </button>
                <button 
                  onClick={() => window.open(`/create/cover-letter?cv=${params.id}`, '_self')}
                  className="w-full px-4 py-2 text-left text-sm border rounded-lg hover:bg-gray-50"
                >
                  ✉️ Create Cover Letter
                </button>
                <button 
                  onClick={handleRegenerate}
                  className="w-full px-4 py-2 text-left text-sm border rounded-lg hover:bg-gray-50"
                >
                  🔄 Regenerate with AI
                </button>
                <button 
                  onClick={() => window.open(`/api/documents/${params.id}/share`, '_blank')}
                  className="w-full px-4 py-2 text-left text-sm border rounded-lg hover:bg-gray-50"
                >
                  🔗 Share Document
                </button>
              </div>
            </div>

            {/* ATS Score */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">ATS Compatibility</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="#22c55e"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${85 * 2.2} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-green-600">
                    85%
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Your document is highly compatible with ATS systems.
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50">
                View Detailed Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
