-- AlterTable
ALTER TABLE "JenisSampah" ADD COLUMN     "kategoriId" TEXT;

-- AlterTable
ALTER TABLE "LaporanSampah" ADD COLUMN     "statusId" TEXT;

-- CreateTable
CREATE TABLE "Kategori" (
    "id" TEXT NOT NULL,
    "namaKategori" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kendaraan" (
    "id" TEXT NOT NULL,
    "platNomor" TEXT NOT NULL,
    "jenisKendaraan" TEXT NOT NULL,
    "kapasitas" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Kendaraan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusLaporan" (
    "id" TEXT NOT NULL,
    "namaStatus" TEXT NOT NULL,

    CONSTRAINT "StatusLaporan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatAktivitas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aksi" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiwayatAktivitas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_namaKategori_key" ON "Kategori"("namaKategori");

-- CreateIndex
CREATE UNIQUE INDEX "Kendaraan_platNomor_key" ON "Kendaraan"("platNomor");

-- CreateIndex
CREATE UNIQUE INDEX "StatusLaporan_namaStatus_key" ON "StatusLaporan"("namaStatus");

-- AddForeignKey
ALTER TABLE "JenisSampah" ADD CONSTRAINT "JenisSampah_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusLaporan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatAktivitas" ADD CONSTRAINT "RiwayatAktivitas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
