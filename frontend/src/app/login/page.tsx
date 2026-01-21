'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#64748b' }}>
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#334155',
              fontSize: '14px',
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <label style={{
                fontWeight: '500',
                color: '#334155',
                fontSize: '14px',
              }}>
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{
                  color: '#667eea',
                  fontSize: '13px',
                  textDecoration: 'none',
                }}
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: '20px',
              padding: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#dc2626',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
        }}>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link
              href="/signup"
              style={{
                color: '#667eea',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Sign up free
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '12px',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🔷</span> Google
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '12px',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>💼</span> LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
