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
    const totalLaporan = await prisma.laporanSampah.count();

    const beratAggregate = await prisma.laporanSampah.aggregate({
      _sum: { berat: true },
    });
    const totalBerat = beratAggregate._sum.berat || 0;

    const totalWilayah = await prisma.wilayah.count();

    const totalPetugas = await prisma.user.count({
      where: { role: 'petugas' },
    });

    // Total per Bulan (6 bulan terakhir)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const totalPerBulanRaw = await prisma.$queryRaw<{ bulan: string; total: number; totalBerat: number }[]>`
      SELECT 
        TO_CHAR("tanggalLapor", 'YYYY-MM') as bulan,
        COUNT(*) as total,
        COALESCE(SUM(berat), 0) as "totalBerat"
      FROM "LaporanSampah"
      WHERE "tanggalLapor" >= ${sixMonthsAgo}
      GROUP BY TO_CHAR("tanggalLapor", 'YYYY-MM')
      ORDER BY bulan DESC
    `;

    const totalPerBulan = totalPerBulanRaw.map((item) => ({
      bulan: item.bulan,
      total: Number(item.total),
      totalBerat: Number(item.totalBerat),
    }));

    const jenisStats = await prisma.laporanSampah.groupBy({
      by: ['jenisSampahId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    });

    let jenisSampahTerbanyak = null;
    if (jenisStats.length > 0) {
      const jenis = await prisma.jenisSampah.findUnique({
        where: { id: jenisStats[0].jenisSampahId },
      });
      jenisSampahTerbanyak = {
        nama: jenis?.namaJenis || 'Tidak diketahui',
        total: jenisStats[0]._count.id,
      };
    }

    const wilayahStats = await prisma.laporanSampah.groupBy({
      by: ['wilayahId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1,
    });

    let wilayahTerbanyak = null;
    if (wilayahStats.length > 0) {
      const wilayah = await prisma.wilayah.findUnique({
        where: { id: wilayahStats[0].wilayahId },
      });
      wilayahTerbanyak = {
        nama: wilayah?.nama || 'Tidak diketahui',
        total: wilayahStats[0]._count.id,
      };
    }

    const totalPerJenisRaw = await prisma.laporanSampah.groupBy({
      by: ['jenisSampahId'],
      _count: { id: true },
      _sum: { berat: true },
    });

    const totalPerJenis = await Promise.all(
      totalPerJenisRaw.map(async (item) => {
        const jenis = await prisma.jenisSampah.findUnique({
          where: { id: item.jenisSampahId },
        });
        return {
          nama: jenis?.namaJenis || 'Tidak diketahui',
          total: item._count.id,
          totalBerat: item._sum.berat || 0,
        };
      })
    );

    return NextResponse.json({
      totalLaporan,
      totalBerat,
      totalWilayah,
      totalPetugas,
      totalPerBulan,
      jenisSampahTerbanyak,
      wilayahTerbanyak,
      totalPerJenis,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Gagal ambil data dashboard' }, { status: 500 });
  }
}