'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Lock, Mail, Instagram, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'admin'
  const { login, register, user } = useAuth();
  const router = useRouter();

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regInstagram, setRegInstagram] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      setSuccess('Logged in successfully! Token stored.');
      setTimeout(() => {
        if (res.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 700);
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = register(regName, regEmail, regPassword, regInstagram, regPhone);
    if (res.success) {
      setSuccess('Registered successfully! Logged in as member.');
      setTimeout(() => router.push('/'), 800);
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  const fillAdminCredentials = () => {
    setLoginEmail('admin@thechaseclub.in');
    setLoginPassword('chaseadmin2026');
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: '60px 0 90px' }}>
        <div className="container" style={{ maxWidth: 480 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div className="brand-logo-large" style={{ margin: '0 auto 16px', width: 64, height: 64 }}>
              <img src="/assets/chase-club-logo.jpg" alt="The Chase Club" />
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>The Chase Club Portal</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Sign in or register to access events, manage RSVPs, and store your session token.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-card)' }}>
            {/* Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, background: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-sm)', marginBottom: 24 }}>
              <button
                onClick={() => { setTab('login'); setError(''); }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: tab === 'login' ? 'var(--crimson)' : 'transparent',
                  color: tab === 'login' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: tab === 'register' ? 'var(--crimson)' : 'transparent',
                  color: tab === 'register' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Register
              </button>
              <button
                onClick={() => { setTab('admin'); fillAdminCredentials(); setError(''); }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: tab === 'admin' ? 'var(--crimson)' : 'transparent',
                  color: tab === 'admin' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Admin
              </button>
            </div>

            {error && <div className="form-error-banner">{error}</div>}
            {success && (
              <div style={{ background: 'rgba(204, 255, 0, 0.15)', border: '1px solid var(--volt)', color: 'var(--volt)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', marginBottom: 16 }}>
                {success}
              </div>
            )}

            {/* TAB: SIGN IN */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="runner@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    className="input-field"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
                  Sign In &amp; Save Token &rarr;
                </button>
              </form>
            )}

            {/* TAB: REGISTER */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Ankit Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="ankit@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Instagram Handle *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="@ankit_runs"
                    value={regInstagram}
                    onChange={(e) => setRegInstagram(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    required
                    className="input-field"
                    placeholder="Create a password (min 4 characters)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
                  Register Account &amp; Save Token &rarr;
                </button>
              </form>
            )}

            {/* TAB: ADMIN LOGIN */}
            {tab === 'admin' && (
              <form onSubmit={handleLoginSubmit}>
                <div style={{ background: 'var(--bg-surface)', padding: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: 18, fontSize: '0.84rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--crimson)', marginBottom: 4 }}>Default Admin Credentials:</div>
                  <div>Email: <code>admin@thechaseclub.in</code></div>
                  <div>Password: <code>chaseadmin2026</code></div>
                </div>

                <div className="form-group">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Admin Password</label>
                  <input
                    type="password"
                    required
                    className="input-field"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
                  <Shield size={16} />
                  <span>Authenticate Admin Portal &rarr;</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
