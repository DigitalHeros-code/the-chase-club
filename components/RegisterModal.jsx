'use client';

import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegisterModal({ isOpen, onClose, preselectedEvent }) {
  const { events, registerForEvent } = useEvents();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    instagram: '',
    pace: '5:00–6:00 min/km',
    selectedEvent: '',
    consentSigned: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Prefill if user is logged in
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: user.email || '',
        instagram: user.instagram || '',
        mobile: user.phone || ''
      }));
    }
  }, [user]);

  // Set preselected event if provided
  useEffect(() => {
    if (preselectedEvent) {
      setFormData(prev => ({ ...prev, selectedEvent: preselectedEvent }));
    } else if (events.length > 0 && !formData.selectedEvent) {
      setFormData(prev => ({ ...prev, selectedEvent: events[0].title }));
    }
  }, [preselectedEvent, events]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consentSigned) {
      setError('You must accept the runner liability consent agreement to register.');
      return;
    }

    try {
      registerForEvent(formData);
      setSubmitted(true);
      setError('');
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="modal-close-btn" aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div className="modal-header">
              <span className="badge-accent">The Chase Club Delhi</span>
              <h2 className="modal-title">Join The Next Club Run</h2>
              <p className="modal-subtitle">
                Complete your runner registration. No fees — just show up and run your pace.
              </p>
            </div>

            {error && <div className="form-error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="register-form">
              {/* Name fields */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    className="input-field"
                    placeholder="e.g. Ankit"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    className="input-field"
                    placeholder="e.g. Sharma"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* Mobile & Email */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    id="mobile"
                    required
                    className="input-field"
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="input-field"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Instagram Handle */}
              <div className="form-group">
                <label htmlFor="instagram">Instagram ID (Handle) *</label>
                <input
                  type="text"
                  id="instagram"
                  required
                  className="input-field"
                  placeholder="@yourhandle"
                  value={formData.instagram}
                  onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                />
              </div>

              {/* Running Pace Radio Pills */}
              <div className="form-group">
                <label>Your Typical Running Pace *</label>
                <div className="pace-grid">
                  {[
                    '< 5:00 min/km',
                    '5:00–6:00 min/km',
                    '6:00–7:00 min/km',
                    'Beginner / Walk-Run'
                  ].map(p => (
                    <label key={p} className={`pace-pill-item ${formData.pace === p ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="pace"
                        value={p}
                        checked={formData.pace === p}
                        onChange={() => setFormData({ ...formData, pace: p })}
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Select Next Event To Attend */}
              <div className="form-group">
                <label htmlFor="selectedEvent">Select Next Event To Attend *</label>
                {events.length > 0 ? (
                  <select
                    id="selectedEvent"
                    className="input-field"
                    value={formData.selectedEvent}
                    onChange={e => setFormData({ ...formData, selectedEvent: e.target.value })}
                  >
                    {events.map(evt => (
                      <option key={evt.id} value={evt.title}>
                        {evt.title} ({evt.dateDay} {evt.dateMonth})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No events currently posted. You will be registered for the general crew roster!
                  </div>
                )}
              </div>

              {/* Liability Consent Form Agreement */}
              <div className="consent-box">
                <label className="consent-checkbox-label">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentSigned}
                    onChange={e => setFormData({ ...formData, consentSigned: e.target.checked })}
                  />
                  <span>
                    <strong>Runner Liability &amp; Safety Consent:</strong> I agree and acknowledge that I am voluntarily participating in club sessions. I understand that The Chase Club, its organizers, and pacers are <em>not responsible or liable if anything happens to you</em> (including physical injuries, accidents, lost belongings, or health complications) during or traveling to/from any run.
                  </span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                <Sparkles size={16} />
                <span>Confirm Registration &amp; RSVP</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="success-state">
            <div className="success-icon-circle">
              <CheckCircle2 size={42} />
            </div>
            <h2>You&apos;re On The List!</h2>
            <p className="success-message">
              Welcome to the crew, <strong>{formData.firstName}</strong>! You are officially registered for{' '}
              <strong>{formData.selectedEvent || 'The Chase Club Delhi Sessions'}</strong>.
            </p>

            <div className="success-ticket">
              <div className="ticket-row"><span>Pace Group:</span><strong>{formData.pace}</strong></div>
              <div className="ticket-row"><span>WhatsApp:</span><strong>{formData.mobile}</strong></div>
              <div className="ticket-row"><span>Instagram:</span><strong>{formData.instagram}</strong></div>
              <div className="ticket-row"><span>Consent Signed:</span><strong style={{ color: 'var(--volt)' }}>Verified &#x2713;</strong></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              <a
                href="https://chat.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Join WhatsApp Crew Chat &rarr;
              </a>
              <button onClick={handleClose} className="btn btn-secondary" style={{ width: '100%' }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
