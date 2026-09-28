import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Memulai proses seed database...');

  const hashedPassword = await bcrypt.hash('password123', 10);
  console.log('⏳ Menambahkan User Admin & Petugas...');

  console.log('⏳ Membersihkan database lama...');

  // 1. Hapus tabel anak / tabel relasi terlebih dahulu
  await prisma.fotoSampah.deleteMany({});
  await prisma.laporanSampah.deleteMany({});
  await prisma.transaksi.deleteMany({});
  await prisma.notifikasi.deleteMany({});
  await prisma.riwayatAktivitas.deleteMany({});

  // 2. Hapus tabel baru / tambahan
  await prisma.kategori.deleteMany({});
  await prisma.kendaraan.deleteMany({});
  await prisma.statusLaporan.deleteMany({});

  // 3. Hapus tabel master/induk
  await prisma.wilayah.deleteMany({});
  await prisma.jenisSampah.deleteMany({});
  await prisma.user.deleteMany({});

  // 4. BUAT SEMUA USER SEKALIGUS
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@sekolah.com',
        nama: 'Admin Sekolah',
        password: hashedPassword,
        role: 'admin',
        noHp: '081234567890',
        saldo: 0,
      },
      {
        email: 'petugas1@sekolah.com',
        nama: 'Petugas 1',
        password: hashedPassword,
        role: 'petugas',
        noHp: '081234567891',
        saldo: 0,
      },
      {
        email: 'petugas2@sekolah.com',
        nama: 'Petugas 2',
        password: hashedPassword,
        role: 'petugas',
        noHp: '081234567892',
        saldo: 0,
      },
      {
        email: 'petugas3@sekolah.com',
        nama: 'Petugas 3',
        password: hashedPassword,
        role: 'petugas',
        noHp: '081234567893',
        saldo: 0,
      },
      {
        email: 'petugas4@sekolah.com',
        nama: 'Petugas 4',
        password: hashedPassword,
        role: 'petugas',
        noHp: '081234567894',
        saldo: 0,
      },
    ],
  });
  console.log('✅ User berhasil dibuat!');

  // 5. BUAT WILAYAH
  console.log('⏳ Membuat wilayah...');
  const wilayahList = [
    'Jl. Pegangsaan 5, Jakarta Barat',
    'Jl. Undar Selatan, Jakarta Timur',
    'Jl. Pasar Mutiara, Jakarta Pusat',
    'Jl. Duri, Jakarta Pusat'
  ];
  await prisma.wilayah.createMany({
    data: wilayahList.map(nama => ({ nama })),
  });
  console.log('✅ Wilayah berhasil dibuat!');

  // 6. BUAT JENIS SAMPAH (DENGAN HARGA PER KG)
  console.log('⏳ Menambahkan jenis sampah dengan harga...');
  const daftarJenis = [
    { namaJenis: "Organik", hargaPerKg: 2000 },
    { namaJenis: "Anorganik", hargaPerKg: 4000 },
    { namaJenis: "Plastik", hargaPerKg: 5000 },
    { namaJenis: "Kertas", hargaPerKg: 3000 },
    { namaJenis: "Logam", hargaPerKg: 8000 }
  ];
  await prisma.jenisSampah.createMany({
    data: daftarJenis,
  });
  console.log('✅ Jenis sampah berhasil ditambahkan!');

  // 7. AMBIL ID UNTUK LAPORAN
  const userPetugas1 = await prisma.user.findUnique({ where: { email: 'petugas1@sekolah.com' } });
  const userPetugas2 = await prisma.user.findUnique({ where: { email: 'petugas2@sekolah.com' } });
  const userPetugas3 = await prisma.user.findUnique({ where: { email: 'petugas3@sekolah.com' } });
  const userPetugas4 = await prisma.user.findUnique({ where: { email: 'petugas4@sekolah.com' } });

  const jenisOrganik = await prisma.jenisSampah.findUnique({ where: { namaJenis: 'Organik' } });
  const jenisPlastik = await prisma.jenisSampah.findUnique({ where: { namaJenis: 'Plastik' } });
  const jenisKertas = await prisma.jenisSampah.findUnique({ where: { namaJenis: 'Kertas' } });
  const jenisLogam = await prisma.jenisSampah.findUnique({ where: { namaJenis: 'Logam' } });
  const jenisAnorganik = await prisma.jenisSampah.findUnique({ where: { namaJenis: 'Anorganik' } });

  const wilayahJakbar = await prisma.wilayah.findUnique({ where: { nama: 'Jl. Pegangsaan 5, Jakarta Barat' } });
  const wilayahJaktim = await prisma.wilayah.findUnique({ where: { nama: 'Jl. Undar Selatan, Jakarta Timur' } });
  const wilayahJakpus1 = await prisma.wilayah.findUnique({ where: { nama: 'Jl. Pasar Mutiara, Jakarta Pusat' } });
  const wilayahJakpus2 = await prisma.wilayah.findUnique({ where: { nama: 'Jl. Duri, Jakarta Pusat' } });

  const dummyFoto = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200&h=200&fit=crop';
  
  console.log('⏳ Membuat laporan sampah...');
  
  // Masukkan data laporan
  if (userPetugas4 && jenisOrganik && wilayahJakbar) {
    await prisma.laporanSampah.create({
      data: { berat: 6, userId: userPetugas4.id, jenisSampahId: jenisOrganik.id, wilayahId: wilayahJakbar.id, foto: { create: { imageUrl: dummyFoto } } }
    });
  }
  if (userPetugas3 && jenisPlastik && wilayahJaktim) {
    await prisma.laporanSampah.create({
      data: { berat: 1, userId: userPetugas3.id, jenisSampahId: jenisPlastik.id, wilayahId: wilayahJaktim.id, foto: { create: { imageUrl: dummyFoto } } }
    });
  }
  if (userPetugas1 && jenisKertas && wilayahJakpus1) {
    await prisma.laporanSampah.create({
      data: { berat: 2, userId: userPetugas1.id, jenisSampahId: jenisKertas.id, wilayahId: wilayahJakpus1.id, foto: { create: { imageUrl: dummyFoto } } }
    });
  }
  if (userPetugas3 && jenisLogam && wilayahJaktim) {
    await prisma.laporanSampah.create({
      data: { berat: 5, userId: userPetugas3.id, jenisSampahId: jenisLogam.id, wilayahId: wilayahJaktim.id, foto: { create: { imageUrl: dummyFoto } } }
    });
  }
  if (userPetugas1 && jenisOrganik && wilayahJakpus1) {
    await prisma.laporanSampah.create({
      data: { berat: 3, userId: userPetugas1.id, jenisSampahId: jenisOrganik.id, wilayahId: wilayahJakpus1.id, foto: { create: { imageUrl: dummyFoto } } }
    });
  }
  if (userPetugas2 && jenisAnorganik && wilayahJakpus2) {
    await prisma.laporanSampah.create({
      data: { berat: 1, userId: userPetugas2.id, jenisSampahId: jenisAnorganik.id, wilayahId: wilayahJakpus2.id, foto: { create: { imageUrl: dummyFoto } } }
    });
  }
  console.log('✅ Laporan sampah berhasil dibuat!');

  // 8. TABEL TAMBAHAN
  console.log('⏳ Mengisi tabel tambahan...');
  await prisma.kategori.createMany({ data: [{ namaKategori: 'Sampah Rumah Tangga', deskripsi: 'Sampah yang dihasilkan dari aktivitas rumah tangga' }] });
  await prisma.kendaraan.createMany({ data: [{ platNomor: 'B 1234 XYZ', jenisKendaraan: 'Truck Sampah', kapasitas: 5000.0 }] });
  await prisma.statusLaporan.createMany({ data: [{ namaStatus: 'Baru' }, { namaStatus: 'Sedang Diproses' }, { namaStatus: 'Selesai' }] });
  
  const admin = await prisma.user.findUnique({ where: { email: 'admin@sekolah.com' } });
  if (admin) {
    await prisma.notifikasi.create({ data: { userId: admin.id, pesan: 'Selamat datang di aplikasi EcoTrack!', isRead: false } });
    await prisma.riwayatAktivitas.create({ data: { userId: admin.id, aksi: 'SEED_DATABASE', detail: 'Admin berhasil melakukan seeding database awal.' } });
  }
  console.log('✅ Tabel tambahan berhasil diisi!');
  console.log('🎉 Seed database selesai!');
}

main().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});