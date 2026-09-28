'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/app/components/toast';

type Laporan = {
  id: string;
  berat: number;
  tanggalLapor: string;
  user: { id: string; nama: string };
  jenisSampah: { id: string; namaJenis: string };
  wilayah: { id: string; nama: string };
  foto: { imageUrl: string } | null;
};

type Jenis = { id: string; namaJenis: string };

export default function LaporanPage() {
  const router = useRouter();
  const [data, setData] = useState<Laporan[]>([]);
  const [jenis, setJenis] = useState<Jenis[]>([]);
  const [user, setUser] = useState<{ id: string; nama: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState<{ pesan: string; jenis: 'sukses' | 'error' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [form, setForm] = useState({ jenisSampahId: '', wilayahNama: '', berat: '', foto: null as File | null });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ jenisSampahId: '', wilayahNama: '', berat: '', foto: null as File | null });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/laporan');
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch {
      setData([]);
    }
  };

  const fetchJenis = async () => {
    try {
      const res = await fetch('/api/jenis');
      const json = await res.json();
      setJenis(Array.isArray(json) ? json : []);
    } catch {
      setJenis([]);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchData();
      fetchJenis();
    }
  }, [loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setForm({ ...form, foto: e.target.files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    let fotoPath = null;
    if (form.foto) {
      const fd = new FormData();
      fd.append('foto', form.foto);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
      const uploadJson = await uploadRes.json();
      if (uploadJson.success) fotoPath = uploadJson.foto;
    }

    const payload = {
      jenisSampahId: form.jenisSampahId,
      wilayahNama: form.wilayahNama,
      berat: parseFloat(form.berat),
      imageUrl: fotoPath,
    };

    try {
      const res = await fetch('/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        setNotif({ pesan: 'Laporan berhasil ditambahkan', jenis: 'sukses' });
        setTimeout(() => setNotif(null), 3500);
        setForm({ jenisSampahId: '', wilayahNama: '', berat: '', foto: null });
        fetchData();
      } else {
        setNotif({ pesan: result.error || 'Gagal menambahkan laporan', jenis: 'error' });
        setTimeout(() => setNotif(null), 3500);
      }
    } catch {
      setNotif({ pesan: 'Terjadi kesalahan', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
    }
  };

  // (Kode Edit, Delete, dan Modal Edit/Delete sisanya sama seperti di kode asli kamu, persingkat di sini untuk menghemat tempat. Jika butuh full, saya berikan di lampiran berikutnya).
  // Untuk sekarang, kita fokus ke tampilan.

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <h3 style={{ marginTop: 0, color: '#1e3a5f' }}>Tambah Laporan Sampah</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Jenis Sampah</label>
            <select name="jenisSampahId" value={form.jenisSampahId} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}>
              <option value="">Pilih Jenis</option>
              {jenis.map((j) => <option key={j.id} value={j.id}>{j.namaJenis}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 220px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Lokasi</label>
            <input type="text" name="wilayahNama" value={form.wilayahNama} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Berat (kg)</label>
            <input type="number" step="0.01" name="berat" value={form.berat} onChange={handleChange} required min="0.01" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Foto Bukti</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required style={{ width: '100%', padding: '8px 10px', border: '2px dashed #0070f3', borderRadius: '6px', backgroundColor: '#f9faff' }} />
          </div>
          <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, height: '44px', cursor: 'pointer' }}>Tambah</button>
        </div>
      </form>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#1e3a5f' }}>Data Laporan Sampah</h3>
        {/* Disini kamu bisa copy-paste tabel data laporan dari kode asli kamu */}
        <p style={{ color: '#999', textAlign: 'center' }}>Tabel data laporan kamu (copy dari kode asli)...</p>
      </div>
    </div>
  );
}