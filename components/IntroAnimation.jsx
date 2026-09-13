'use client';

import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight } from 'lucide-react';

export default function IntroAnimation({ onFinish }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Total animation: exactly 5.0 seconds
  // Stage 0 -> blank
  // Stage 1 -> logo pulses in         (500ms)
  // Stage 2 -> brand name slides up   (1400ms)
  // Stage 3 -> slogan fades in        (2600ms)
  // Stage 4 -> actions appear         (3700ms)
  // Finish -> transition to portal    (5000ms)

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => setStage(3), 2600);
    const t4 = setTimeout(() => setStage(4), 3700);
    const t5 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 5000);

    // Progress bar animates from 0 → 100 over 5.0s
    let start = null;
    const DURATION = 5000;
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
  }, [onFinish]);

  const handleSkipOrLogin = () => {
    if (onFinish) onFinish();
  };

  return (
    <div className="intro-overlay">
      <div className="intro-bg-ambient"></div>

      <div className="intro-card">

        {/* LARGE PROMINENT LOGO (220px) WITH DUAL PULSING RINGS */}
        <div className={`intro-logo-container ${stage >= 1 ? 'stage-active' : ''}`}>
          <div className="intro-logo-ring"></div>
          <div className="intro-logo-ring intro-logo-ring-2"></div>
          <div className="intro-logo-box">
            <img src="/assets/chase-club-logo.jpg" alt="The Chase Club Logo" />
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

        {/* 5-Second Progress Bar */}
        <div
          className={`intro-progress-track ${stage >= 1 ? 'stage-active' : ''}`}
          style={{ opacity: stage >= 1 ? 1 : 0, transition: 'opacity 0.4s' }}
        >
          <div
            className="intro-progress-fill"
            style={{ width: `${progress}%`, transition: 'none' }}
          ></div>
        </div>

        {/* CTA Buttons */}
        <div className={`intro-actions ${stage >= 4 ? 'stage-active' : ''}`}>
          <button onClick={handleSkipOrLogin} className="intro-btn-primary">
            <span>Login &amp; Enter Portal</span>
            <ArrowRight size={16} />
          </button>
          <button onClick={handleSkipOrLogin} className="intro-btn-ghost">
            <span>Skip (5s) &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
