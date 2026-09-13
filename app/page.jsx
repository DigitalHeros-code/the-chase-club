'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterModal from '../components/RegisterModal';
import IntroAnimation from '../components/IntroAnimation';
import LoginPortal from '../components/LoginPortal';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Calendar, MapPin, Clock, Users, Zap, Shield, Play, CheckCircle2, Sparkles, LogOut } from 'lucide-react';

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLoginPortal, setShowLoginPortal] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState('');
  const { events } = useEvents();
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  // On initial mount: if intro was seen in this session, skip intro
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('chase_intro_seen');
    if (hasSeenIntro === 'true') {
      setShowIntro(false);
    }
  }, []);

  // When 5s intro animation finishes:
  // Show login portal if user is not already authenticated
  const handleFinishIntro = () => {
    setShowIntro(false);
    sessionStorage.setItem('chase_intro_seen', 'true');
    if (!user) {
      setShowLoginPortal(true);
    }
  };

  const handleLoginComplete = (authenticatedUser) => {
    setShowLoginPortal(false);
    if (authenticatedUser?.role === 'admin') {
      router.push('/admin');
    }
  };

  const handleOpenRegister = (eventTitle = '') => {
    setSelectedEventName(eventTitle);
    setRegisterModalOpen(true);
  };

  // Real-time Countdown Timer to Sunday 5:45 AM
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextSunday = new Date();
      const dayOfWeek = now.getDay();
      let daysUntil = (7 - dayOfWeek) % 7;
      
      const runTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 45, 0);
      if (dayOfWeek === 0 && now > runTimeToday) {
        daysUntil = 7;
      } else if (dayOfWeek === 0 && now <= runTimeToday) {
        daysUntil = 0;
      }

      nextSunday.setDate(now.getDate() + daysUntil);
      nextSunday.setHours(5, 45, 0, 0);

      const diff = nextSunday.getTime() - now.getTime();
      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({
          days: String(d).padStart(2, '0'),
          hours: String(h).padStart(2, '0'),
          mins: String(m).padStart(2, '0'),
          secs: String(s).padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. Exactly 5-Second Intro Animation */}
      {showIntro && <IntroAnimation onFinish={handleFinishIntro} />}

      {/* 2. Login Portal (Appears immediately after 5s animation if not logged in) */}
      {showLoginPortal && (
        <LoginPortal
          onComplete={handleLoginComplete}
          onCancel={() => setShowLoginPortal(false)}
        />
      )}

      {/* 3. Sticky Admin Control Bar (if logged in as admin) */}
      {isAdmin && (
        <div className="admin-sticky-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={16} color="var(--crimson)" />
            <span style={{ fontWeight: 600 }}>
              Logged in as <strong>{user?.name || 'Club Admin'}</strong> &bull; Events you create/delete here sync live for all runners.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/admin" className="btn btn-primary btn-sm" style={{ padding: '5px 14px', fontSize: '0.78rem' }}>
              <Shield size={13} />
              <span>Open Event Control Centre &rarr;</span>
            </Link>
            <button onClick={logout} className="btn btn-secondary btn-sm" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <Navbar
        onOpenRegister={() => handleOpenRegister()}
        onOpenLogin={() => setShowLoginPortal(true)}
      />

      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="container hero-layout">
            <div>
              <div className="hero-pill">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--crimson)' }}></span>
                <span>NEXT RUN &bull; SUNDAY 5:45 AM &bull; LODHI GARDEN</span>
              </div>

              {/* User greeting if authenticated */}
              {user && (
                <div style={{ marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}>
                  <Sparkles size={14} color="var(--volt)" />
                  <span>Welcome back, <strong>{user.name}</strong> ({user.role === 'admin' ? 'Admin' : 'Runner'})</span>
                </div>
              )}

              <h1 className="hero-title">
                WE CHASE <span style={{ color: 'var(--crimson)' }}>PACE</span>,<br />NOT PERFECTION.
              </h1>

              <p className="hero-subtitle">
                The Chase Club is Delhi’s community-driven running and fitness crew. We wake up before sunrise, run honest paces together, and share breakfast chai afterwards.
              </p>

              {/* Dynamic Countdown */}
              <div className="countdown-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span>Next Group Run Countdown</span>
                  <span style={{ color: 'var(--crimson)' }}>Active Timer</span>
                </div>
                <div className="countdown-digits">
                  <div className="countdown-tile">
                    <div className="countdown-num">{timeLeft.days}</div>
                    <div className="countdown-lbl">Days</div>
                  </div>
                  <div className="countdown-tile">
                    <div className="countdown-num">{timeLeft.hours}</div>
                    <div className="countdown-lbl">Hours</div>
                  </div>
                  <div className="countdown-tile">
                    <div className="countdown-num">{timeLeft.mins}</div>
                    <div className="countdown-lbl">Mins</div>
                  </div>
                  <div className="countdown-tile">
                    <div className="countdown-num">{timeLeft.secs}</div>
                    <div className="countdown-lbl">Secs</div>
                  </div>
                </div>
              </div>

              <div className="hero-ctas">
                <button onClick={() => handleOpenRegister()} className="btn btn-primary">
                  <span>Register For Next Run</span>
                  <ArrowRight size={16} />
                </button>
                <Link href="/events" className="btn btn-secondary">
                  <span>View All Sessions</span>
                </Link>
                {isAdmin ? (
                  <Link href="/admin" className="btn btn-secondary" style={{ borderColor: 'var(--crimson)', color: 'var(--crimson)' }}>
                    <Shield size={14} />
                    <span>Manage Events</span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => setShowLoginPortal(true)} 
                    className="btn btn-secondary"
                  >
                    <span>{user ? 'My Profile' : 'Admin / Member Login'}</span>
                  </button>
                )}
                <button 
                  onClick={() => setShowIntro(true)} 
                  className="btn btn-secondary" 
                  title="Replay 5s intro animation"
                >
                  <Play size={14} />
                  <span>Replay Intro</span>
                </button>
              </div>

              <div className="hero-stats-row">
                <div className="stat-item">
                  <div className="num">240+</div>
                  <div className="lbl">Active Runners</div>
                </div>
                <div className="stat-item">
                  <div className="num">{events.length}</div>
                  <div className="lbl">Live Sessions</div>
                </div>
                <div className="stat-item">
                  <div className="num">100%</div>
                  <div className="lbl">Free Community</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div>
              <div className="hero-img-card">
                <img src="/assets/chase_hero_run.jpg" alt="The Chase Club Runners in Delhi" />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)', color: '#fff' }}>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Lodhi Gardens Sunrise &bull; Delhi
                  </span>
                  <p style={{ marginTop: 8, fontSize: '0.92rem', opacity: 0.9 }}>
                    All paces welcomed &bull; Pacers for 4:45, 5:30, 6:15, and run-walk intervals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UPCOMING & ONGOING EVENTS SECTION */}
        <section className="section-padding" style={{ background: 'var(--bg-surface)' }}>
          <div className="container">
            <div className="section-head-flex">
              <div>
                <span className="section-eyebrow">Paced Sessions &amp; Races</span>
                <h2 className="section-title">Upcoming &amp; Ongoing Events</h2>
                <p className="section-sub">
                  Posted live by Club Admin. Every run is free to attend with dedicated pacers, bag drop points, and post-run breakfast.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {isAdmin && (
                  <Link href="/admin" className="btn btn-primary">
                    <Shield size={15} />
                    <span>+ Post Event as Admin</span>
                  </Link>
                )}
                <Link href="/events" className="btn btn-secondary">
                  <span>Discover All Sessions &rarr;</span>
                </Link>
              </div>
            </div>

            {events.length > 0 ? (
              <div className="events-cards-grid">
                {events.map((evt) => (
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

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Clock size={14} color="var(--crimson)" />
                          <span>{evt.time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <MapPin size={14} color="var(--crimson)" />
                          <span>{evt.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Users size={14} color="var(--crimson)" />
                          <span>{evt.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                        {evt.status === 'ongoing' ? '● Ongoing Series' : '● Upcoming'}
                      </span>
                      <button 
                        onClick={() => handleOpenRegister(evt.title)}
                        className="btn btn-primary btn-sm"
                      >
                        RSVP &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <Calendar size={36} color="var(--crimson)" style={{ margin: '0 auto 12px' }} />
                <h3>No Events Currently Posted</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: 420, margin: '8px auto 20px' }}>
                  The admin has cleared current events. Check back soon or sign in as Admin to post new sessions!
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button onClick={() => handleOpenRegister('General Crew Roster')} className="btn btn-primary btn-sm">
                    Join Runner Roster
                  </button>
                  <Link href="/admin" className="btn btn-secondary btn-sm">
                    Admin Portal &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BENTO COMMUNITY GALLERY */}
        <section className="section-padding" id="community">
          <div className="container">
            <div className="section-head-flex">
              <div>
                <span className="section-eyebrow">Delhi Morning Culture</span>
                <h2 className="section-title">The Dawn Community</h2>
                <p className="section-sub">
                  Running together at dawn, training on the track, and talking over chai in Lodhi Colony.
                </p>
              </div>
            </div>

            <div className="bento-layout">
              <div className="bento-photo tall">
                <img src="/assets/chase_hero_run.jpg" alt="Lodhi Garden Loop" />
                <div className="bento-text">
                  <span style={{ color: '#CCFF00', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Sunday Long Run
                  </span>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Lodhi Garden Sunrise Loop &bull; 80+ Runners</h4>
                </div>
              </div>

              <div className="bento-photo">
                <img src="/assets/track_speedwork.jpg" alt="Track Speedwork" />
                <div className="bento-text">
                  <span style={{ color: '#CCFF00', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Speedwork Tuesdays
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Yamuna Sports Track Repeats</h4>
                </div>
              </div>

              <div className="bento-photo">
                <img src="/assets/post_run_chai.jpg" alt="Post Run Chai Culture" />
                <div className="bento-text">
                  <span style={{ color: '#CCFF00', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Community Ritual
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Artisanal Chai &amp; Breakfast</h4>
                </div>
              </div>

              <div className="bento-photo" style={{ gridColumn: 'span 2' }}>
                <img src="/assets/runner_focus.jpg" alt="Runner Focus & Preparation" />
                <div className="bento-text">
                  <span style={{ color: '#CCFF00', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Pacing &amp; Discipline
                  </span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Marathon &amp; Half-Marathon Training Programs</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section-padding" style={{ background: 'var(--bg-surface)' }}>
          <div className="container">
            <div className="section-head-flex">
              <div>
                <span className="section-eyebrow">Zero Friction</span>
                <h2 className="section-title">How It Works</h2>
                <p className="section-sub">
                  Three simple steps between you and your first club run.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              <div className="event-box" style={{ padding: 32 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--crimson)', marginBottom: 12 }}>
                  01
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Register Your Runner Profile</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Enter your name, WhatsApp number, Instagram handle, pace band, and sign the runner safety consent.
                </p>
              </div>

              <div className="event-box" style={{ padding: 32 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--crimson)', marginBottom: 12 }}>
                  02
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Get Added To Crew WhatsApp</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Receive live GPS routes, gate meet points, pacer assignments, and weather briefings every week.
                </p>
              </div>

              <div className="event-box" style={{ padding: 32 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--crimson)', marginBottom: 12 }}>
                  03
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Show Up At Dawn &amp; Run</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Turn up at the meet gate. Someone will run your exact pace — that’s the club promise.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* REGISTRATION MODAL */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        preselectedEvent={selectedEventName}
      />
    </>
  );
}
