import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia123';

// ✅ PERBAIKAN: Fungsi ambil user dari token (LEBIH ROBUST)
async function getUserFromRequest(request: Request) {
  try {
    // Ambil cookie dari header
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      console.log('❌ Tidak ada cookie header');
      return null;
    }

    // Cari token di cookie
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) {
      console.log('❌ Token tidak ditemukan di cookie');
      return null;
    }

    const token = tokenMatch[1];
    console.log('✅ Token ditemukan:', token.substring(0, 20) + '...');

    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log('✅ Token valid untuk user ID:', decoded.id);

    // Ambil user dari database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true },
    });

    if (!user) {
      console.log('❌ User tidak ditemukan di database');
      return null;
    }

    console.log('✅ User ditemukan:', user.id, user.role);
    return user;
  } catch (error) {
    console.error('❌ Error getUserFromRequest:', error);
    return null;
  }
}

// ============ GET ============
export async function GET() {
  try {
    const laporan = await prisma.laporanSampah.findMany({
      include: {
        user: true,
        jenisSampah: true,
        wilayah: true,
        foto: true,
      },
      orderBy: {
        tanggalLapor: 'desc',
      },
    });
    return NextResponse.json(laporan);
  } catch (error) {
    console.error('Error GET:', error);
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 });
  }
}

// ============ POST ============
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Silakan login ulang' }, { status: 401 });
    }

    const body = await request.json();
    const { jenisSampahId, wilayahNama, berat, imageUrl } = body;

    if (!jenisSampahId || !wilayahNama || !berat) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Cari atau buat wilayah
    let wilayah = await prisma.wilayah.findUnique({
      where: { nama: wilayahNama },
    });

    if (!wilayah) {
      wilayah = await prisma.wilayah.create({
        data: { nama: wilayahNama },
      });
    }

    const laporan = await prisma.laporanSampah.create({
      data: {
        userId: user.id,
        jenisSampahId,
        wilayahId: wilayah.id,
        berat: parseFloat(berat),
        foto: imageUrl ? { create: { imageUrl } } : undefined,
      },
      include: {
        user: true,
        jenisSampah: true,
        wilayah: true,
        foto: true,
      },
    });

    return NextResponse.json(laporan, { status: 201 });
  } catch (error) {
    console.error('Error POST:', error);
    return NextResponse.json({ error: 'Gagal tambah laporan' }, { status: 500 });
  }
}

// ============ PUT ============
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Silakan login ulang' }, { status: 401 });
    }

    const body = await request.json();
    const { id, jenisSampahId, wilayahNama, berat, imageUrl } = body;

    if (!id || !jenisSampahId || !wilayahNama || !berat) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Cek laporan
    const existing = await prisma.laporanSampah.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Laporan tidak ditemukan' }, { status: 404 });
    }

    // Hanya admin atau pemilik laporan yang bisa edit
    if (user.role !== 'admin' && existing.userId !== user.id) {
      return NextResponse.json({ error: 'Tidak memiliki akses' }, { status: 403 });
    }

    // Cari atau buat wilayah
    let wilayah = await prisma.wilayah.findUnique({
      where: { nama: wilayahNama },
    });

    if (!wilayah) {
      wilayah = await prisma.wilayah.create({
        data: { nama: wilayahNama },
      });
    }

    const updated = await prisma.laporanSampah.update({
      where: { id },
      data: {
        jenisSampahId,
        wilayahId: wilayah.id,
        berat: parseFloat(berat),
        foto: imageUrl
          ? {
              upsert: {
                create: { imageUrl },
                update: { imageUrl },
              },
            }
          : undefined,
      },
      include: {
        user: true,
        jenisSampah: true,
        wilayah: true,
        foto: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error PUT:', error);
    return NextResponse.json({ error: 'Gagal edit laporan' }, { status: 500 });
  }
}

// ============ DELETE ============
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Silakan login ulang' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 });
    }

    // Cek laporan
    const existing = await prisma.laporanSampah.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Laporan tidak ditemukan' }, { status: 404 });
    }

    // Hanya admin atau pemilik laporan yang bisa hapus
    if (user.role !== 'admin' && existing.userId !== user.id) {
      return NextResponse.json({ error: 'Tidak memiliki akses' }, { status: 403 });
    }

    // Hapus foto terlebih dahulu
    await prisma.fotoSampah.deleteMany({
      where: { laporanId: id },
    });

    // Hapus laporan
    await prisma.laporanSampah.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error DELETE:', error);
    return NextResponse.json({ error: 'Gagal hapus laporan' }, { status: 500 });
  }
}