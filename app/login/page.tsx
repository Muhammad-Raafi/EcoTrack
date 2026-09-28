'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk mata
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.error || 'Email atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f7fc',
        padding: '20px',
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px 35px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: '420px',
          borderTop: '6px solid #1e3a5f',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              backgroundColor: '#1e3a5f',
              color: 'white',
              padding: '14px 20px',
              borderRadius: '10px',
              marginBottom: '10px',
            }}
          >
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>
              🌱 EcoTrack
            </h1>
          </div>
          <p style={{ color: '#555', fontSize: '15px', fontWeight: 500, margin: '10px 0 0' }}>
            Masuk ke akun Anda
          </p>
        </div>

        {error && (
          <div
            style={{
              color: '#e74c3c',
              fontSize: '14px',
              marginBottom: '16px',
              backgroundColor: '#fde8e8',
              padding: '10px 14px',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px', fontSize: '14px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@sekolah.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid #dde1e6',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1e3a5f',
                backgroundColor: '#f9faff',
                outline: 'none',
                transition: 'border 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0070f3')}
              onBlur={(e) => (e.target.style.borderColor = '#dde1e6')}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px', fontSize: '14px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  paddingRight: '45px', // Kasih ruang di kanan untuk icon mata
                  border: '2px solid #dde1e6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1e3a5f',
                  backgroundColor: '#f9faff',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0070f3')}
                onBlur={(e) => (e.target.style.borderColor = '#dde1e6')}
              />
              
              {/* BUTTON ICON MATA */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? (
                  // Icon Mata Terbuka (Lihat Password)
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#1e3a5f"/>
                  </svg>
                ) : (
                  // Icon Mata Tertutup (Sembunyikan Password)
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#1e3a5f" opacity="0.4"/>
                    <line x1="3" y1="3" x2="21" y2="21" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              backgroundColor: '#1e3a5f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2c4f7a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e3a5f')}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#888' }}>
          Belum punya akun?{' '}
          <Link href="/register" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 500 }}>
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}