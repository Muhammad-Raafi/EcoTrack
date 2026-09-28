'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TransaksiPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; nama: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ jenisSampah: '', berat: '', hargaPerKg: '' });
  const [transaksiList, setTransaksiList] = useState<any[]>([]);
  const [notif, setNotif] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setLoading(false);
    fetchTransaksi(parsed.id);
  }, [router]);

  const fetchTransaksi = async (userId: string) => {
    const res = await fetch(`/api/transaksi?userId=${userId}`);
    const data = await res.json();
    setTransaksiList(Array.isArray(data) ? data : []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const berat = parseFloat(form.berat);
    const harga = parseFloat(form.hargaPerKg);
    const total = berat * harga;

    const res = await fetch('/api/transaksi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jenisSampah: form.jenisSampah,
        berat,
        hargaPerKg: harga,
        totalHarga: total,
        userId: user.id
      }),
    });

    if (res.ok) {
      setNotif('Transaksi berhasil dicatat!');
      setForm({ jenisSampah: '', berat: '', hargaPerKg: '' });
      fetchTransaksi(user.id);
      setTimeout(() => setNotif(''), 3000);
    } else {
      setNotif('Gagal mencatat transaksi.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <h3 style={{ marginTop: 0, color: '#1e3a5f' }}>Transaksi Penjualan Sampah</h3>
      {notif && <div style={{ padding: '10px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '15px' }}>{notif}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Jenis Sampah</label>
          <input type="text" name="jenisSampah" value={form.jenisSampah} onChange={handleChange} required placeholder="Contoh: Plastik" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Berat (kg)</label>
          <input type="number" step="0.01" name="berat" value={form.berat} onChange={handleChange} required placeholder="0.00" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Harga / Kg (Rp)</label>
          <input type="number" step="1" name="hargaPerKg" value={form.hargaPerKg} onChange={handleChange} required placeholder="5000" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>
        <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Catat Penjualan</button>
      </form>

      <div>
        <h4 style={{ color: '#1e3a5f', marginBottom: '10px' }}>Riwayat Transaksi</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f1f4f9', borderBottom: '2px solid #dde1e6' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#1e3a5f' }}>Tanggal</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#1e3a5f' }}>Jenis Sampah</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#1e3a5f' }}>Berat (kg)</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#1e3a5f' }}>Harga / kg</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#1e3a5f' }}>Total (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {transaksiList.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '12px', color: '#555' }}>{new Date(t.tanggal).toISOString().split('T')[0]}</td>
                <td style={{ padding: '12px', color: '#1e3a5f' }}>{t.jenisSampah}</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>{t.berat}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{t.hargaPerKg}</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#1e3a5f' }}>Rp {t.totalHarga.toLocaleString()}</td>
              </tr>
            ))}
            {transaksiList.length === 0 && <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#999' }}>Belum ada transaksi penjualan.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}