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

async function getUserFromRequest(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) return null;

    const token = tokenMatch[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, saldo: true },
    });

    return user;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const transaksi = await prisma.transaksi.findMany({
      where: userId ? { userId } : {},
      orderBy: { tanggal: 'desc' },
    });

    const userWithSaldo = await prisma.user.findUnique({
      where: { id: user.id },
      select: { saldo: true },
    });

    return NextResponse.json({
      transaksi,
      saldo: userWithSaldo?.saldo || 0,
    });
  } catch (error) {
    console.error('Error GET /api/transaksi:', error);
    return NextResponse.json({ error: 'Gagal ambil data transaksi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jenisSampah, berat } = body;

    if (!jenisSampah || !berat) {
      return NextResponse.json(
        { error: 'Jenis sampah dan berat wajib diisi' },
        { status: 400 }
      );
    }

    const beratNum = parseFloat(berat);
    if (isNaN(beratNum) || beratNum <= 0) {
      return NextResponse.json(
        { error: 'Berat harus berupa angka positif' },
        { status: 400 }
      );
    }

    // ✅ AMBIL HARGA PER KG DARI DATABASE BERDASARKAN JENIS SAMPAH
    const jenisSampahData = await prisma.jenisSampah.findUnique({
      where: { namaJenis: jenisSampah },
      select: { hargaPerKg: true },
    });

    if (!jenisSampahData) {
      return NextResponse.json(
        { error: 'Jenis sampah tidak ditemukan di database' },
        { status: 400 }
      );
    }

    const hargaPerKg = jenisSampahData.hargaPerKg || 0;
    const totalHarga = beratNum * hargaPerKg;

    if (totalHarga <= 0) {
      return NextResponse.json(
        { error: 'Harga per Kg untuk jenis sampah ini belum diatur' },
        { status: 400 }
      );
    }

    const targetUserId = user.id;

    // 1. Buat transaksi
    const transaksi = await prisma.transaksi.create({
      data: {
        jenisSampah,
        berat: beratNum,
        hargaPerKg: hargaPerKg,
        totalHarga: totalHarga,
        userId: targetUserId,
      },
    });

    // 2. UPDATE SALDO PETUGAS
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        saldo: {
          increment: totalHarga,
        },
      },
    });

    // 3. Ambil saldo terbaru
    const updatedUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { saldo: true },
    });

    return NextResponse.json({
      transaksi,
      saldoBaru: updatedUser?.saldo || 0,
      pesan: `Saldo bertambah Rp ${totalHarga.toLocaleString()}`,
    }, { status: 201 });
  } catch (error) {
    console.error('Error POST /api/transaksi:', error);
    return NextResponse.json({ error: 'Gagal buat transaksi' }, { status: 500 });
  }
}