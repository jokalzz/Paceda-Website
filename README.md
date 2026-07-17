# Smart Kelurahan Paceda

Sistem Pelayanan Digital Kelurahan Paceda, Kecamatan Maesa, Kota Bitung.

## Fitur
1. **Pengajuan Surat Online**: 8 jenis surat yang bisa diajukan secara online.
2. **Status Pengajuan**: Pantau progress surat (Menunggu, Diproses, Disetujui, Ditolak).
3. **Peta Digital**: Peta interaktif fasilitas Kelurahan Paceda (Leaflet + OpenStreetMap).
4. **Pengumuman**: Informasi terbaru seputar kegiatan kelurahan.
5. **Dashboard Admin**: Kelola surat, pengumuman, dan titik lokasi peta.

## Cara Menjalankan Website (Local Development)

### 1. Prasyarat
- Pastikan **Node.js** (versi 18+) sudah terinstall di komputer Anda.

### 2. Install Dependencies
Jika Anda baru pertama kali clone project ini, buka terminal di folder project dan jalankan:
```bash
npm install
```

### 3. Konfigurasi Environment (Supabase)
Website ini menggunakan Supabase untuk Database, Authentication, dan Storage.
1. Copy file `.env.example` menjadi `.env`
2. Isi nilai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dengan kredensial dari project Supabase Anda.
3. *Catatan: Jika Anda belum punya project Supabase, website tetap bisa berjalan dengan data dummy (placeholder).*

### 4. Jalankan Development Server
Di terminal, jalankan perintah berikut:
```bash
npm run dev
```
Setelah itu, buka browser dan akses URL yang muncul di terminal (biasanya `http://localhost:5173`).

## Setup Database (Supabase)
Jika Anda menggunakan Supabase Anda sendiri:
1. Masuk ke dashboard Supabase Anda.
2. Buka menu **SQL Editor**.
3. Copy isi dari file `supabase/migrations/001_initial_schema.sql`.
4. Paste ke SQL Editor dan tekan tombol **Run** untuk membuat semua tabel, RLS policy, trigger, dan seed data awal.
5. Untuk membuat akun Admin, daftar akun baru melalui halaman Register website, lalu ubah field `role` menjadi `admin` pada tabel `profiles` secara manual via Supabase Dashboard (Table Editor).

## Build untuk Production (Vercel)
Untuk melakukan build ke production:
```bash
npm run build
```
Project ini sudah dilengkapi dengan file `vercel.json` sehingga siap untuk langsung di-deploy ke Vercel (Pilih framework preset: Vite).
