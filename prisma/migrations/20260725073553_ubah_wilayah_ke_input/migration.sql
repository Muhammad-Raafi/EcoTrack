/*
  Warnings:

  - You are about to drop the column `namaWilayah` on the `Wilayah` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nama]` on the table `Wilayah` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nama` to the `Wilayah` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Wilayah_namaWilayah_key";

-- AlterTable
ALTER TABLE "Wilayah" DROP COLUMN "namaWilayah",
ADD COLUMN     "nama" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wilayah_nama_key" ON "Wilayah"("nama");
