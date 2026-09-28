import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const petugas = await prisma.user.findMany({
      where: { role: 'petugas' },
      orderBy: { nama: 'asc' },
    });
    return NextResponse.json(petugas);
  } catch (error) {
    console.error('Error GET petugas:', error);
    return NextResponse.json({ error: 'Gagal ambil data petugas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, email, noHp, password } = body;

    if (!nama || !email || !noHp || !password) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nama,
        email,
        noHp,
        password: hashedPassword,
        role: 'petugas',
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error POST petugas:', error);
    return NextResponse.json({ error: 'Gagal tambah petugas' }, { status: 500 });
  }
}