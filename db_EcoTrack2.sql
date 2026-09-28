--
-- PostgreSQL database dump
--

\restrict sQVpp25BNnVnTRaqhtLJqDP6LyQrw4bObTfYRguJ6unn2bCinDVA2bL9NUbAjww

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-08-24 19:40:31

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 61889)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 61936)
-- Name: FotoSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FotoSampah" (
    id text NOT NULL,
    "imageUrl" text NOT NULL,
    "laporanId" text NOT NULL
);


ALTER TABLE public."FotoSampah" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 61904)
-- Name: JenisSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JenisSampah" (
    id text NOT NULL,
    "namaJenis" text NOT NULL,
    "kategoriId" text
);


ALTER TABLE public."JenisSampah" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 61946)
-- Name: Kategori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Kategori" (
    id text NOT NULL,
    "namaKategori" text NOT NULL,
    deskripsi text
);


ALTER TABLE public."Kategori" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 61955)
-- Name: Kendaraan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Kendaraan" (
    id text NOT NULL,
    "platNomor" text NOT NULL,
    "jenisKendaraan" text NOT NULL,
    kapasitas double precision NOT NULL
);


ALTER TABLE public."Kendaraan" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 61922)
-- Name: LaporanSampah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LaporanSampah" (
    id text NOT NULL,
    berat double precision NOT NULL,
    "tanggalLapor" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "jenisSampahId" text NOT NULL,
    "wilayahId" text NOT NULL,
    "statusId" text
);


ALTER TABLE public."LaporanSampah" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 61975)
-- Name: Notifikasi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notifikasi" (
    id text NOT NULL,
    "userId" text NOT NULL,
    pesan text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notifikasi" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 61989)
-- Name: RiwayatAktivitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RiwayatAktivitas" (
    id text NOT NULL,
    "userId" text NOT NULL,
    aksi text NOT NULL,
    detail text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RiwayatAktivitas" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 61966)
-- Name: StatusLaporan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StatusLaporan" (
    id text NOT NULL,
    "namaStatus" text NOT NULL
);


ALTER TABLE public."StatusLaporan" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 62001)
-- Name: Transaksi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaksi" (
    id text NOT NULL,
    "jenisSampah" text NOT NULL,
    berat double precision NOT NULL,
    "hargaPerKg" double precision NOT NULL,
    "totalHarga" double precision NOT NULL,
    tanggal timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Transaksi" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 61890)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    nama text NOT NULL,
    email text NOT NULL,
    "noHp" text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'petugas'::text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 61913)
-- Name: Wilayah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wilayah" (
    id text NOT NULL,
    nama text NOT NULL
);


ALTER TABLE public."Wilayah" OWNER TO postgres;

--
-- TOC entry 5047 (class 0 OID 61936)
-- Dependencies: 223
-- Data for Name: FotoSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FotoSampah" (id, "imageUrl", "laporanId") FROM stdin;
660a55c3-1410-4376-8cdd-1f3446491349	/uploads/1787570933767-Sampah plastik.jpg	1985aebe-57da-4735-8408-cd262085c451
8eecb6fd-ec70-4a37-9b6c-c8355184bad9	/uploads/1787571040738-Sampah koran.jpg	5ac84371-233a-42e7-a619-6e646378c27f
4317a8e6-e1ac-4515-8837-b79a8186f3c0	/uploads/1787571140359-Sampah kaleng minumanjpg.jpg	c664215a-3f59-46cf-bba5-e52a4a9d1ee3
dddb0ac2-0737-4610-aff7-61f53f390c9f	/uploads/1787571247491-Sampah sisa sayuran.jpg	fbc298c0-9851-414d-8d33-d56665991299
cbb378fa-74fb-4a70-945e-89806ba12612	/uploads/1787571334874-Sampah botol plastik.jpg	e76d06ae-082a-45dd-af80-bb7fa0f865e1
\.


--
-- TOC entry 5044 (class 0 OID 61904)
-- Dependencies: 220
-- Data for Name: JenisSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JenisSampah" (id, "namaJenis", "kategoriId") FROM stdin;
ec4eced4-809c-47d7-9d39-183e6765c3ee	Organik	\N
e2b3c3ae-0b32-4de3-aea4-6278308b98f8	Anorganik	\N
a84424a6-c36c-460f-8cd1-262804687bdb	Plastik	\N
53ee555a-58ee-412a-9758-0a7f33100b8a	Kertas	\N
3815bba2-f2a2-4a72-8b1c-87239e0e3427	Logam	\N
\.


--
-- TOC entry 5048 (class 0 OID 61946)
-- Dependencies: 224
-- Data for Name: Kategori; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kategori" (id, "namaKategori", deskripsi) FROM stdin;
67e804d3-ce8f-44d1-b4a7-50e3abceac51	Sampah Rumah Tangga	Sampah yang dihasilkan dari aktivitas rumah tangga
\.


--
-- TOC entry 5049 (class 0 OID 61955)
-- Dependencies: 225
-- Data for Name: Kendaraan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kendaraan" (id, "platNomor", "jenisKendaraan", kapasitas) FROM stdin;
feaebf57-740d-4357-8ac1-1e3e9ba53f3b	B 1234 XYZ	Truck Sampah	5000
\.


--
-- TOC entry 5046 (class 0 OID 61922)
-- Dependencies: 222
-- Data for Name: LaporanSampah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LaporanSampah" (id, berat, "tanggalLapor", "userId", "jenisSampahId", "wilayahId", "statusId") FROM stdin;
1985aebe-57da-4735-8408-cd262085c451	3	2026-08-24 11:28:54.213	d5865629-8701-48ae-9ed6-5f08b387431d	e2b3c3ae-0b32-4de3-aea4-6278308b98f8	ec9ad048-f6d7-4b98-8424-fa5cd95c6a28	\N
5ac84371-233a-42e7-a619-6e646378c27f	1	2026-08-24 11:30:40.99	d5865629-8701-48ae-9ed6-5f08b387431d	53ee555a-58ee-412a-9758-0a7f33100b8a	71eeec96-2202-4457-bb70-a78bde08fe9f	\N
c664215a-3f59-46cf-bba5-e52a4a9d1ee3	1	2026-08-24 11:32:20.63	599479d4-4642-43a3-994d-e65066b3024b	3815bba2-f2a2-4a72-8b1c-87239e0e3427	efc34d36-ce45-49a0-8841-641acdf98502	\N
fbc298c0-9851-414d-8d33-d56665991299	5	2026-08-24 11:34:07.782	6c3ce824-c93a-4025-985c-9a59f127f551	ec4eced4-809c-47d7-9d39-183e6765c3ee	75bf4762-d0ed-49fa-8ec3-d4cbfc8d2bbe	\N
e76d06ae-082a-45dd-af80-bb7fa0f865e1	2	2026-08-24 11:35:35.146	db43802d-a621-464b-8412-9cc7e4562432	a84424a6-c36c-460f-8cd1-262804687bdb	e2da0324-5aba-4f46-a8f6-48db7f0cde2c	\N
\.


--
-- TOC entry 5051 (class 0 OID 61975)
-- Dependencies: 227
-- Data for Name: Notifikasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notifikasi" (id, "userId", pesan, "isRead", "createdAt") FROM stdin;
704b53f7-8039-48da-bbbe-5a74f294c9c6	a017320b-5060-485b-83aa-ad06a451d6b7	Selamat datang di aplikasi EcoTrack!	f	2026-08-07 12:48:34.776
\.


--
-- TOC entry 5052 (class 0 OID 61989)
-- Dependencies: 228
-- Data for Name: RiwayatAktivitas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RiwayatAktivitas" (id, "userId", aksi, detail, "createdAt") FROM stdin;
4a40f667-99ad-45c8-8681-6323d8f7501a	a017320b-5060-485b-83aa-ad06a451d6b7	SEED_DATABASE	Admin berhasil melakukan seeding database awal.	2026-08-07 12:48:34.779
\.


--
-- TOC entry 5050 (class 0 OID 61966)
-- Dependencies: 226
-- Data for Name: StatusLaporan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StatusLaporan" (id, "namaStatus") FROM stdin;
b2e9484e-f657-43e7-b9b1-7f7ee1fa0b21	Baru
0b96ce30-f740-43da-a327-ac05c941971f	Sedang Diproses
5d1ef682-2df2-4a2b-a742-76fcb7bef750	Selesai
\.


--
-- TOC entry 5053 (class 0 OID 62001)
-- Dependencies: 229
-- Data for Name: Transaksi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaksi" (id, "jenisSampah", berat, "hargaPerKg", "totalHarga", tanggal, "userId") FROM stdin;
8eb65dc2-f270-40a5-b86f-aa156f9aacef	plastik	2	13000	26000	2026-08-24 11:54:14.044	db43802d-a621-464b-8412-9cc7e4562432
\.


--
-- TOC entry 5043 (class 0 OID 61890)
-- Dependencies: 219
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, nama, email, "noHp", password, role) FROM stdin;
a017320b-5060-485b-83aa-ad06a451d6b7	Admin Sekolah	admin@sekolah.com	081234567890	$2b$10$P8CpnF5pdzBD2E2FBXiTf.xzoSVCXWyWz71zMf4wlfWbWCBI2mS3a	admin
599479d4-4642-43a3-994d-e65066b3024b	Petugas 1	petugas1@sekolah.com	081234567891	$2b$10$P8CpnF5pdzBD2E2FBXiTf.xzoSVCXWyWz71zMf4wlfWbWCBI2mS3a	petugas
6c3ce824-c93a-4025-985c-9a59f127f551	Petugas 2	petugas2@sekolah.com	081234567892	$2b$10$P8CpnF5pdzBD2E2FBXiTf.xzoSVCXWyWz71zMf4wlfWbWCBI2mS3a	petugas
d5865629-8701-48ae-9ed6-5f08b387431d	Petugas 3	petugas3@sekolah.com	081234567893	$2b$10$P8CpnF5pdzBD2E2FBXiTf.xzoSVCXWyWz71zMf4wlfWbWCBI2mS3a	petugas
db43802d-a621-464b-8412-9cc7e4562432	Petugas 4	petugas4@sekolah.com	081234567894	$2b$10$P8CpnF5pdzBD2E2FBXiTf.xzoSVCXWyWz71zMf4wlfWbWCBI2mS3a	petugas
\.


--
-- TOC entry 5045 (class 0 OID 61913)
-- Dependencies: 221
-- Data for Name: Wilayah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wilayah" (id, nama) FROM stdin;
75bf4762-d0ed-49fa-8ec3-d4cbfc8d2bbe	Jl. Pegangsaan 5, Jakarta Barat
e2da0324-5aba-4f46-a8f6-48db7f0cde2c	Jl. Undar Selatan, Jakarta Timur
efc34d36-ce45-49a0-8841-641acdf98502	Jl. Pasar Mutiara, Jakarta Pusat
71eeec96-2202-4457-bb70-a78bde08fe9f	Jl. Duri, Jakarta Pusat
ec9ad048-f6d7-4b98-8424-fa5cd95c6a28	Jl. Petojo VIY V, Jakarta Pusat
\.


--
-- TOC entry 4871 (class 2606 OID 61945)
-- Name: FotoSampah FotoSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_pkey" PRIMARY KEY (id);


--
-- TOC entry 4860 (class 2606 OID 61912)
-- Name: JenisSampah JenisSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JenisSampah"
    ADD CONSTRAINT "JenisSampah_pkey" PRIMARY KEY (id);


--
-- TOC entry 4874 (class 2606 OID 61954)
-- Name: Kategori Kategori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kategori"
    ADD CONSTRAINT "Kategori_pkey" PRIMARY KEY (id);


--
-- TOC entry 4876 (class 2606 OID 61965)
-- Name: Kendaraan Kendaraan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kendaraan"
    ADD CONSTRAINT "Kendaraan_pkey" PRIMARY KEY (id);


--
-- TOC entry 4866 (class 2606 OID 61935)
-- Name: LaporanSampah LaporanSampah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_pkey" PRIMARY KEY (id);


--
-- TOC entry 4882 (class 2606 OID 61988)
-- Name: Notifikasi Notifikasi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifikasi"
    ADD CONSTRAINT "Notifikasi_pkey" PRIMARY KEY (id);


--
-- TOC entry 4884 (class 2606 OID 62000)
-- Name: RiwayatAktivitas RiwayatAktivitas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RiwayatAktivitas"
    ADD CONSTRAINT "RiwayatAktivitas_pkey" PRIMARY KEY (id);


--
-- TOC entry 4880 (class 2606 OID 61974)
-- Name: StatusLaporan StatusLaporan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StatusLaporan"
    ADD CONSTRAINT "StatusLaporan_pkey" PRIMARY KEY (id);


--
-- TOC entry 4886 (class 2606 OID 62015)
-- Name: Transaksi Transaksi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaksi"
    ADD CONSTRAINT "Transaksi_pkey" PRIMARY KEY (id);


--
-- TOC entry 4857 (class 2606 OID 61903)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4863 (class 2606 OID 61921)
-- Name: Wilayah Wilayah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wilayah"
    ADD CONSTRAINT "Wilayah_pkey" PRIMARY KEY (id);


--
-- TOC entry 4869 (class 1259 OID 62023)
-- Name: FotoSampah_laporanId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FotoSampah_laporanId_key" ON public."FotoSampah" USING btree ("laporanId");


--
-- TOC entry 4858 (class 1259 OID 62018)
-- Name: JenisSampah_namaJenis_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JenisSampah_namaJenis_key" ON public."JenisSampah" USING btree ("namaJenis");


--
-- TOC entry 4872 (class 1259 OID 62024)
-- Name: Kategori_namaKategori_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Kategori_namaKategori_key" ON public."Kategori" USING btree ("namaKategori");


--
-- TOC entry 4877 (class 1259 OID 62025)
-- Name: Kendaraan_platNomor_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Kendaraan_platNomor_key" ON public."Kendaraan" USING btree ("platNomor");


--
-- TOC entry 4864 (class 1259 OID 62021)
-- Name: LaporanSampah_jenisSampahId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LaporanSampah_jenisSampahId_idx" ON public."LaporanSampah" USING btree ("jenisSampahId");


--
-- TOC entry 4867 (class 1259 OID 62020)
-- Name: LaporanSampah_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LaporanSampah_userId_idx" ON public."LaporanSampah" USING btree ("userId");


--
-- TOC entry 4868 (class 1259 OID 62022)
-- Name: LaporanSampah_wilayahId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LaporanSampah_wilayahId_idx" ON public."LaporanSampah" USING btree ("wilayahId");


--
-- TOC entry 4878 (class 1259 OID 62026)
-- Name: StatusLaporan_namaStatus_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StatusLaporan_namaStatus_key" ON public."StatusLaporan" USING btree ("namaStatus");


--
-- TOC entry 4854 (class 1259 OID 62016)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4855 (class 1259 OID 62017)
-- Name: User_noHp_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_noHp_key" ON public."User" USING btree ("noHp");


--
-- TOC entry 4861 (class 1259 OID 62019)
-- Name: Wilayah_nama_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Wilayah_nama_key" ON public."Wilayah" USING btree (nama);


--
-- TOC entry 4892 (class 2606 OID 62052)
-- Name: FotoSampah FotoSampah_laporanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FotoSampah"
    ADD CONSTRAINT "FotoSampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES public."LaporanSampah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4887 (class 2606 OID 62027)
-- Name: JenisSampah JenisSampah_kategoriId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JenisSampah"
    ADD CONSTRAINT "JenisSampah_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES public."Kategori"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4888 (class 2606 OID 62037)
-- Name: LaporanSampah LaporanSampah_jenisSampahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES public."JenisSampah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4889 (class 2606 OID 62047)
-- Name: LaporanSampah LaporanSampah_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."StatusLaporan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4890 (class 2606 OID 62032)
-- Name: LaporanSampah LaporanSampah_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4891 (class 2606 OID 62042)
-- Name: LaporanSampah LaporanSampah_wilayahId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LaporanSampah"
    ADD CONSTRAINT "LaporanSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES public."Wilayah"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4893 (class 2606 OID 62057)
-- Name: Notifikasi Notifikasi_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifikasi"
    ADD CONSTRAINT "Notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4894 (class 2606 OID 62062)
-- Name: RiwayatAktivitas RiwayatAktivitas_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RiwayatAktivitas"
    ADD CONSTRAINT "RiwayatAktivitas_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4895 (class 2606 OID 62067)
-- Name: Transaksi Transaksi_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaksi"
    ADD CONSTRAINT "Transaksi_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-08-24 19:40:32

--
-- PostgreSQL database dump complete
--

\unrestrict sQVpp25BNnVnTRaqhtLJqDP6LyQrw4bObTfYRguJ6unn2bCinDVA2bL9NUbAjww

