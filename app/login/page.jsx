'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoginPortal from '../../components/LoginPortal';

export default function LoginPage() {
  const router = useRouter();

  const handleComplete = (user) => {
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: 500 }}>
          <LoginPortal onComplete={handleComplete} onCancel={handleCancel} />
        </div>
      </main>
      <Footer />
    </>
  );
}
