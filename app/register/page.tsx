'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: '', email: '', noHp: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // State untuk mata
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('✅ Registrasi berhasil! Silakan login.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.error || 'Registrasi gagal');
      }
    } catch {
      setError('Terjadi kesalahan');
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
            Daftar sebagai Petugas
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

        {success && (
          <div
            style={{
              color: '#065f46',
              fontSize: '14px',
              marginBottom: '16px',
              backgroundColor: '#d1fae5',
              padding: '10px 14px',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px', fontSize: '14px' }}>
              Nama
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              placeholder="Masukkan nama"
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

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px', fontSize: '14px' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="petugas@sekolah.com"
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

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px', fontSize: '14px' }}>
              No HP
            </label>
            <input
              type="text"
              name="noHp"
              value={form.noHp}
              onChange={handleChange}
              required
              placeholder="081234567890"
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
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Minimal 6 karakter"
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
                  // Icon Mata Terbuka
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#1e3a5f"/>
                  </svg>
                ) : (
                  // Icon Mata Tertutup
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
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#888' }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 500 }}>
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}