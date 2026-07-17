# ⚡ Quick Start - Setup Supabase

## 🎯 Checklist 5 Langkah Cepat

### ✅ Langkah 1: Buat Akun & Project (5 menit)
1. Buka https://supabase.com
2. Klik "Sign Up" → Login dengan GitHub/Email
3. Klik "New Project"
4. Isi form:
   - **Name:** Smart Kelurahan Paceda
   - **Password:** [buat password kuat & CATAT!]
   - **Region:** Southeast Asia (Singapore)
5. Klik "Create Project" → Tunggu 2-3 menit

### ✅ Langkah 2: Copy Credentials (1 menit)
1. Klik "Settings" (ikon ⚙️) → "API"
2. Copy dan simpan:
   ```
   Project URL: https://xxxxx.supabase.co
   anon key: eyJhbGci........
   ```
3. Simpan di notepad/file aman

### ✅ Langkah 3: Setup Database (2 menit)
1. Klik "SQL Editor" di sidebar
2. Klik "New Query"
3. Buka file `supabase/migrations/001_initial_schema.sql`
4. Copy SELURUH isi file → Paste ke SQL Editor
5. Klik "Run" (atau Ctrl+Enter)
6. Tunggu sampai muncul "Success"

### ✅ Langkah 4: Verifikasi Tables (1 menit)
1. Klik "Table Editor" di sidebar
2. Cek 5 tables sudah ada:
   - ✅ profiles
   - ✅ jenis_surat (ada 8 data)
   - ✅ pengajuan_surat
   - ✅ pengumuman (ada 3 data)
   - ✅ lokasi_peta (ada 7 data)

### ✅ Langkah 5: Setup Storage (3 menit)
1. Klik "Storage" di sidebar
2. Buat 5 buckets (klik "New bucket"):
   
   **Bucket 1:**
   - Name: `avatars`
   - Public: ✅ CENTANG
   
   **Bucket 2:**
   - Name: `berkas-surat`
   - Public: ❌ JANGAN
   
   **Bucket 3:**
   - Name: `surat-pdf`
   - Public: ❌ JANGAN
   
   **Bucket 4:**
   - Name: `pengumuman`
   - Public: ✅ CENTANG
   
   **Bucket 5:**
   - Name: `lokasi-foto`
   - Public: ✅ CENTANG

---

## 📝 Konfigurasi Project

### Buat File .env
Di root folder project, buat file `.env`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci........
```

**Ganti dengan credentials Anda!**

### Install & Run
```bash
npm install
npm run dev
```

### Test Register
1. Buka http://localhost:5173
2. Klik "Daftar"
3. Isi form → Submit
4. Cek di Supabase → Authentication → Users
5. User baru harus muncul! ✅

---

## 🎉 Done!

**Database siap digunakan!** 

Buka file berikut untuk panduan lengkap:
- 📘 `SUPABASE_SETUP_GUIDE.md` - Panduan detail step by step
- 🗄️ `DATABASE_STRUCTURE.md` - Penjelasan struktur database

---

## 🆘 Troubleshooting Cepat

**Error saat Run SQL?**
→ Copy paste ulang dari awal sampai akhir

**Tables tidak muncul?**
→ Refresh halaman Table Editor

**Website error "Supabase client not initialized"?**
→ Cek file `.env` dan restart server

**Butuh bantuan lebih?**
→ Baca `SUPABASE_SETUP_GUIDE.md` bagian Troubleshooting
