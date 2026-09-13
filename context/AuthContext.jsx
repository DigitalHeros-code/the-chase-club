'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('chase_auth_token');
    const savedUser = localStorage.getItem('chase_user_profile');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Admin check
    if (email === 'admin@thechaseclub.in' && password === 'chaseadmin2026') {
      const adminToken = 'chase_admin_token_' + Date.now();
      const adminProfile = {
        name: 'Chase Club Admin',
        email: 'admin@thechaseclub.in',
        role: 'admin',
        instagram: '@thechaseclub'
      };
      setToken(adminToken);
      setUser(adminProfile);
      localStorage.setItem('chase_auth_token', adminToken);
      localStorage.setItem('chase_user_profile', JSON.stringify(adminProfile));
      return { success: true, user: adminProfile };
    }

    // Member check (or accept registered members)
    const existingMembers = JSON.parse(localStorage.getItem('chase_registered_users') || '[]');
    const found = existingMembers.find(m => m.email.toLowerCase() === email.toLowerCase() && m.password === password);
    
    if (found) {
      const userToken = 'chase_member_token_' + Date.now();
      const userProfile = {
        name: found.name,
        email: found.email,
        role: 'member',
        instagram: found.instagram || '@runner',
        phone: found.phone || ''
      };
      setToken(userToken);
      setUser(userProfile);
      localStorage.setItem('chase_auth_token', userToken);
      localStorage.setItem('chase_user_profile', JSON.stringify(userProfile));
      return { success: true, user: userProfile };
    }

    // Default demo member login if password meets criteria
    if (password.length >= 4) {
      const userToken = 'chase_member_token_' + Date.now();
      const userProfile = {
        name: email.split('@')[0],
        email: email,
        role: 'member',
        instagram: '@' + email.split('@')[0],
        phone: '+91 98765 43210'
      };
      setToken(userToken);
      setUser(userProfile);
      localStorage.setItem('chase_auth_token', userToken);
      localStorage.setItem('chase_user_profile', JSON.stringify(userProfile));
      return { success: true, user: userProfile };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const register = (name, email, password, instagram, phone) => {
    const existingMembers = JSON.parse(localStorage.getItem('chase_registered_users') || '[]');
    if (existingMembers.some(m => m.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'User with this email already exists.' };
    }

    const newMember = { name, email, password, instagram, phone, joinedAt: new Date().toISOString() };
    existingMembers.push(newMember);
    localStorage.setItem('chase_registered_users', JSON.stringify(existingMembers));

    const userToken = 'chase_member_token_' + Date.now();
    const userProfile = {
      name,
      email,
      role: 'member',
      instagram,
      phone
    };
    setToken(userToken);
    setUser(userProfile);
    localStorage.setItem('chase_auth_token', userToken);
    localStorage.setItem('chase_user_profile', JSON.stringify(userProfile));
    return { success: true, user: userProfile };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('chase_auth_token');
    localStorage.removeItem('chase_user_profile');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
