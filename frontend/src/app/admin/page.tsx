'use client';

import { useState, useEffect } from 'react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  totalRevenue: number;
  recentSignups: number;
  documentsByType: { type: string; count: number }[];
  creditUsageToday: number;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  emailVerified: boolean;
  credits: { balance: number; totalPurchased: number; totalUsed: number } | null;
  _count: { documents: number; payments: number };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings' | 'payments'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiProvider, setAiProvider] = useState('openai');
  const [aiModel, setAiModel] = useState('gpt-4o-mini');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const saveAISettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/ai', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: aiProvider, model: aiModel }),
      });
      if (response.ok) {
        alert('AI settings saved!');
      }
    } catch (error) {
      console.error('Failed to save AI settings:', error);
    }
  };

  const addCredits = async (userId: string, amount: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason: 'Admin adjustment' }),
      });
      if (response.ok) {
        fetchUsers();
        alert('Credits added successfully');
      }
    } catch (error) {
      console.error('Failed to add credits:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'payments', label: '💳 Payments', icon: '💳' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '24px 16px',
      }}>
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '32px',
          paddingLeft: '12px',
        }}>
          🎯 Admin Panel
        </h1>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.6)',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '400',
                transition: 'all 0.2s',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label.replace(tab.icon + ' ', '')}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px' }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
              Dashboard Overview
            </h2>

            {loading ? (
              <p>Loading stats...</p>
            ) : stats ? (
              <>
                {/* Stats Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: '20px',
                  marginBottom: '32px',
                }}>
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon="👥"
                    color="#667eea"
                  />
                  <StatCard
                    title="Active Users (30d)"
                    value={stats.activeUsers}
                    icon="✅"
                    color="#10b981"
                  />
                  <StatCard
                    title="Total Documents"
                    value={stats.totalDocuments}
                    icon="📄"
                    color="#f59e0b"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toFixed(2)}`}
                    icon="💰"
                    color="#ec4899"
                  />
                </div>

                {/* Additional Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                      📈 Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>New signups (7d)</span>
                        <span style={{ fontWeight: '600' }}>{stats.recentSignups}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Credits used today</span>
                        <span style={{ fontWeight: '600' }}>{stats.creditUsageToday}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                      📊 Documents by Type
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {stats.documentsByType.map((doc) => (
                        <div key={doc.type} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>{doc.type}</span>
                          <span style={{ fontWeight: '600' }}>{doc.count}</span>
                        </div>
                      ))}
                      {stats.documentsByType.length === 0 && (
                        <p style={{ color: '#94a3b8' }}>No documents yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p>Failed to load stats</p>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
              User Management
            </h2>

            <div style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>User</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Role</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Credits</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Documents</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Joined</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px' }}>
                        <div>
                          <p style={{ fontWeight: '600', marginBottom: '2px' }}>{user.name || 'No name'}</p>
                          <p style={{ color: '#64748b', fontSize: '13px' }}>{user.email}</p>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: user.role === 'ADMIN' ? '#fef3c7' : '#f1f5f9',
                          color: user.role === 'ADMIN' ? '#92400e' : '#64748b',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        {user.credits?.balance ?? 0}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {user._count?.documents ?? 0}
                      </td>
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button
                          onClick={() => {
                            const amount = prompt('Enter credits to add (negative to deduct):');
                            if (amount) addCredits(user.id, parseInt(amount));
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#eef2ff',
                            color: '#667eea',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          Add Credits
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                  No users found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
              Payment History
            </h2>

            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <p style={{ color: '#64748b', marginBottom: '16px' }}>
                Payment history will appear here once transactions are made.
              </p>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Configure Stripe to enable payments.
              </p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
              System Settings
            </h2>

            {/* AI Provider Settings */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                🤖 AI Provider Configuration
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#334155' }}>
                    AI Provider
                  </label>
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                    }}
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic Claude</option>
                    <option value="google">Google Gemini</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#334155' }}>
                    Model
                  </label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                    }}
                  >
                    {aiProvider === 'openai' && (
                      <>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      </>
                    )}
                    {aiProvider === 'anthropic' && (
                      <>
                        <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                        <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                        <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                      </>
                    )}
                    {aiProvider === 'google' && (
                      <>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <button
                onClick={saveAISettings}
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Save AI Settings
              </button>
            </div>

            {/* Credit Pack Settings */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                💳 Credit Pack Configuration
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                }}>
                  <div>
                    <p style={{ fontWeight: '600' }}>Starter Pack</p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>25 credits</p>
                  </div>
                  <span style={{ fontWeight: '600', color: '#667eea' }}>$9.99</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                }}>
                  <div>
                    <p style={{ fontWeight: '600' }}>Pro Pack</p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>100 credits</p>
                  </div>
                  <span style={{ fontWeight: '600', color: '#667eea' }}>$29.99</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                }}>
                  <div>
                    <p style={{ fontWeight: '600' }}>Enterprise Pack</p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>500 credits</p>
                  </div>
                  <span style={{ fontWeight: '600', color: '#667eea' }}>$99.99</span>
                </div>
              </div>

              <p style={{ 
                marginTop: '16px', 
                color: '#94a3b8', 
                fontSize: '13px' 
              }}>
                To modify credit packs, update them in the database or via API.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: string | number; 
  icon: string; 
  color: string;
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>{title}</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{value}</p>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
