'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RegisterModal from '../../components/RegisterModal';
import { useEvents } from '../../context/EventContext';
import { Search, Calendar, MapPin, Clock, Users, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function DiscoverEventsPage() {
  const { events } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState('');

  const handleOpenRegister = (eventTitle = '') => {
    setSelectedEventName(eventTitle);
    setRegisterModalOpen(true);
  };

  // Filter events based on search query and category
  const filteredEvents = events.filter(evt => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      evt.title?.toLowerCase().includes(q) || 
      evt.location?.toLowerCase().includes(q) ||
      evt.distance?.toLowerCase().includes(q) ||
      evt.category?.toLowerCase().includes(q);

    const matchesCategory = activeCategory === 'all' || 
      evt.category?.toLowerCase().includes(activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar onOpenRegister={() => handleOpenRegister()} />

      <main style={{ paddingBottom: 80 }}>
        {/* HERO */}
        <section style={{ padding: '60px 0 30px', textAlign: 'center' }}>
          <div className="container">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--crimson)', display: 'block', marginBottom: 10 }}>
              &bull; Official Schedule &bull;
            </span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', marginBottom: 14 }}>
              Discover Club Runs &amp; Races
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 640, margin: '0 auto 36px' }}>
              Explore upcoming weekly dawn loops, track intervals, official Delhi race meetups, and recovery shakeouts.
            </p>

            {/* SEARCH & FILTERS */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 22, maxWidth: 840, margin: '0 auto', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ position: 'relative', marginBottom: 18 }}>
                <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Search by location (Lodhi, Nehru Park), distance (10K, 5K), or format..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '14px 20px 14px 44px',
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, marginRight: 4 }}>
                  Categories:
                </span>
                {[
                  { key: 'all', label: 'All Sessions' },
                  { key: 'long run', label: 'Sunday Long Runs' },
                  { key: 'track', label: 'Track & Intervals' },
                  { key: 'race', label: 'Official Races' },
                  { key: 'recovery', label: 'Recovery & Mobility' }
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: activeCategory === cat.key ? 'var(--crimson)' : 'var(--border-subtle)',
                      background: activeCategory === cat.key ? 'var(--crimson-glow)' : 'var(--bg-surface)',
                      color: activeCategory === cat.key ? 'var(--text-main)' : 'var(--text-muted)',
                      fontWeight: activeCategory === cat.key ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EVENTS GRID */}
        <section>
          <div className="container">
            {filteredEvents.length > 0 ? (
              <div className="events-cards-grid">
                {filteredEvents.map(evt => (
                  <div key={evt.id} className="event-box">
                    <div>
                      <div className="event-top-meta">
                        <div className="event-date-pill">
                          <div className="day">{evt.dateDay || '21'}</div>
                          <div className="mon">{evt.dateMonth || 'SEP'}</div>
                        </div>
                        <span className="event-status-tag">{evt.category || 'Run'}</span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>{evt.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 16 }}>
                        {evt.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.86rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 0', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Clock size={15} color="var(--crimson)" />
                          <span>{evt.time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <MapPin size={15} color="var(--crimson)" />
                          <span>{evt.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Users size={15} color="var(--crimson)" />
                          <span>{evt.distance}</span>
                        </div>

                        {evt.pacers && (
                          <div style={{ marginTop: 4 }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4 }}>Paced Bands:</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {evt.pacers.map((p, idx) => (
                                <span key={idx} style={{ fontSize: '0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '2px 8px', borderRadius: 4 }}>
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                        &bull; Free Community Entry
                      </span>
                      <button 
                        onClick={() => handleOpenRegister(evt.title)}
                        className="btn btn-primary btn-sm"
                      >
                        Register &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxWidth: 600, margin: '40px auto' }}>
                <Calendar size={40} color="var(--crimson)" style={{ margin: '0 auto 16px' }} />
                <h3>No Matching Events Found</h3>
                <p style={{ color: 'var(--text-muted)', margin: '10px auto 24px' }}>
                  {searchQuery ? `No sessions match "${searchQuery}". Try clearing filters.` : 'All events have been cleared by the admin.'}
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="btn btn-secondary btn-sm">
                      Reset Filters
                    </button>
                  )}
                  <button onClick={() => handleOpenRegister('General Crew Roster')} className="btn btn-primary btn-sm">
                    Register For Crew Roster
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        preselectedEvent={selectedEventName}
      />
    </>
  );
}
