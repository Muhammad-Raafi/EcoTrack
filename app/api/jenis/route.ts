import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const jenis = await prisma.jenisSampah.findMany({
      orderBy: {
        namaJenis: 'asc',
      },
    });
    return NextResponse.json(jenis);
  } catch (error) {
    console.error('Error GET /api/jenis:', error);
    return NextResponse.json({ error: 'Gagal ambil data jenis sampah' }, { status: 500 });
  }
}