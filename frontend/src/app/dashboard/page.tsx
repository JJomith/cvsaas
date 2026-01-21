'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserData {
  name: string;
  email: string;
  credits: number;
}

interface Document {
  id: string;
  type: 'CV' | 'COVER_LETTER';
  title: string;
  createdAt: string;
  templateId: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchDocuments();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const quickActions = [
    {
      title: 'Create CV',
      description: 'Build an ATS-optimized CV',
      icon: '📄',
      href: '/job-input',
      color: '#667eea',
    },
    {
      title: 'Cover Letter',
      description: 'Generate a tailored cover letter',
      icon: '✉️',
      href: '/create/cover-letter',
      color: '#10b981',
    },
    {
      title: 'Templates',
      description: 'Browse CV templates',
      icon: '🎨',
      href: '/templates',
      color: '#f59e0b',
    },
    {
      title: 'Import LinkedIn',
      description: 'Import your profile',
      icon: '💼',
      href: '/import/linkedin',
      color: '#0077b5',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          CV Builder
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: '#eef2ff',
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>💳</span>
            <span style={{ fontWeight: '600', color: '#667eea' }}>
              {user?.credits ?? 0} credits
            </span>
          </div>
          <Link
            href="/pricing"
            style={{
              background: '#667eea',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px',
            }}
          >
            Buy Credits
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
          </h2>
          <p style={{ color: '#64748b' }}>
            Create professional CVs and cover letters with AI assistance.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${action.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px',
              }}>
                {action.icon}
              </div>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#0f172a',
                marginBottom: '4px',
              }}>
                {action.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                {action.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Documents */}
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
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
              Recent Documents
            </h3>
            <Link
              href="/documents"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              View All →
            </Link>
          </div>

          {documents.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              color: '#64748b',
            }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📝</p>
              <p style={{ marginBottom: '8px' }}>No documents yet</p>
              <Link
                href="/job-input"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '500',
                }}
              >
                Create your first CV →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>
                      {doc.type === 'CV' ? '📄' : '✉️'}
                    </span>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '2px' }}>
                        {doc.title || `Untitled ${doc.type}`}
                      </p>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        padding: '8px 16px',
                        background: '#eef2ff',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: '8px 16px',
                        background: '#f1f5f9',
                        color: '#334155',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credit Usage */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Credit Usage
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{
              padding: '16px',
              background: '#f0fdf4',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <p style={{ color: '#166534', fontSize: '13px', marginBottom: '4px' }}>
                Available
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#166534' }}>
                {user?.credits ?? 0}
              </p>
            </div>
            <div style={{
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <p style={{ color: '#92400e', fontSize: '13px', marginBottom: '4px' }}>
                Used This Month
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#92400e' }}>
                0
              </p>
            </div>
            <div style={{
              padding: '16px',
              background: '#eef2ff',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <p style={{ color: '#4338ca', fontSize: '13px', marginBottom: '4px' }}>
                Total Purchased
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4338ca' }}>
                0
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
              💡 Credit costs:
            </p>
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
              <span>• CV Generation: 1 credit</span>
              <span>• Cover Letter: 1 credit</span>
              <span>• AI Enhancement: 1 credit</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
