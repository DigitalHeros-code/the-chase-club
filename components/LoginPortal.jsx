'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { Shield, User, Lock, Mail, Instagram, Phone, ArrowRight, CheckCircle2, Zap, AlertCircle } from 'lucide-react';

export default function LoginPortal({ onComplete, onCancel }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'admin'
  const { login, register } = useAuth();
  const { events } = useEvents();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regInstagram, setRegInstagram] = useState('');
  const [regPace, setRegPace] = useState('5:00–6:00 min/km');
  const [regEvent, setRegEvent] = useState('');
  const [regConsent, setRegConsent] = useState(false);

  // Status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAdminQuickLogin = () => {
    setError('');
    const res = login('admin@thechaseclub.in', 'chaseadmin2026');
    if (res.success) {
      setSuccess('Authenticated as Club Administrator! Entering Event Control Centre...');
      setTimeout(() => {
        if (onComplete) onComplete(res.user);
      }, 700);
    } else {
      setError('Admin authentication failed.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      setSuccess(`Welcome back, ${res.user.name}! Loading your runner hub...`);
      setTimeout(() => {
        if (onComplete) onComplete(res.user);
      }, 700);
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!regConsent) {
      setError('You must accept the safety consent to register.');
      return;
    }

    const fullName = `${regFirstName} ${regLastName}`.trim();
    const res = register(
      fullName,
      regEmail,
      regPassword,
      regInstagram,
      regMobile,
      regPace,
      regEvent
    );

    if (res.success) {
      setSuccess('Registration successful! You are now an official Chase Club member.');
      setTimeout(() => {
        if (onComplete) onComplete(res.user);
      }, 800);
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="login-portal-overlay">
      <div className="login-portal-card">

        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="brand-logo-large" style={{ width: 68, height: 68, margin: '0 auto 12px' }}>
            <img src="/assets/chase-club-logo.jpg" alt="The Chase Club" />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            THE CHASE CLUB
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Delhi&apos;s Dawn Running Crew &bull; Member &amp; Admin Access
          </p>
        </div>

        {/* ADMIN QUICK ACCESS HIGHLIGHT */}
        <div className="admin-highlight-banner">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} color="var(--crimson)" />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>Admin Access Credentials:</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <code>admin@thechaseclub.in</code> &bull; <code>chaseadmin2026</code>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAdminQuickLogin}
              className="btn btn-primary btn-sm"
              style={{ background: 'var(--crimson)', border: 'none', padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <Zap size={14} />
              <span>1-Click Admin Login &rarr;</span>
            </button>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-sm)', marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: tab === 'login' ? 'var(--crimson)' : 'transparent',
              color: tab === 'login' ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Runner Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: tab === 'register' ? 'var(--crimson)' : 'transparent',
              color: tab === 'register' ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Register As New Runner
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(204,255,0,0.15)', border: '1px solid var(--volt)', color: 'var(--volt)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* TAB 1: RUNNER SIGN IN */}
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
              <span>Sign In &amp; Access Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* TAB 2: RUNNER REGISTRATION */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: 4 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Aarav"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Sharma"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="aarav@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Mobile No. *</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="+91 98765 43210"
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Instagram ID *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="@aarav_runs"
                  value={regInstagram}
                  onChange={(e) => setRegInstagram(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="Create password (min 4 chars)"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            {/* Typical Running Pace */}
            <div className="form-group">
              <label>Your Typical Running Pace *</label>
              <div className="pace-grid-selector">
                {[
                  '< 5:00 min/km',
                  '5:00–6:00 min/km',
                  '6:00–7:00 min/km',
                  'Beginner / Walk-Run'
                ].map((paceOption) => (
                  <label
                    key={paceOption}
                    className={`pace-option-card ${regPace === paceOption ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paceGroup"
                      value={paceOption}
                      checked={regPace === paceOption}
                      onChange={() => setRegPace(paceOption)}
                    />
                    <span>{paceOption}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Next Event To Attend */}
            <div className="form-group">
              <label>Select Next Event To Attend</label>
              <select
                className="input-field"
                value={regEvent}
                onChange={(e) => setRegEvent(e.target.value)}
              >
                <option value="">-- General Roster (Any Next Session) --</option>
                {events && events.map((ev) => (
                  <option key={ev.id} value={ev.title}>
                    {ev.dateDay} {ev.dateMonth} &bull; {ev.title} ({ev.distance})
                  </option>
                ))}
              </select>
            </div>

            {/* Safety Consent Form */}
            <div className="consent-checkbox-card">
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  required
                  checked={regConsent}
                  onChange={(e) => setRegConsent(e.target.checked)}
                  style={{ marginTop: 3, accentColor: 'var(--crimson)' }}
                />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  <strong>Safety Consent &amp; Liability Waiver:</strong> I understand running outdoors involves physical exertion and risks. I affirm I am medically fit, and I agree that <em>The Chase Club, its pacers, and organizers are not responsible if anything happens to you or for any injuries, accidents, or loss during crew sessions.</em>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 14 }}>
              <span>Complete Registration &amp; Enter Crew Hub &rarr;</span>
            </button>
          </form>
        )}

        {/* Guest Continue shortcut */}
        <div style={{ textAlign: 'center', marginTop: 18, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.84rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Or browse events as guest without signing in &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}
