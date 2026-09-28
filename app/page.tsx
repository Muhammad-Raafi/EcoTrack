'use client';

import { useEffect, useState, useRef } from 'react';
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

type DashboardData = {
  totalLaporan: number;
  totalBerat: number;
  totalWilayah: number;
  totalPetugas: number;
  totalPerBulan: { bulan: string; total: number; totalBerat: number }[];
  jenisSampahTerbanyak: { nama: string; total: number } | null;
  wilayahTerbanyak: { nama: string; total: number } | null;
  totalPerJenis: { nama: string; total: number; totalBerat: number }[];
};

// Tipe untuk user dengan saldo
type UserWithSaldo = {
  id: string;
  nama: string;
  role: string;
  email?: string;
  saldo?: number;
};

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<Laporan[]>([]);
  const [jenis, setJenis] = useState<Jenis[]>([]);
  const [user, setUser] = useState<UserWithSaldo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notif, setNotif] = useState<{ pesan: string; jenis: 'sukses' | 'error' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  
  // --- NAVIGATION STATE ---
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'laporan' | 'petugas' | 'transaksi'>('dashboard');

  // --- USER STATE ---
  const [petugasList, setPetugasList] = useState<any[]>([]);
  const [showProfilModal, setShowProfilModal] = useState(false);
  const [showGantiPasswordModal, setShowGantiPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  // --- STATE GANTI PASSWORD TOGGLE MATA ---
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({ jenisSampahId: '', wilayahNama: '', berat: '', foto: null as File | null });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ jenisSampahId: '', wilayahNama: '', berat: '', foto: null as File | null });
  const [showEditModal, setShowEditModal] = useState(false);

  // --- STATE TRANSAKSI BARU ---
  const [transaksiList, setTransaksiList] = useState<any[]>([]);
  const [transaksiForm, setTransaksiForm] = useState({ jenisSampah: '', berat: '', hargaPerKg: '' });
  const [saldo, setSaldo] = useState<number>(0);

  const isAdmin = user?.role === 'admin';
  const isPetugas = user?.role === 'petugas';
  const hasLoaded = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setSaldo(parsedUser?.saldo || 0);
    setNotif(null);
    setLoading(false);
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/laporan');
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };

  const fetchJenis = async () => {
    try {
      const res = await fetch('/api/jenis');
      const json = await res.json();
      setJenis(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error('Error fetching jenis:', error);
      setJenis([]);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (!json.error) setDashboard(json);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setDashboard(null);
    }
  };

  const fetchPetugas = async () => {
    try {
      const res = await fetch('/api/petugas');
      const json = await res.json();
      if (Array.isArray(json)) setPetugasList(json);
    } catch (error) {
      console.error('Error fetching petugas:', error);
      setPetugasList([]);
    }
  };

  const fetchTransaksi = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/transaksi?userId=${user.id}`);
      const json = await res.json();
      if (json.transaksi) {
        setTransaksiList(Array.isArray(json.transaksi) ? json.transaksi : []);
        setSaldo(json.saldo || 0);
        // Update user dengan saldo terbaru
        setUser(prev => prev ? { ...prev, saldo: json.saldo || 0 } : prev);
      } else {
        setTransaksiList(Array.isArray(json) ? json : []);
      }
    } catch (error) {
      console.error('Error fetching transaksi:', error);
      setTransaksiList([]);
    }
  };

  useEffect(() => {
    if (!loading && !hasLoaded.current) {
      hasLoaded.current = true;
      const timer = setTimeout(() => setLoading(false), 1500);
      fetchData().catch(() => {});
      fetchJenis().catch(() => {});
      if (isAdmin) {
        fetchDashboard().catch(() => {});
        fetchPetugas().catch(() => {});
        setActiveMenu('dashboard');
      } else if (isPetugas) {
        fetchTransaksi().catch(() => {});
        setActiveMenu('dashboard');
      }
      return () => clearTimeout(timer);
    }
  }, [loading, isAdmin, isPetugas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.files.length > 0) {
      setForm({ ...form, foto: e.target.files[0] });
    } else {
      setForm({ ...form, foto: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPetugas) {
      setNotif({ pesan: 'Hanya Petugas yang bisa menambah laporan!', jenis: 'error' });
      setTimeout(() => setNotif(null), 4000);
      return;
    }
    
    if (!user?.id) {
      setNotif({ pesan: 'Anda harus login terlebih dahulu', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
      return;
    }

    if (!form.jenisSampahId || !form.wilayahNama || !form.berat) {
      setNotif({ pesan: 'Semua field harus diisi!', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
      return;
    }

    const beratNum = parseFloat(form.berat);
    if (isNaN(beratNum) || beratNum <= 0) {
      setNotif({ pesan: 'Berat harus berupa angka positif!', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
      return;
    }

    try {
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
        berat: beratNum,
        imageUrl: fotoPath,
      };
      
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
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        await fetchData();
        if (isAdmin) await fetchDashboard();
      } else {
        setNotif({ pesan: result.error || 'Gagal menambahkan laporan', jenis: 'error' });
        setTimeout(() => setNotif(null), 3500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotif({ pesan: 'Terjadi kesalahan: ' + (error as Error).message, jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
    }
  };

  const openEditModal = (item: Laporan) => {
    if (!isPetugas) {
      setNotif({ pesan: 'Hanya Petugas yang bisa edit laporan!', jenis: 'error' });
      setTimeout(() => setNotif(null), 4000);
      return;
    }
    setEditingId(item.id);
    setEditForm({
      jenisSampahId: item.jenisSampah.id,
      wilayahNama: item.wilayah.nama,
      berat: item.berat.toString(),
      foto: null,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPetugas || !editingId) {
      setNotif({ pesan: 'Anda tidak memiliki akses untuk edit laporan', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
      return;
    }
    
    try {
      let fotoPath = null;
      if (editForm.foto) {
        const fd = new FormData();
        fd.append('foto', editForm.foto);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const uploadJson = await uploadRes.json();
        if (uploadJson.success) fotoPath = uploadJson.foto;
      }
      
      const payload = {
        id: editingId,
        jenisSampahId: editForm.jenisSampahId,
        wilayahNama: editForm.wilayahNama,
        berat: parseFloat(editForm.berat),
        imageUrl: fotoPath,
      };
      
      const res = await fetch('/api/laporan', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (res.ok) {
        setNotif({ pesan: 'Laporan berhasil diperbarui', jenis: 'sukses' });
        setTimeout(() => setNotif(null), 3500);
        setShowEditModal(false);
        setEditingId(null);
        await fetchData();
        if (isAdmin) await fetchDashboard();
      } else {
        const result = await res.json();
        setNotif({ pesan: result.error || 'Gagal memperbarui laporan', jenis: 'error' });
        setTimeout(() => setNotif(null), 3500);
      }
    } catch (error) {
      console.error('Error updating:', error);
      setNotif({ pesan: 'Terjadi kesalahan saat update', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
    }
  };

  const handleDelete = (id: string) => {
    if (!isPetugas) {
      setNotif({ pesan: 'Hanya Petugas yang bisa hapus laporan!', jenis: 'error' });
      setTimeout(() => setNotif(null), 4000);
      return;
    }
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/laporan?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setNotif({ pesan: 'Laporan berhasil dihapus', jenis: 'sukses' });
        setTimeout(() => setNotif(null), 3500);
        setShowDeleteModal(false);
        setDeleteId(null);
        await fetchData();
        if (isAdmin) await fetchDashboard();
      } else {
        const result = await res.json();
        setNotif({ pesan: result.error || 'Gagal menghapus laporan', jenis: 'error' });
        setTimeout(() => setNotif(null), 3500);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      setNotif({ pesan: 'Terjadi kesalahan saat menghapus', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
    }
  };

  const handleTransaksiSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user?.id) {
    setNotif({ pesan: 'Anda harus login terlebih dahulu', jenis: 'error' });
    setTimeout(() => setNotif(null), 3500);
    return;
  }

  // ✅ HANYA CEK JENIS SAMPAH DAN BERAT (harga otomatis dari database)
  if (!transaksiForm.jenisSampah || !transaksiForm.berat) {
    setNotif({ pesan: 'Jenis sampah dan berat harus diisi!', jenis: 'error' });
    setTimeout(() => setNotif(null), 3500);
    return;
  }

  const berat = parseFloat(transaksiForm.berat);
  
  if (isNaN(berat) || berat <= 0) {
    setNotif({ pesan: 'Berat harus berupa angka positif!', jenis: 'error' });
    setTimeout(() => setNotif(null), 3500);
    return;
  }

  try {
    const res = await fetch('/api/transaksi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jenisSampah: transaksiForm.jenisSampah,
        berat,
        userId: user.id
      }),
    });
    
    const result = await res.json();
    if (res.ok) {
      setNotif({ pesan: result.pesan || 'Transaksi berhasil dicatat!', jenis: 'sukses' });
      setTimeout(() => setNotif(null), 3500);
      setTransaksiForm({ jenisSampah: '', berat: '', hargaPerKg: '' });
      await fetchTransaksi();
      if (result.saldoBaru !== undefined) {
        setSaldo(result.saldoBaru);
        setUser(prev => prev ? { ...prev, saldo: result.saldoBaru } : prev);
      }
    } else {
      setNotif({ pesan: result.error || 'Gagal mencatat transaksi', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
    }
  } catch (error) {
    console.error('Error transaksi:', error);
    setNotif({ pesan: 'Terjadi kesalahan saat transaksi', jenis: 'error' });
    setTimeout(() => setNotif(null), 3500);
  }
};

  const handleGantiPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotif({ pesan: 'Password baru tidak sama', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
      return;
    }
    try {
      const res = await fetch('/api/user/ganti-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setNotif({ pesan: 'Password berhasil diubah', jenis: 'sukses' });
        setTimeout(() => setNotif(null), 3500);
        setShowGantiPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowCurrent(false); setShowNew(false); setShowConfirm(false);
      } else {
        setNotif({ pesan: result.error || 'Gagal mengubah password', jenis: 'error' });
        setTimeout(() => setNotif(null), 3500);
      }
    } catch (error) {
      console.error('Error ganti password:', error);
      setNotif({ pesan: 'Terjadi kesalahan', jenis: 'error' });
      setTimeout(() => setNotif(null), 3500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/login');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, Arial, sans-serif', backgroundColor: '#f4f7fc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER UTAMA */}
        <div style={{ backgroundColor: '#1e3a5f', color: 'white', padding: '16px 30px', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1 style={{ margin: 0, fontSize: '28px' }}>🌱 EcoTrack</h1></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* SALDO PETUGAS - TAMPIL DI HEADER */}
            {isPetugas && (
              <div style={{ 
                backgroundColor: '#10b981', 
                color: 'white', 
                padding: '4px 14px', 
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Saldo: Rp {saldo.toLocaleString()}
              </div>
            )}
            <div onClick={() => setShowProfilModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 12px 4px 8px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: isAdmin ? '#0070f3' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: 600, border: '2px solid white' }}>
                {isAdmin ? 'A' : user?.nama?.charAt(0).toUpperCase() || 'P'}
              </div>
              <span style={{ opacity: 0.95, fontWeight: 500, fontSize: '14px' }}>{isAdmin ? 'Admin' : user?.nama}</span>
              <span style={{ fontSize: '11px', backgroundColor: isAdmin ? '#0070f3' : '#10b981', padding: '2px 10px', borderRadius: '12px', opacity: 0.9 }}>
                {isAdmin ? 'Admin' : 'Petugas'}
              </span>
            </div>
            <button onClick={handleLogout} style={{ padding: '6px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Logout</button>
          </div>
        </div>

        {/* SUB NAVBAR */}
        <div style={{ display: 'flex', gap: '32px', padding: '0 30px', backgroundColor: '#1e3a5f', borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: '0 0 12px 12px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveMenu('dashboard')} style={{ padding: '12px 4px 10px 4px', border: 'none', borderBottom: activeMenu === 'dashboard' ? '2px solid white' : '2px solid transparent', backgroundColor: 'transparent', color: activeMenu === 'dashboard' ? 'white' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: activeMenu === 'dashboard' ? 600 : 400, cursor: 'pointer' }}>
            Dashboard
          </button>
          <button onClick={() => setActiveMenu('laporan')} style={{ padding: '12px 4px 10px 4px', border: 'none', borderBottom: activeMenu === 'laporan' ? '2px solid white' : '2px solid transparent', backgroundColor: 'transparent', color: activeMenu === 'laporan' ? 'white' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: activeMenu === 'laporan' ? 600 : 400, cursor: 'pointer' }}>
            Laporan
          </button>
          {isAdmin && (
            <button onClick={() => setActiveMenu('petugas')} style={{ padding: '12px 4px 10px 4px', border: 'none', borderBottom: activeMenu === 'petugas' ? '2px solid white' : '2px solid transparent', backgroundColor: 'transparent', color: activeMenu === 'petugas' ? 'white' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: activeMenu === 'petugas' ? 600 : 400, cursor: 'pointer' }}>
              Petugas
            </button>
          )}
          {isPetugas && (
            <button onClick={() => setActiveMenu('transaksi')} style={{ padding: '12px 4px 10px 4px', border: 'none', borderBottom: activeMenu === 'transaksi' ? '2px solid white' : '2px solid transparent', backgroundColor: 'transparent', color: activeMenu === 'transaksi' ? 'white' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: activeMenu === 'transaksi' ? 600 : 400, cursor: 'pointer' }}>
              Transaksi
            </button>
          )}
        </div>

        {/* KONTEN UTAMA */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '0 0 12px 12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
          
          {/* DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <div>
              {isAdmin && dashboard ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                  {[
                    { label: 'Total Laporan', value: dashboard.totalLaporan },
                    { label: 'Total Berat Sampah', value: `${dashboard.totalBerat.toFixed(1)} kg` },
                    { label: 'Wilayah Terdaftar', value: dashboard.totalWilayah },
                    { label: 'Total Petugas', value: dashboard.totalPetugas },
                  ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e9ecef' }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a5f' }}>{item.value}</div>
                      <div style={{ fontSize: '13px', color: '#7f8c8d' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              ) : isPetugas ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e9ecef' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a5f' }}>{data.length}</div>
                    <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Total Laporan Saya</div>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e9ecef' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a5f' }}>{data.reduce((sum, item) => sum + item.berat, 0).toFixed(1)} kg</div>
                    <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Berat Total Sampah</div>
                  </div>
                  <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #86efac' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#166534' }}>Rp {saldo.toLocaleString()}</div>
                    <div style={{ fontSize: '13px', color: '#166534' }}>Total Pendapatan</div>
                  </div>
                </div>
              ) : (
                <p>Loading dashboard...</p>
              )}
            </div>
          )}

          {/* HALAMAN LAPORAN */}
          {activeMenu === 'laporan' && (
            <div>
              {isPetugas ? (
                <>
                  <h3 style={{ marginTop: 0, color: '#1e3a5f' }}>Tambah Laporan Sampah</h3>
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
                      <div style={{ flex: '1 1 180px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Jenis Sampah *</label>
                        <select name="jenisSampahId" value={form.jenisSampahId} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', color: '#1e3a5f' }}>
                          <option value="">Pilih Jenis</option>
                          {jenis.map((j) => <option key={j.id} value={j.id}>{j.namaJenis}</option>)}
                        </select>
                      </div>
                      <div style={{ flex: '1 1 220px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Lokasi / Wilayah *</label>
                        <input type="text" name="wilayahNama" value={form.wilayahNama} onChange={handleChange} required placeholder="Contoh: Jl. Sudirman No. 1" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', color: '#1e3a5f', backgroundColor: 'white' }} />
                      </div>
                      <div style={{ flex: '1 1 120px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Berat (kg) *</label>
                        <input type="number" step="0.1" name="berat" value={form.berat} onChange={handleChange} required min="0.1" placeholder="0.0" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', color: '#1e3a5f', backgroundColor: 'white' }} />
                      </div>
                      <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Foto Bukti (Opsional)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '2px dashed #0070f3', borderRadius: '6px', backgroundColor: '#f9faff', color: '#1e3a5f', cursor: 'pointer' }} />
                      </div>
                      <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', height: '44px' }}>
                        Tambah
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ margin: 0, color: '#856404' }}>Admin hanya bisa melihat laporan, tidak bisa menambah, mengedit, atau menghapus.</p>
                </div>
              )}

              {/* TABEL LAPORAN */}
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ margin: 0, color: '#1e3a5f' }}>Data Laporan Sampah</h3>
                <div style={{ marginTop: '15px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f4f9', borderBottom: '2px solid #dde1e6' }}>
                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#1e3a5f' }}>ID</th>
                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#1e3a5f' }}>Petugas</th>
                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#1e3a5f' }}>Jenis Sampah</th>
                        <th style={{ padding: '12px 15px', textAlign: 'left', color: '#1e3a5f' }}>Lokasi</th>
                        <th style={{ padding: '12px 15px', textAlign: 'center', color: '#1e3a5f' }}>Berat</th>
                        <th style={{ padding: '12px 15px', textAlign: 'center', color: '#1e3a5f' }}>Foto</th>
                        <th style={{ padding: '12px 15px', textAlign: 'center', color: '#1e3a5f' }}>Tanggal</th>
                        {isPetugas && (
                          <th style={{ padding: '12px 15px', textAlign: 'center', color: '#1e3a5f' }}>Aksi</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                          <td style={{ padding: '12px 15px', fontSize: '13px', color: '#1e3a5f' }}>{item.id.substring(0, 8)}…</td>
                          <td style={{ padding: '12px 15px', color: '#1e3a5f' }}>{item.user.nama}</td>
                          <td style={{ padding: '12px 15px' }}><span style={{ backgroundColor: '#eaf5ea', color: '#1e6f1e', padding: '2px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{item.jenisSampah.namaJenis}</span></td>
                          <td style={{ padding: '12px 15px', color: '#1e3a5f' }}>{item.wilayah.nama}</td>
                          <td style={{ padding: '12px 15px', textAlign: 'center', fontWeight: 600, color: '#1e3a5f' }}>{item.berat}</td>
                          <td style={{ padding: '12px 15px', textAlign: 'center' }}>
  {item.foto ? (
    <img 
      src={item.foto.imageUrl} 
      alt="Foto" 
      style={{ 
        width: '120px', 
        height: '80px', 
        objectFit: 'cover', 
        borderRadius: '8px',
        display: 'block',
        margin: '0 auto'
      }} 
    />
  ) : (
    <span style={{ color: '#999', fontSize: '13px' }}>-</span>
  )}
</td>
                          <td style={{ padding: '12px 15px', textAlign: 'center', fontSize: '13px', color: '#555' }}>{new Date(item.tanggalLapor).toISOString().split('T')[0]}</td>
                          {isPetugas && (
                            <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                              <button 
                                onClick={() => openEditModal(item)} 
                                style={{ 
                                  padding: '6px 16px',
                                  backgroundColor: 'transparent',
                                  color: '#1e3a5f',
                                  border: '1.5px solid #1e3a5f',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  marginRight: '8px',
                                  transition: 'all 0.3s ease',
                                  fontWeight: 500,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#1e3a5f';
                                  e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#1e3a5f';
                                }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)} 
                                style={{ 
                                  padding: '6px 16px',
                                  backgroundColor: 'transparent',
                                  color: '#c0392b',
                                  border: '1.5px solid #c0392b',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  fontWeight: 500,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#c0392b';
                                  e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#c0392b';
                                }}
                              >
                                Hapus
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* HALAMAN PETUGAS (ADMIN) */}
          {isAdmin && activeMenu === 'petugas' && (
            <div>
              <h3 style={{ marginTop: 0, color: '#1e3a5f' }}>Daftar Petugas</h3>
              <div style={{ marginTop: '15px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f4f9', borderBottom: '2px solid #dde1e6' }}>
                      <th style={{ padding: '12px 15px', textAlign: 'left', color: '#1e3a5f' }}>ID</th>
                      <th style={{ padding: '12px 15px', textAlign: 'left', color: '#1e3a5f' }}>Nama</th>
                      <th style={{ padding: '12px 15px', textAlign: 'left', color: '#1e3a5f' }}>Email</th>
                      <th style={{ padding: '12px 15px', textAlign: 'left', color: '#1e3a5f' }}>No HP</th>
                      <th style={{ padding: '12px 15px', textAlign: 'center', color: '#1e3a5f' }}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petugasList.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td style={{ padding: '12px 15px', fontSize: '13px', color: '#1e3a5f' }}>{p.id.substring(0, 8)}…</td>
                        <td style={{ padding: '12px 15px', color: '#1e3a5f' }}>{p.nama}</td>
                        <td style={{ padding: '12px 15px', color: '#1e3a5f' }}>{p.email}</td>
                        <td style={{ padding: '12px 15px', color: '#1e3a5f' }}>{p.noHp}</td>
                        <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                          <span style={{ backgroundColor: '#eaf5ea', color: '#1e6f1e', padding: '2px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{p.role}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HALAMAN TRANSAKSI */}
{isPetugas && activeMenu === 'transaksi' && (
  <div>
    <h3 style={{ marginTop: 0, color: '#1e3a5f' }}>Transaksi Penjualan Sampah</h3>
    
    {/* SALDO CARD */}
    <div style={{ 
      backgroundColor: '#f0fdf4', 
      padding: '15px 20px', 
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #86efac',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div>
        <h4 style={{ margin: 0, color: '#166534' }}>💰 Total Pendapatan</h4>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#166534' }}>
          Dari {transaksiList.length} transaksi penjualan sampah
        </p>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#166534' }}>
        Rp {saldo.toLocaleString()}
      </div>
    </div>

    <form onSubmit={handleTransaksiSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', marginBottom: '30px' }}>
      <div style={{ flex: '1 1 150px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Jenis Sampah *</label>
        <select 
          name="jenisSampah" 
          value={transaksiForm.jenisSampah} 
          onChange={(e) => {
            setTransaksiForm({ ...transaksiForm, jenisSampah: e.target.value });
            // Cari harga otomatis dari data jenis yang sudah di-fetch
            const selectedJenis = jenis.find(j => j.namaJenis === e.target.value);
            // Harga akan diambil oleh API, tidak perlu di-set di sini
          }} 
          required 
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: 'white' }}
        >
          <option value="">Pilih Jenis</option>
          {jenis.map((j) => (
            <option key={j.id} value={j.namaJenis}>
              {j.namaJenis}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: '1 1 120px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Berat (kg) *</label>
        <input 
          type="number" 
          step="0.1" 
          name="berat" 
          value={transaksiForm.berat} 
          onChange={(e) => setTransaksiForm({ ...transaksiForm, berat: e.target.value })} 
          required 
          placeholder="0.0" 
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} 
        />
      </div>
      <div style={{ flex: '1 1 150px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Harga / Kg (Otomatis)</label>
        <div style={{ 
          width: '100%', 
          padding: '10px', 
          border: '1px solid #10b981', 
          borderRadius: '6px', 
          backgroundColor: '#f0fdf4',
          color: '#166534',
          fontWeight: 600,
          height: '42px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {transaksiForm.jenisSampah ? (
            `Rp ${(jenis.find(j => j.namaJenis === transaksiForm.jenisSampah) as any)?.hargaPerKg?.toLocaleString() || '0'}`
          ) : (
            'Pilih jenis sampah'
          )}
        </div>
      </div>
      <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
        Catat Penjualan
      </button>
    </form>

    <h4 style={{ color: '#1e3a5f' }}>Riwayat Transaksi</h4>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
      <thead><tr style={{ background: '#f1f4f9', borderBottom: '2px solid #dde1e6' }}>
        <th style={{ padding: '12px', textAlign: 'left', color: '#1e3a5f' }}>Tanggal</th>
        <th style={{ padding: '12px', textAlign: 'left', color: '#1e3a5f' }}>Jenis Sampah</th>
        <th style={{ padding: '12px', textAlign: 'center', color: '#1e3a5f' }}>Berat (kg)</th>
        <th style={{ padding: '12px', textAlign: 'center', color: '#1e3a5f' }}>Harga / kg</th>
        <th style={{ padding: '12px', textAlign: 'center', color: '#1e3a5f' }}>Total (Rp)</th>
      </tr></thead>
      <tbody>
        {transaksiList.map((t) => (
          <tr key={t.id} style={{ borderBottom: '1px solid #e9ecef' }}>
            <td style={{ padding: '12px', color: '#555' }}>{new Date(t.tanggal).toISOString().split('T')[0]}</td>
            <td style={{ padding: '12px', color: '#1e3a5f' }}>{t.jenisSampah}</td>
            <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>{t.berat}</td>
            <td style={{ padding: '12px', textAlign: 'center' }}>Rp {t.hargaPerKg.toLocaleString()}</td>
            <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#1e3a5f' }}>Rp {t.totalHarga.toLocaleString()}</td>
          </tr>
        ))}
        {transaksiList.length === 0 && <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#999' }}>Belum ada transaksi penjualan.</td></tr>}
      </tbody>
    </table>
  </div>
)}
        </div>
      </div>

      {/* --- MODAL PROFIL --- */}
      {showProfilModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '450px', width: '100%', margin: '20px' }}>
            <h2 style={{ color: '#1e3a5f', marginTop: 0 }}>Profil {isAdmin ? 'Admin' : 'Petugas'}</h2>
            {[
              { label: 'Nama', value: user?.nama },
              { label: 'Email', value: user?.email },
              { label: 'Role', value: isAdmin ? 'Admin' : 'Petugas' },
              { label: 'Total Pendapatan', value: isPetugas ? `Rp ${saldo.toLocaleString()}` : '-' },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#7f8c8d', marginBottom: '2px', fontSize: '13px' }}>{item.label}</label>
                <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', color: '#1e3a5f' }}>{item.value}</div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowGantiPasswordModal(true)} style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Ganti Password</button>
              <button onClick={() => setShowProfilModal(false)} style={{ padding: '10px 20px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL GANTI PASSWORD --- */}
      {showGantiPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '450px', width: '100%', margin: '20px' }}>
            <h2 style={{ color: '#1e3a5f', marginTop: 0 }}>Ganti Password</h2>
            <form onSubmit={handleGantiPassword}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Password Saat Ini</label>
                <div style={{ position: 'relative' }}>
                  <input type={showCurrent ? 'text' : 'password'} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required style={{ width: '100%', padding: '10px', paddingRight: '45px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', color: '#1e3a5f', boxSizing: 'border-box' }} />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                    {showCurrent ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#1e3a5f"/></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#1e3a5f" opacity="0.4"/><line x1="3" y1="3" x2="21" y2="21" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Password Baru</label>
                <div style={{ position: 'relative' }}>
                  <input type={showNew ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required style={{ width: '100%', padding: '10px', paddingRight: '45px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', color: '#1e3a5f', boxSizing: 'border-box' }} />
                  <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                    {showNew ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#1e3a5f"/></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#1e3a5f" opacity="0.4"/><line x1="3" y1="3" x2="21" y2="21" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Konfirmasi Password Baru</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required style={{ width: '100%', padding: '10px', paddingRight: '45px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', color: '#1e3a5f', boxSizing: 'border-box' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                    {showConfirm ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#1e3a5f"/></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#1e3a5f" opacity="0.4"/><line x1="3" y1="3" x2="21" y2="21" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowGantiPasswordModal(false)} style={{ padding: '10px 20px', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT --- */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '100%', margin: '20px' }}>
            <h3 style={{ color: '#1e3a5f', marginTop: 0 }}>Edit Laporan</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Jenis Sampah</label>
                <select name="jenisSampahId" value={editForm.jenisSampahId} onChange={(e) => setEditForm({ ...editForm, jenisSampahId: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}>
                  {jenis.map((j) => <option key={j.id} value={j.id}>{j.namaJenis}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Lokasi / Wilayah</label>
                <input type="text" value={editForm.wilayahNama} onChange={(e) => setEditForm({ ...editForm, wilayahNama: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Berat (kg)</label>
                <input type="number" step="0.1" value={editForm.berat} onChange={(e) => setEditForm({ ...editForm, berat: e.target.value })} required min="0.1" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', marginBottom: '4px' }}>Foto Baru (Opsional)</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setEditForm({ ...editForm, foto: e.target.files[0] });
                  }
                }} style={{ width: '100%', padding: '8px 10px', border: '2px dashed #0070f3', borderRadius: '6px', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '10px 20px', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DELETE --- */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '100%', margin: '20px' }}>
            <h3 style={{ color: '#c0392b', marginTop: 0 }}>Hapus Laporan?</h3>
            <p style={{ color: '#555' }}>Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ padding: '10px 20px', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
              <button onClick={confirmDelete} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {notif && (
        <Toast message={notif.pesan} type={notif.jenis} onClose={() => setNotif(null)} />
      )}
    </div>
  );
}