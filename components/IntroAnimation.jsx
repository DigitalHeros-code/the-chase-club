'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, ArrowRight } from 'lucide-react';

export default function IntroAnimation({ onFinish }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Keep a ref to onFinish so parent re-renders NEVER reset our timers
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => setStage(3), 2400);
    const t4 = setTimeout(() => setStage(4), 3500);
    const t5 = setTimeout(() => {
      if (onFinishRef.current) {
        onFinishRef.current();
      }
    }, 5000);

    // Progress bar animates smoothly from 0 → 100% over 5.0 seconds
    const DURATION = 5000;
    const startTime = performance.now();
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      setProgress(pct);
      if (elapsed < DURATION) {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []); // Empty deps: executes only once on mount without being reset by re-renders

  const handleSkip = () => {
    if (onFinishRef.current) {
      onFinishRef.current();
    }
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
          <button onClick={handleSkip} className="intro-btn-primary">
            <span>Enter Portal &rarr;</span>
            <ArrowRight size={16} />
          </button>
          <button onClick={handleSkip} className="intro-btn-ghost">
            <span>Skip (5s)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
