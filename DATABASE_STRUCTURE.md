# 🗄️ Struktur Database Smart Kelurahan Paceda

## 📊 Database Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SMART KELURAHAN PACEDA DATABASE                  │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   auth.users         │         │   profiles           │
│  (Supabase Auth)     │─────────│   (Public Schema)    │
├──────────────────────┤    1:1  ├──────────────────────┤
│ • id (UUID)          │◄────────│ • id (UUID) PK/FK    │
│ • email              │         │ • full_name          │
│ • created_at         │         │ • nik (UNIQUE)       │
│ • role               │         │ • email              │
└──────────────────────┘         │ • phone              │
                                 │ • avatar_url         │
                                 │ • role (user/admin)  │
                                 │ • created_at         │
                                 │ • updated_at         │
                                 └──────────────────────┘
                                          │
                                          │ 1:N
                                          ▼
         ┌────────────────────────────────┴─────────────────────────────────┐
         │                                                                   │
         │                                                                   │
┌────────▼────────────┐  ┌────────────────────┐  ┌────────────────────┐  ┌──▼──────────────┐
│ pengajuan_surat     │  │ pengumuman         │  │ lokasi_peta        │  │ jenis_surat     │
├─────────────────────┤  ├────────────────────┤  ├────────────────────┤  ├─────────────────┤
│ • id (UUID) PK      │  │ • id (UUID) PK     │  │ • id (UUID) PK     │  │ • id (SERIAL) PK│
│ • user_id FK        │  │ • judul            │  │ • nama             │  │ • nama          │
│ • jenis_surat_id FK │◄─│ • isi              │  │ • kategori         │  │ • deskripsi     │
│ • status            │  │ • foto_url         │  │ • latitude         │  │ • icon          │
│ • keterangan        │  │ • created_by FK    │  │ • longitude        │  │ • persyaratan   │
│ • alasan_penolakan  │  │ • is_published     │  │ • foto_url         │  │ • is_active     │
│ • surat_pdf_url     │  │ • tanggal          │  │ • deskripsi        │  │ • created_at    │
│ • berkas_upload     │  │ • created_at       │  │ • alamat           │  └─────────────────┘
│ • submitted_at      │  │ • updated_at       │  │ • created_by FK    │
│ • processed_at      │  └────────────────────┘  │ • created_at       │
│ • completed_at      │                          │ • updated_at       │
│ • processed_by FK   │                          └────────────────────┘
└─────────────────────┘
```

---

## 📋 Penjelasan Setiap Table

### 1. **auth.users** (Built-in Supabase)
**Deskripsi:** Table bawaan Supabase untuk menyimpan data autentikasi user

**Columns:**
- `id`: UUID unik untuk setiap user
- `email`: Email user untuk login
- `encrypted_password`: Password ter-enkripsi
- `email_confirmed_at`: Waktu konfirmasi email
- `created_at`: Waktu user dibuat

**Tidak perlu dibuat manual**, otomatis ada saat setup Supabase

---

### 2. **profiles**
**Deskripsi:** Menyimpan informasi profil detail user

**Columns:**
| Column | Type | Deskripsi |
|--------|------|-----------|
| `id` | UUID | Primary Key, sama dengan auth.users.id |
| `full_name` | TEXT | Nama lengkap user |
| `nik` | TEXT | Nomor Induk Kependudukan (UNIQUE) |
| `email` | TEXT | Email user |
| `phone` | TEXT | Nomor telepon |
| `avatar_url` | TEXT | URL foto profil |
| `role` | TEXT | Role user: 'user' atau 'admin' |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |
| `updated_at` | TIMESTAMPTZ | Waktu update terakhir |

**Relasi:**
- 1:1 dengan `auth.users`
- 1:N dengan `pengajuan_surat` (1 user bisa ajukan banyak surat)
- 1:N dengan `pengumuman` (1 admin bisa buat banyak pengumuman)
- 1:N dengan `lokasi_peta` (1 admin bisa buat banyak lokasi)

**Row Level Security (RLS):**
- User bisa view & update profil sendiri
- Admin bisa view semua profil

---

### 3. **jenis_surat**
**Deskripsi:** Master data jenis-jenis surat yang bisa diajukan

**Columns:**
| Column | Type | Deskripsi |
|--------|------|-----------|
| `id` | SERIAL | Primary Key (auto increment) |
| `nama` | TEXT | Nama jenis surat |
| `deskripsi` | TEXT | Deskripsi singkat |
| `icon` | TEXT | Nama icon (dari lucide-react) |
| `persyaratan` | JSONB | Array persyaratan (JSON) |
| `is_active` | BOOLEAN | Status aktif/nonaktif |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

**Data Default:** 8 jenis surat
1. Surat Keterangan Domisili
2. Surat Keterangan Usaha
3. Surat Keterangan Tidak Mampu
4. Surat Pengantar KTP
5. Surat Pengantar KK
6. Surat Keterangan Belum Menikah
7. Surat Keterangan Pindah
8. Surat Keterangan Kelahiran

**Row Level Security (RLS):**
- Semua orang bisa view (read-only untuk user)
- Hanya admin yang bisa manage (create/update/delete)

---

### 4. **pengajuan_surat**
**Deskripsi:** Menyimpan data pengajuan surat dari user

**Columns:**
| Column | Type | Deskripsi |
|--------|------|-----------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key ke profiles (siapa yang mengajukan) |
| `jenis_surat_id` | INT | Foreign Key ke jenis_surat (jenis apa) |
| `status` | TEXT | Status: menunggu, diproses, ditolak, disetujui, selesai |
| `keterangan_tambahan` | TEXT | Keterangan dari user |
| `alasan_penolakan` | TEXT | Alasan jika ditolak (dari admin) |
| `surat_pdf_url` | TEXT | Link download surat yang sudah jadi |
| `berkas_upload` | JSONB | Array file yang diupload user (JSON) |
| `submitted_at` | TIMESTAMPTZ | Waktu submit |
| `processed_at` | TIMESTAMPTZ | Waktu diproses admin |
| `completed_at` | TIMESTAMPTZ | Waktu selesai |
| `processed_by` | UUID | Foreign Key ke profiles (admin yang proses) |

**Relasi:**
- N:1 dengan `profiles` (user_id)
- N:1 dengan `jenis_surat` (jenis_surat_id)
- N:1 dengan `profiles` (processed_by)

**Row Level Security (RLS):**
- User bisa view pengajuan sendiri
- User bisa create pengajuan baru
- Admin bisa view & update semua pengajuan

---

### 5. **pengumuman**
**Deskripsi:** Menyimpan data pengumuman dari kelurahan

**Columns:**
| Column | Type | Deskripsi |
|--------|------|-----------|
| `id` | UUID | Primary Key |
| `judul` | TEXT | Judul pengumuman |
| `isi` | TEXT | Isi/konten pengumuman |
| `foto_url` | TEXT | Link foto pengumuman (opsional) |
| `created_by` | UUID | Foreign Key ke profiles (admin yang buat) |
| `is_published` | BOOLEAN | Status publish (true/false) |
| `tanggal` | DATE | Tanggal pengumuman |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |
| `updated_at` | TIMESTAMPTZ | Waktu update terakhir |

**Relasi:**
- N:1 dengan `profiles` (created_by)

**Row Level Security (RLS):**
- Semua orang bisa view pengumuman yang published
- Hanya admin yang bisa manage (create/update/delete)

---

### 6. **lokasi_peta**
**Deskripsi:** Menyimpan data lokasi untuk peta digital kelurahan

**Columns:**
| Column | Type | Deskripsi |
|--------|------|-----------|
| `id` | UUID | Primary Key |
| `nama` | TEXT | Nama lokasi |
| `kategori` | TEXT | Kategori: kantor, posyandu, sekolah, ibadah, balai, umkm, fasilitas |
| `latitude` | DOUBLE PRECISION | Koordinat latitude |
| `longitude` | DOUBLE PRECISION | Koordinat longitude |
| `foto_url` | TEXT | Link foto lokasi (opsional) |
| `deskripsi` | TEXT | Deskripsi lokasi |
| `alamat` | TEXT | Alamat lengkap |
| `created_by` | UUID | Foreign Key ke profiles (admin yang buat) |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |
| `updated_at` | TIMESTAMPTZ | Waktu update terakhir |

**Relasi:**
- N:1 dengan `profiles` (created_by)

**Row Level Security (RLS):**
- Semua orang bisa view lokasi
- Hanya admin yang bisa manage (create/update/delete)

---

## 🔐 Row Level Security (RLS) Summary

| Table | User (read) | User (write) | Admin (read) | Admin (write) |
|-------|-------------|--------------|--------------|---------------|
| profiles | Own only | Own only | All | All |
| jenis_surat | All | ❌ | All | All |
| pengajuan_surat | Own only | Create only | All | All |
| pengumuman | Published only | ❌ | All | All |
| lokasi_peta | All | ❌ | All | All |

---

## 📦 Storage Buckets

| Bucket Name | Public? | Digunakan Untuk |
|-------------|---------|-----------------|
| `avatars` | ✅ Yes | Foto profil user |
| `berkas-surat` | ❌ No | Dokumen persyaratan surat |
| `surat-pdf` | ❌ No | Surat hasil generate PDF |
| `pengumuman` | ✅ Yes | Foto pengumuman |
| `lokasi-foto` | ✅ Yes | Foto lokasi di peta |

**Storage Policies:**
- Public buckets: Semua orang bisa read, hanya owner/admin yang bisa upload
- Private buckets: Hanya owner dan admin yang bisa read/write

---

## 🔄 Database Triggers

### 1. **Auto-create Profile on Signup**
Trigger yang otomatis membuat record di table `profiles` saat user baru register.

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Cara Kerja:**
1. User register dengan email & password
2. Supabase buat record di `auth.users`
3. Trigger jalan otomatis
4. Function `handle_new_user()` buat record di `profiles`
5. Data di-copy dari `auth.users` ke `profiles`

### 2. **Auto-update updated_at**
Trigger yang otomatis update kolom `updated_at` saat data di-update.

**Berlaku untuk tables:**
- `profiles`
- `pengumuman`
- `lokasi_peta`

**Cara Kerja:**
1. User/admin update data di table
2. Trigger jalan otomatis
3. Kolom `updated_at` di-set ke waktu sekarang (NOW())

---

## 🎯 Query Examples

### Get User Profile
```sql
SELECT * FROM profiles WHERE id = 'user-uuid-here';
```

### Get All Jenis Surat Yang Aktif
```sql
SELECT * FROM jenis_surat WHERE is_active = true ORDER BY id;
```

### Get Pengajuan Surat User
```sql
SELECT 
  ps.*,
  js.nama as jenis_surat_nama,
  p.full_name as user_name
FROM pengajuan_surat ps
LEFT JOIN jenis_surat js ON ps.jenis_surat_id = js.id
LEFT JOIN profiles p ON ps.user_id = p.id
WHERE ps.user_id = 'user-uuid-here'
ORDER BY ps.submitted_at DESC;
```

### Get Pengumuman Terbaru
```sql
SELECT * FROM pengumuman 
WHERE is_published = true 
ORDER BY tanggal DESC 
LIMIT 5;
```

### Get Lokasi by Kategori
```sql
SELECT * FROM lokasi_peta 
WHERE kategori = 'posyandu' 
ORDER BY nama;
```

### Count Pengajuan by Status
```sql
SELECT 
  status,
  COUNT(*) as total
FROM pengajuan_surat
GROUP BY status;
```

---

## 🚀 Tips & Best Practices

### 1. Indexing
Untuk performa lebih baik, buat index di kolom yang sering di-query:

```sql
-- Index untuk search pengajuan by user
CREATE INDEX idx_pengajuan_user ON pengajuan_surat(user_id);

-- Index untuk filter by status
CREATE INDEX idx_pengajuan_status ON pengajuan_surat(status);

-- Index untuk search pengumuman by date
CREATE INDEX idx_pengumuman_tanggal ON pengumuman(tanggal DESC);
```

### 2. Soft Delete
Untuk data penting, gunakan soft delete daripada hard delete:

```sql
-- Tambah kolom deleted_at
ALTER TABLE pengajuan_surat ADD COLUMN deleted_at TIMESTAMPTZ;

-- Update query untuk exclude deleted data
SELECT * FROM pengajuan_surat WHERE deleted_at IS NULL;
```

### 3. Pagination
Selalu gunakan pagination untuk list data:

```javascript
const { data, error } = await supabase
  .from('pengumuman')
  .select('*')
  .range(0, 9) // Get 10 items (0-9)
  .order('tanggal', { ascending: false });
```

### 4. Backup Database
Jangan lupa backup database secara berkala:
- Supabase otomatis backup daily (free plan: 7 days retention)
- Untuk manual backup, gunakan SQL dump di dashboard

---

## 📖 Resources

- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

Dibuat dengan ❤️ untuk Smart Kelurahan Paceda
