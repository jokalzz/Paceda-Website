# 📘 Panduan Setup Supabase untuk Smart Kelurahan Paceda

## Daftar Isi
1. [Persiapan](#1-persiapan)
2. [Membuat Project Supabase](#2-membuat-project-supabase)
3. [Setup Database Schema](#3-setup-database-schema)
4. [Setup Storage Buckets](#4-setup-storage-buckets)
5. [Konfigurasi Environment Variables](#5-konfigurasi-environment-variables)
6. [Testing Koneksi](#6-testing-koneksi)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Persiapan

### Yang Dibutuhkan:
- ✅ Email aktif (Gmail, atau email lainnya)
- ✅ Browser (Chrome, Firefox, Edge, atau Safari)
- ✅ Koneksi internet

### Akses Website Supabase:
1. Buka browser Anda
2. Kunjungi: **https://supabase.com**
3. Klik tombol **"Start your project"** atau **"Sign Up"**

---

## 2. Membuat Project Supabase

### Langkah 2.1: Sign Up / Login

**Jika belum punya akun:**
1. Klik **"Sign Up"**
2. Pilih metode sign up:
   - **GitHub** (recommended) - klik "Continue with GitHub"
   - **Email** - masukkan email dan password

**Jika sudah punya akun:**
1. Klik **"Sign In"**
2. Login dengan akun yang sudah dibuat

### Langkah 2.2: Membuat Organization (Opsional)
Setelah login, Anda akan diminta membuat organization:
1. Masukkan nama organization: **"Smart Kelurahan"** atau nama lainnya
2. Klik **"Create organization"**

### Langkah 2.3: Membuat Project Baru
1. Di dashboard, klik tombol **"New project"**
2. Isi form berikut:

   ```
   Name: Smart Kelurahan Paceda
   Database Password: [Buat password yang kuat, CATAT PASSWORD INI!]
   Region: Southeast Asia (Singapore)
   Pricing Plan: Free (untuk development)
   ```

3. Klik **"Create new project"**
4. **⏳ Tunggu 2-3 menit** sampai project selesai dibuat (ada loading indicator)

### Langkah 2.4: Menyimpan Credentials
Setelah project selesai dibuat:
1. Di dashboard project, klik **"Settings"** (ikon gear) di sidebar kiri
2. Klik **"API"** di submenu
3. Catat informasi berikut di notepad:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJ....... (key yang panjang)
   service_role key: eyJhbGciOiJ....... (key yang panjang, JANGAN SHARE!)
   ```

**⚠️ PENTING:** Simpan informasi ini dengan aman, Anda akan membutuhkannya nanti!

---

## 3. Setup Database Schema

### Langkah 3.1: Masuk ke SQL Editor
1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik tombol **"New query"**

### Langkah 3.2: Copy & Paste Schema
1. Buka file `supabase/migrations/001_initial_schema.sql` di project Anda
2. **Copy SELURUH isi file** (Ctrl+A lalu Ctrl+C)
3. **Paste** ke SQL Editor Supabase (Ctrl+V)

### Langkah 3.3: Jalankan Query
1. Klik tombol **"Run"** (atau tekan Ctrl+Enter)
2. Tunggu sampai selesai (akan muncul "Success" di bawah)
3. Jika ada error, lihat bagian [Troubleshooting](#7-troubleshooting)

### Langkah 3.4: Verifikasi Tables Sudah Dibuat
1. Di sidebar kiri, klik **"Table Editor"**
2. Anda seharusnya melihat 5 tables:
   - ✅ profiles
   - ✅ jenis_surat
   - ✅ pengajuan_surat
   - ✅ pengumuman
   - ✅ lokasi_peta

3. Klik salah satu table untuk melihat isinya
4. Table `jenis_surat` seharusnya sudah ada 8 data (jenis surat)
5. Table `pengumuman` seharusnya sudah ada 3 data contoh
6. Table `lokasi_peta` seharusnya sudah ada 7 data contoh lokasi

---

## 4. Setup Storage Buckets

Storage buckets digunakan untuk menyimpan file seperti avatar, dokumen, dan foto.

### Langkah 4.1: Membuat Buckets
1. Di sidebar kiri, klik **"Storage"**
2. Klik tombol **"Create a new bucket"**

### Langkah 4.2: Bucket 1 - Avatars (Public)
```
Name: avatars
Public bucket: ✅ CENTANG (karena avatar bisa dilihat publik)
```
Klik **"Create bucket"**

### Langkah 4.3: Bucket 2 - Berkas Surat (Private)
```
Name: berkas-surat
Public bucket: ❌ JANGAN DICENTANG (dokumen pribadi)
```
Klik **"Create bucket"**

### Langkah 4.4: Bucket 3 - Surat PDF (Private)
```
Name: surat-pdf
Public bucket: ❌ JANGAN DICENTANG (dokumen pribadi)
```
Klik **"Create bucket"**

### Langkah 4.5: Bucket 4 - Pengumuman (Public)
```
Name: pengumuman
Public bucket: ✅ CENTANG (foto pengumuman bisa dilihat publik)
```
Klik **"Create bucket"**

### Langkah 4.6: Bucket 5 - Lokasi Foto (Public)
```
Name: lokasi-foto
Public bucket: ✅ CENTANG (foto lokasi di peta bisa dilihat publik)
```
Klik **"Create bucket"**

### Langkah 4.7: Verifikasi Storage
Setelah selesai, Anda seharusnya punya 5 buckets:
- ✅ avatars (public)
- ✅ berkas-surat (private)
- ✅ surat-pdf (private)
- ✅ pengumuman (public)
- ✅ lokasi-foto (public)

### Langkah 4.8: Setup Storage Policies (Opsional tapi Disarankan)

Untuk setiap bucket **PRIVATE**, kita perlu set policy:

1. Klik bucket **"berkas-surat"**
2. Klik tab **"Policies"**
3. Klik **"New policy"**
4. Pilih template **"Allow users to read their own files"**
5. Klik **"Use this template"**
6. Klik **"Review"** dan **"Save policy"**

Ulangi langkah yang sama untuk bucket:
- `surat-pdf`

---

## 5. Konfigurasi Environment Variables

### Langkah 5.1: Buat File .env
1. Di root folder project Anda, buat file baru bernama `.env`
2. Copy template dari file `.env.example` jika ada

### Langkah 5.2: Isi Environment Variables
Buka file `.env` dan isi dengan data dari Supabase:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

# App Configuration (Opsional)
VITE_APP_NAME=Smart Kelurahan Paceda
VITE_APP_URL=http://localhost:5173
```

**Ganti:**
- `xxxxxxxxxxxxx` dengan Project URL Anda
- `eyJhbG...` dengan anon public key Anda

### Langkah 5.3: Simpan File
1. Simpan file `.env` (Ctrl+S)
2. **JANGAN COMMIT** file `.env` ke Git! (Sudah ada di `.gitignore`)

---

## 6. Testing Koneksi

### Langkah 6.1: Install Dependencies
Buka terminal dan jalankan:
```bash
npm install
```

### Langkah 6.2: Jalankan Development Server
```bash
npm run dev
```

### Langkah 6.3: Test di Browser
1. Buka browser dan akses: `http://localhost:5173`
2. Website seharusnya loading tanpa error

### Langkah 6.4: Test Register
1. Klik **"Daftar"** atau **"Register"**
2. Isi form registrasi:
   ```
   Nama Lengkap: Test User
   Email: test@example.com
   Password: password123
   ```
3. Klik **"Daftar"**
4. Jika berhasil, Anda akan redirect ke halaman home

### Langkah 6.5: Verifikasi di Supabase
1. Buka Supabase dashboard
2. Klik **"Authentication"** di sidebar
3. Klik **"Users"**
4. Anda seharusnya melihat user baru yang baru saja dibuat!

### Langkah 6.6: Verifikasi Profile
1. Klik **"Table Editor"**
2. Klik table **"profiles"**
3. Anda seharusnya melihat profile user baru dengan:
   - full_name: Test User
   - email: test@example.com
   - role: user

**🎉 SELAMAT! Database Supabase Anda sudah berhasil ter-setup!**

---

## 7. Troubleshooting

### Error: "Failed to create project"
**Solusi:**
- Pastikan internet stabil
- Coba refresh halaman
- Pastikan menggunakan browser terbaru
- Clear cache browser

### Error: "Database password is incorrect"
**Solusi:**
- Pastikan Anda mencatat password yang benar saat membuat project
- Tidak bisa direset, harus buat project baru jika lupa

### Error: "Failed to execute query"
**Solusi:**
- Pastikan copy paste SQL schema lengkap dari awal sampai akhir
- Pastikan tidak ada typo
- Jalankan query satu per satu untuk menemukan error

### Error: "anon key is invalid"
**Solusi:**
- Pastikan copy anon key dengan benar (jangan ada spasi di awal/akhir)
- Pastikan tidak tercampur dengan service_role key
- Restart development server setelah update `.env`

### Tables Tidak Muncul di Table Editor
**Solusi:**
1. Refresh halaman Table Editor
2. Check di SQL Editor, jalankan query:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```
3. Jika masih kosong, ulangi setup database schema

### Storage Buckets Tidak Bisa Upload
**Solusi:**
1. Pastikan bucket sudah dibuat
2. Check policies di bucket
3. Untuk private bucket, pastikan user sudah login
4. Check file size (max 50MB untuk free plan)

### Website Error: "Supabase client not initialized"
**Solusi:**
1. Pastikan file `.env` ada di root folder
2. Pastikan format `.env` benar (lihat contoh di atas)
3. Restart development server (Ctrl+C lalu `npm run dev` lagi)

### Email Confirmation Tidak Terkirim
**Solusi:**
1. Buka Supabase Dashboard
2. Klik **"Authentication"** → **"Email Templates"**
3. Edit template sesuai kebutuhan
4. Atau disable email confirmation:
   - Klik **"Authentication"** → **"Settings"**
   - Toggle OFF **"Enable email confirmations"**

---

## 8. Next Steps - Setelah Setup Berhasil

### 8.1. Buat Admin User
Secara default, semua user yang register akan punya role `user`. Untuk membuat admin:

1. Buka Supabase dashboard
2. Klik **"Table Editor"** → **"profiles"**
3. Klik user yang ingin dijadikan admin
4. Edit kolom `role` dari `user` menjadi `admin`
5. Klik **"Save"**

### 8.2. Test Fitur-Fitur
Login sebagai admin dan test:
- ✅ Pengajuan surat
- ✅ Status surat
- ✅ Pengumuman
- ✅ Peta digital
- ✅ Admin dashboard (hanya untuk admin)

### 8.3. Customize Data
1. Edit jenis surat sesuai kebutuhan kelurahan
2. Update lokasi peta dengan koordinat real
3. Hapus data contoh pengumuman
4. Tambah pengumuman real

### 8.4. Setup Email (Opsional)
Untuk production, setup custom SMTP:
1. Klik **"Settings"** → **"Auth"**
2. Scroll ke **"SMTP Settings"**
3. Isi dengan SMTP provider (Gmail, SendGrid, dll)

---

## 📞 Butuh Bantuan?

### Resources:
- 📚 [Supabase Documentation](https://supabase.com/docs)
- 💬 [Supabase Discord Community](https://discord.supabase.com)
- 🎥 [Supabase YouTube Tutorials](https://www.youtube.com/c/supabase)

### Common Issues:
- Jika ada error di website, check console browser (F12)
- Jika ada error di Supabase, check logs di dashboard
- Jika stuck, coba buat project baru dan ulangi dari awal

---

## ✅ Checklist Setup

Gunakan checklist ini untuk memastikan semua sudah ter-setup:

- [ ] Akun Supabase sudah dibuat
- [ ] Project Supabase sudah dibuat
- [ ] Database schema sudah dijalankan
- [ ] 5 tables berhasil dibuat (profiles, jenis_surat, pengajuan_surat, pengumuman, lokasi_peta)
- [ ] Data contoh sudah ada di tables
- [ ] 5 storage buckets sudah dibuat (avatars, berkas-surat, surat-pdf, pengumuman, lokasi-foto)
- [ ] File `.env` sudah dibuat dan diisi
- [ ] Development server bisa jalan tanpa error
- [ ] Test register berhasil
- [ ] User baru muncul di Supabase Authentication
- [ ] Profile user baru muncul di table profiles
- [ ] Minimal 1 admin user sudah dibuat

---

**🎊 Selamat! Database Supabase Anda siap digunakan!**

Dibuat dengan ❤️ untuk Smart Kelurahan Paceda
