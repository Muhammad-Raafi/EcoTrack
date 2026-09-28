'use client';

import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  type: 'sukses' | 'error';
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Muncul dengan animasi slide-in
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Mulai proses keluar setelah 3 detik
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setIsVisible(false);
    }, 3000);

    // Panggil onClose setelah animasi slide-out selesai (400ms)
    const closeTimer = setTimeout(() => {
      onClose();
    }, 3400);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const bgColor = type === 'sukses' ? '#065f46' : '#991b1b';
  const borderColor = type === 'sukses' ? '#34d399' : '#f87171';
  const icon = type === 'sukses' ? '✅' : '❌';

  // Jika isExiting true, geser ke kanan (translateX 120%)
  // Jika isVisible true, muncul di posisi normal (translateX 0)
  const translateX = isExiting ? '120%' : isVisible ? '0' : '120%';

  return (
    <div
      style={{
        position: 'fixed',
        top: '30px',
        right: '30px',
        zIndex: 9999,
        transform: `translateX(${translateX})`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: bgColor,
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
        borderLeft: `6px solid ${borderColor}`,
        minWidth: '280px',
        maxWidth: '450px',
        fontSize: '15px',
        fontWeight: 500,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}