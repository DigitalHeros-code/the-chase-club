'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="brand-logo-frame">
                <img src="/assets/chase-club-logo.jpg" alt="The Chase Club" />
              </div>
              <span className="brand-title">THE CHASE CLUB</span>
            </div>
            <p className="footer-tagline">
              Delhi’s early morning running &amp; fitness crew. We chase pace, not perfection. Weekly sessions, race meetups, and morning coffee.
            </p>
          </div>

          <div className="footer-col">
            <h4>Club Sessions</h4>
            <ul>
              <li><Link href="/events">Sunday Long Run (10K/5K)</Link></li>
              <li><Link href="/events">Track Tuesdays (Speedwork)</Link></li>
              <li><Link href="/events">The Chase 10K Season Opener</Link></li>
              <li><Link href="/events">Recovery &amp; Mobility Shakeouts</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Portal &amp; Access</h4>
            <ul>
              <li><Link href="/events">Discover All Events</Link></li>
              <li><Link href="/login">Member Login / Register</Link></li>
              <li><Link href="/admin">Admin Dashboard</Link></li>
              <li><a href="https://chat.whatsapp.com/" target="_blank" rel="noopener">WhatsApp Community</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Locations &amp; Contact</h4>
            <ul>
              <li>Lodhi Garden Gate 2</li>
              <li>Yamuna Sports Complex</li>
              <li>Nehru Park Chanakyapuri</li>
              <li><a href="mailto:hello@thechaseclub.in">hello@thechaseclub.in</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>&copy; 2026 The Chase Club Delhi. All rights reserved.</div>
          <div>Designed for runners who show up at dawn.</div>
        </div>
      </div>
    </footer>
  );
}
