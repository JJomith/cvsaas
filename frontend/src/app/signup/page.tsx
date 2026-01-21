'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
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
            Create Account
          </h1>
          <p style={{ color: '#64748b' }}>
            Start building amazing CVs for free
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#334155',
              fontSize: '14px',
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
              placeholder="John Doe"
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

          <div style={{ marginBottom: '16px' }}>
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
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#334155',
              fontSize: '14px',
            }}>
              Password
            </label>
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
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Minimum 8 characters
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#334155',
              fontSize: '14px',
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{
            marginTop: '16px',
            fontSize: '12px',
            color: '#94a3b8',
            textAlign: 'center',
          }}>
            By signing up, you agree to our{' '}
            <Link href="/terms" style={{ color: '#667eea' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: '#667eea' }}>Privacy Policy</Link>
          </p>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
        }}>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              style={{
                color: '#667eea',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
          </p>
        </div>

        <div style={{
          background: '#f0fdf4',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🎁</span>
            <div>
              <p style={{ fontWeight: '600', color: '#166534', marginBottom: '2px' }}>
                Get 5 free credits!
              </p>
              <p style={{ fontSize: '13px', color: '#15803d' }}>
                Start creating CVs immediately after signup
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
