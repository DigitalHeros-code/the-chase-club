'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Palette, Shield, User, LogOut, Menu, X, Calendar, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenRegister }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-navbar">
      <div className="container nav-flex">
        {/* Brand with Clear Large Logo */}
        <Link href="/" className="nav-brand">
          <div className="brand-logo-large">
            <img src="/assets/chase-club-logo.jpg" alt="The Chase Club Logo" />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">THE CHASE CLUB</span>
            <span className="brand-city">DELHI &bull; CREW</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-menu-desktop">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/events" className={`nav-link ${pathname === '/events' ? 'active' : ''}`}>
            <Calendar size={15} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} />
            Discover Events
          </Link>
          <Link href="/#community" className="nav-link">
            Community
          </Link>
          
          {/* Admin link visible if admin */}
          {isAdmin && (
            <Link href="/admin" className={`nav-link admin-pill ${pathname === '/admin' ? 'active' : ''}`}>
              <Shield size={14} /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Tools & Auth */}
        <div className="nav-tools-desktop">
          {/* Theme Switcher Button */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={`Current: ${theme === 'logo' ? 'Logo Shades (Warm Paper & Rust)' : 'Obsidian Night Mode'}. Click to toggle.`}
          >
            <Palette size={16} />
            <span>{theme === 'logo' ? 'Logo Shades' : 'Night Mode'}</span>
          </button>

          {/* Auth Button or User Badge */}
          {user ? (
            <div className="user-dropdown">
              <div className="user-badge">
                <User size={14} />
                <span>{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && <span className="admin-tag">ADMIN</span>}
              </div>
              <button onClick={logout} className="logout-btn" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-secondary btn-sm">
              Sign In
            </Link>
          )}

          <button 
            onClick={onOpenRegister} 
            className="btn btn-primary btn-sm"
          >
            <Sparkles size={14} />
            <span>Join Next Run</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-hamburger" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
            Home
          </Link>
          <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
            Discover Events
          </Link>
          <Link href="/#community" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
            Community
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
            Admin Portal
          </Link>

          <div className="mobile-drawer-bottom">
            <button onClick={toggleTheme} className="theme-toggle-btn" style={{ width: '100%', justifyContent: 'center' }}>
              <Palette size={16} />
              <span>Toggle Theme ({theme === 'logo' ? 'Logo Shades' : 'Night Mode'})</span>
            </button>

            {user ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Hi, {user.name}</span>
                <button onClick={logout} className="btn btn-secondary btn-sm">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)} 
                className="btn btn-secondary btn-sm" 
                style={{ width: '100%', textAlign: 'center', marginTop: 10 }}
              >
                Member / Admin Login
              </Link>
            )}

            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }} 
              className="btn btn-primary btn-sm" 
              style={{ width: '100%', marginTop: 10 }}
            >
              Join The Next Run
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
