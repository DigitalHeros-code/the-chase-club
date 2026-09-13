'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight } from 'lucide-react';

export default function IntroAnimation({ onFinish }) {
  const [stage, setStage] = useState(0);
  // progress bar: 0-100
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Total animation: ~4.5 seconds
  // Stage 0 -> blank
  // Stage 1 -> logo pulses in         (500ms)
  // Stage 2 -> brand name slides up   (1400ms)
  // Stage 3 -> slogan fades in        (2600ms)
  // Stage 4 -> actions appear         (3600ms)
  // Auto-finish -> redirect /login    (4800ms)

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => setStage(3), 2600);
    const t4 = setTimeout(() => setStage(4), 3600);
    const t5 = setTimeout(() => {
      if (onFinish) onFinish();
      router.push('/login');
    }, 4800);

    // Progress bar animates from 0 → 100 over 4.8s
    let start = null;
    const DURATION = 4800;
    const animFrame = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      setProgress(Math.min(100, (elapsed / DURATION) * 100));
      if (elapsed < DURATION) requestAnimationFrame(animFrame);
    };
    const raf = requestAnimationFrame(animFrame);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5);
      cancelAnimationFrame(raf);
    };
  }, [onFinish, router]);

  const handleGoLogin = () => {
    if (onFinish) onFinish();
    router.push('/login');
  };

  const handleSkip = () => {
    if (onFinish) onFinish();
    router.push('/login');
  };

  return (
    <div className="intro-overlay">
      <div className="intro-bg-ambient"></div>

      <div className="intro-card">

        {/* LARGE LOGO */}
        <div className={`intro-logo-container ${stage >= 1 ? 'stage-active' : ''}`}>
          <div className="intro-logo-ring"></div>
          <div className="intro-logo-ring intro-logo-ring-2"></div>
          <div className="intro-logo-box">
            <img src="/assets/chase-club-logo.jpg" alt="The Chase Club" />
          </div>
        </div>

        {/* Brand Name */}
        <div className={`intro-typography ${stage >= 2 ? 'stage-active' : ''}`}>
          <div className="intro-eyebrow">
            <Zap size={13} className="intro-zap" />
            DELHI &bull; RUNNING CREW &bull; EST. 2026
          </div>
          <h1 className="intro-heading">THE CHASE CLUB</h1>
        </div>

        {/* Slogan */}
        <div className={`intro-slogan ${stage >= 3 ? 'stage-active' : ''}`}>
          <p className="intro-motto">&ldquo;WE CHASE PACE, NOT PERFECTION.&rdquo;</p>
        </div>

        {/* Progress bar (always visible once stage 1) */}
        <div className={`intro-progress-track ${stage >= 1 ? 'stage-active' : ''}`}
          style={{ opacity: stage >= 1 ? 1 : 0, transition: 'opacity 0.4s' }}>
          <div
            className="intro-progress-fill"
            style={{ width: `${progress}%`, transition: 'none' }}
          ></div>
        </div>

        {/* CTA Buttons */}
        <div className={`intro-actions ${stage >= 4 ? 'stage-active' : ''}`}>
          <button onClick={handleGoLogin} className="intro-btn-primary">
            <span>Login / Register</span>
            <ArrowRight size={16} />
          </button>
          <button onClick={handleSkip} className="intro-btn-ghost">
            <span>Skip &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
