'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import {
  Shield, Plus, Trash2, RefreshCw, Calendar, MapPin, Clock, Users,
  LogOut, AlertTriangle, CheckCircle2, X, Eye
} from 'lucide-react';

export default function AdminPage() {
  const { user, logout, loading } = useAuth();
  const { events, addEvent, removeEvent, removeAllEvents, resetDefaultEvents, registrations } = useEvents();
  const router = useRouter();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '', dateDay: '', dateMonth: 'Sep', time: '', location: '',
    distance: '', category: 'Sunday Long Run', status: 'upcoming', description: '', pacers: ''
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <Shield size={40} color="var(--crimson)" />
        <p style={{ color: 'var(--text-muted)' }}>Checking admin credentials...</p>
      </div>
    );
  }

  const handleAddEvent = (e) => {
    e.preventDefault();
    const pacersArray = newEvent.pacers ? newEvent.pacers.split(',').map(p => p.trim()).filter(Boolean) : [];
    addEvent({ ...newEvent, pacers: pacersArray });
    setNewEvent({ title: '', dateDay: '', dateMonth: 'Sep', time: '', location: '', distance: '', category: 'Sunday Long Run', status: 'upcoming', description: '', pacers: '' });
    setShowAddForm(false);
    flash('Event posted successfully!');
  };

  const handleRemoveEvent = (id, title) => {
    if (window.confirm(`Remove "${title}"?`)) {
      removeEvent(id);
      flash('Event removed.');
    }
  };

  const handleClearAll = () => {
    if (confirmClearAll) {
      removeAllEvents();
      setConfirmClearAll(false);
      flash('All events cleared.');
    } else {
      setConfirmClearAll(true);
    }
  };

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const CATEGORIES = ['Sunday Long Run', 'Track & Intervals', 'Official Race', 'Recovery & Mobility', 'Special Event'];

  return (
    <>
      <Navbar />
      <main style={{ padding: '40px 0 80px' }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Shield size={22} color="var(--crimson)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--crimson)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Portal</span>
              </div>
              <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Event Control Centre</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Logged in as <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong></p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => setShowRegistrations(!showRegistrations)} className="btn btn-secondary btn-sm">
                <Eye size={14} /><span>Registrations ({registrations.length})</span>
              </button>
              <button onClick={() => { logout(); router.push('/'); }} className="btn btn-secondary btn-sm">
                <LogOut size={14} /><span>Sign Out</span>
              </button>
            </div>
          </div>

          {successMsg && (
            <div style={{ background: 'rgba(204,255,0,0.15)', border: '1px solid var(--volt)', color: 'var(--volt)', padding: '12px 18px', borderRadius: 'var(--radius-sm)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
              <CheckCircle2 size={16} />{successMsg}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary btn-sm">
              <Plus size={14} /><span>{showAddForm ? 'Cancel' : 'Post New Event'}</span>
            </button>
            <button onClick={() => { resetDefaultEvents(); flash('Default events restored!'); }} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} /><span>Restore Defaults</span>
            </button>
            <button onClick={handleClearAll} className="btn btn-secondary btn-sm"
              style={{ marginLeft: 'auto', borderColor: confirmClearAll ? 'var(--crimson)' : undefined, color: confirmClearAll ? 'var(--crimson)' : undefined }}>
              <AlertTriangle size={14} /><span>{confirmClearAll ? 'Click Again to Confirm Clear All' : 'Clear All Events'}</span>
            </button>
          </div>

          {showAddForm && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 28 }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={18} color="var(--crimson)" />Post New Event
              </h2>
              <form onSubmit={handleAddEvent}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Event Title *</label>
                    <input type="text" required className="input-field" placeholder="e.g. Sunday Long Run — Lodhi Garden Loop" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Day *</label>
                    <input type="number" required min="1" max="31" className="input-field" placeholder="21" value={newEvent.dateDay} onChange={e => setNewEvent({ ...newEvent, dateDay: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Month *</label>
                    <select className="input-field" value={newEvent.dateMonth} onChange={e => setNewEvent({ ...newEvent, dateMonth: e.target.value })}>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input type="text" required className="input-field" placeholder="Sun, 5:45 AM" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select className="input-field" value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location *</label>
                    <input type="text" required className="input-field" placeholder="Lodhi Garden Gate 2, Delhi" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Distance / Format *</label>
                    <input type="text" required className="input-field" placeholder="10K & 5K" value={newEvent.distance} onChange={e => setNewEvent({ ...newEvent, distance: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select className="input-field" value={newEvent.status} onChange={e => setNewEvent({ ...newEvent, status: e.target.value })}>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing Series</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Description *</label>
                    <textarea required className="input-field" rows={3} placeholder="Brief description..." value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Pace Groups / Tags (comma-separated)</label>
                    <input type="text" className="input-field" placeholder="4:45/km, 5:30/km, 6:15/km" value={newEvent.pacers} onChange={e => setNewEvent({ ...newEvent, pacers: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary"><Plus size={15} /><span>Post Event</span></button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {showRegistrations && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: '1.2rem' }}>Runner Registrations ({registrations.length})</h2>
                <button onClick={() => setShowRegistrations(false)}><X size={18} color="var(--text-muted)" /></button>
              </div>
              {registrations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No registrations yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                        {['Name','Email','Mobile','Instagram','Pace','Event'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg, i) => (
                        <tr key={reg.id || i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>{reg.firstName} {reg.lastName}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{reg.email}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{reg.mobile}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--crimson)' }}>{reg.instagram}</td>
                          <td style={{ padding: '10px 12px' }}><span style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem' }}>{reg.pace}</span></td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{reg.selectedEvent || 'General Roster'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.2rem' }}>Active Events
                <span style={{ marginLeft: 10, fontSize: '0.88rem', fontWeight: 600, color: 'var(--crimson)', background: 'var(--crimson-glow)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>{events.length}</span>
              </h2>
            </div>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <Calendar size={36} color="var(--crimson)" style={{ margin: '0 auto 16px' }} />
                <h3>No Events Posted</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Post a new event or restore the default schedule.</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Post Event</button>
                  <button onClick={() => { resetDefaultEvents(); flash('Defaults restored!'); }} className="btn btn-secondary btn-sm"><RefreshCw size={14} /> Restore</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {events.map(evt => (
                  <div key={evt.id} style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 22px' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                      <div style={{ minWidth: 52, textAlign: 'center', background: 'var(--crimson-glow)', border: '1px solid var(--crimson)', borderRadius: 8, padding: '6px 4px' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--crimson)', lineHeight: 1 }}>{evt.dateDay}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--crimson)', letterSpacing: '0.05em' }}>{evt.dateMonth}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{evt.title}</h3>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', background: evt.status === 'ongoing' ? 'rgba(204,255,0,0.15)' : 'var(--crimson-glow)', color: evt.status === 'ongoing' ? 'var(--volt)' : 'var(--crimson)', border: `1px solid ${evt.status === 'ongoing' ? 'var(--volt)' : 'var(--crimson)'}`, padding: '2px 8px', borderRadius: 4 }}>
                            {evt.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12} color="var(--crimson)" />{evt.time}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12} color="var(--crimson)" />{evt.location}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={12} color="var(--crimson)" />{evt.distance}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveEvent(evt.id, evt.title)} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--crimson)', color: 'var(--crimson)', flexShrink: 0 }} title="Remove this event">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Link href="/" className="btn btn-secondary btn-sm">Back to Website</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
