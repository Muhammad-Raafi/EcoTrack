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
    const wilayah = await prisma.wilayah.findMany();
    return NextResponse.json(wilayah);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal ambil data wilayah' }, { status: 500 });
  }
}