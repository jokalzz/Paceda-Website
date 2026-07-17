-- ============================================
-- SMART KELURAHAN PACEDA - Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  nik TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. JENIS SURAT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jenis_surat (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  deskripsi TEXT,
  icon TEXT,
  persyaratan JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE jenis_surat ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Anyone can view jenis surat" ON jenis_surat
  FOR SELECT TO authenticated, anon
  USING (true);

-- Only admin can modify
CREATE POLICY "Admin can manage jenis surat" ON jenis_surat
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 3. PENGAJUAN SURAT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pengajuan_surat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  jenis_surat_id INT NOT NULL REFERENCES jenis_surat(id),
  status TEXT DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'diproses', 'ditolak', 'disetujui', 'selesai')),
  keterangan_tambahan TEXT,
  alasan_penolakan TEXT,
  surat_pdf_url TEXT,
  berkas_upload JSONB DEFAULT '[]',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE pengajuan_surat ENABLE ROW LEVEL SECURITY;

-- User can see own submissions
CREATE POLICY "Users can view own pengajuan" ON pengajuan_surat
  FOR SELECT USING (auth.uid() = user_id);

-- User can create submission
CREATE POLICY "Users can create pengajuan" ON pengajuan_surat
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin can view all
CREATE POLICY "Admin can view all pengajuan" ON pengajuan_surat
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can update
CREATE POLICY "Admin can update pengajuan" ON pengajuan_surat
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 4. PENGUMUMAN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pengumuman (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  foto_url TEXT,
  created_by UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT TRUE,
  tanggal DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;

-- Everyone can view published
CREATE POLICY "Anyone can view published pengumuman" ON pengumuman
  FOR SELECT TO authenticated, anon
  USING (is_published = true);

-- Admin can manage
CREATE POLICY "Admin can manage pengumuman" ON pengumuman
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 5. LOKASI PETA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lokasi_peta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama TEXT NOT NULL,
  kategori TEXT NOT NULL CHECK (kategori IN ('kantor', 'posyandu', 'sekolah', 'ibadah', 'balai', 'umkm', 'fasilitas')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  foto_url TEXT,
  deskripsi TEXT,
  alamat TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lokasi_peta ENABLE ROW LEVEL SECURITY;

-- Everyone can view
CREATE POLICY "Anyone can view lokasi" ON lokasi_peta
  FOR SELECT TO authenticated, anon
  USING (true);

-- Admin can manage
CREATE POLICY "Admin can manage lokasi" ON lokasi_peta
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pengumuman_updated_at
  BEFORE UPDATE ON pengumuman
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lokasi_peta_updated_at
  BEFORE UPDATE ON lokasi_peta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA - Jenis Surat
-- ============================================
INSERT INTO jenis_surat (nama, deskripsi, icon, persyaratan) VALUES
(
  'Surat Keterangan Domisili',
  'Surat yang menerangkan tempat tinggal/domisili seseorang di wilayah Kelurahan Paceda.',
  'Home',
  '["KTP asli dan fotokopi", "Kartu Keluarga (KK) asli dan fotokopi", "Surat Pengantar RT/RW", "Pas foto 3x4 (2 lembar)"]'
),
(
  'Surat Keterangan Usaha',
  'Surat keterangan untuk keperluan usaha/bisnis yang berdomisili di Kelurahan Paceda.',
  'Briefcase',
  '["KTP asli dan fotokopi", "Kartu Keluarga (KK) fotokopi", "Surat Pengantar RT/RW", "Foto lokasi usaha", "Surat pernyataan usaha"]'
),
(
  'Surat Keterangan Tidak Mampu',
  'Surat keterangan bagi warga yang tergolong kurang mampu untuk keperluan bantuan sosial atau pendidikan.',
  'Heart',
  '["KTP asli dan fotokopi", "Kartu Keluarga (KK) fotokopi", "Surat Pengantar RT/RW", "Surat pernyataan tidak mampu", "Foto rumah tampak depan"]'
),
(
  'Surat Pengantar KTP',
  'Surat pengantar untuk pembuatan atau perpanjangan Kartu Tanda Penduduk (KTP).',
  'CreditCard',
  '["Kartu Keluarga (KK) asli dan fotokopi", "Surat Pengantar RT/RW", "Pas foto 3x4 (3 lembar)", "KTP lama (jika perpanjangan)"]'
),
(
  'Surat Pengantar KK',
  'Surat pengantar untuk pembuatan atau perubahan Kartu Keluarga (KK).',
  'Users',
  '["KTP asli dan fotokopi semua anggota keluarga", "KK lama (jika perubahan)", "Surat Pengantar RT/RW", "Akta nikah/cerai (jika ada perubahan)", "Akta kelahiran anggota baru (jika penambahan)"]'
),
(
  'Surat Keterangan Belum Menikah',
  'Surat keterangan yang menyatakan bahwa seseorang belum pernah menikah.',
  'HeartOff',
  '["KTP asli dan fotokopi", "Kartu Keluarga (KK) fotokopi", "Surat Pengantar RT/RW", "Pas foto 3x4 (2 lembar)", "Surat pernyataan belum menikah bermaterai"]'
),
(
  'Surat Keterangan Pindah',
  'Surat keterangan pindah domisili dari Kelurahan Paceda ke wilayah lain.',
  'MapPin',
  '["KTP asli dan fotokopi", "Kartu Keluarga (KK) asli dan fotokopi", "Surat Pengantar RT/RW", "Surat pernyataan pindah", "Pas foto 3x4 (4 lembar)"]'
),
(
  'Surat Keterangan Kelahiran',
  'Surat keterangan kelahiran untuk bayi yang lahir di wilayah Kelurahan Paceda.',
  'Baby',
  '["KTP orang tua asli dan fotokopi", "Kartu Keluarga (KK) fotokopi", "Surat keterangan lahir dari rumah sakit/bidan", "Akta nikah orang tua fotokopi", "Surat Pengantar RT/RW"]'
);

-- ============================================
-- SEED DATA - Lokasi Peta (Contoh)
-- ============================================
INSERT INTO lokasi_peta (nama, kategori, latitude, longitude, deskripsi, alamat) VALUES
('Kantor Kelurahan Paceda', 'kantor', 1.4477, 125.1932, 'Kantor pelayanan administrasi Kelurahan Paceda', 'Jl. Paceda, Kec. Maesa, Kota Bitung'),
('Posyandu Melati', 'posyandu', 1.4480, 125.1928, 'Posyandu untuk ibu dan anak di Lingkungan I', 'Lingkungan I, Kelurahan Paceda'),
('SD Negeri 1 Paceda', 'sekolah', 1.4475, 125.1940, 'Sekolah Dasar Negeri di Kelurahan Paceda', 'Jl. Paceda, Kec. Maesa, Kota Bitung'),
('Gereja GMIM Paceda', 'ibadah', 1.4473, 125.1935, 'Gereja GMIM di Kelurahan Paceda', 'Lingkungan II, Kelurahan Paceda'),
('Balai Pertemuan Paceda', 'balai', 1.4479, 125.1930, 'Balai pertemuan warga Kelurahan Paceda', 'Jl. Paceda, Kec. Maesa, Kota Bitung'),
('Warung Makan Bu Ina', 'umkm', 1.4482, 125.1925, 'Warung makan khas Manado milik Bu Ina', 'Lingkungan III, Kelurahan Paceda'),
('Lapangan Olahraga Paceda', 'fasilitas', 1.4476, 125.1938, 'Lapangan olahraga serbaguna warga Paceda', 'Lingkungan I, Kelurahan Paceda');

-- ============================================
-- SEED DATA - Pengumuman (Contoh)
-- ============================================
INSERT INTO pengumuman (judul, isi, is_published, tanggal) VALUES
(
  'Jadwal Kerja Bakti Bulanan',
  'Diberitahukan kepada seluruh warga Kelurahan Paceda bahwa akan diadakan kerja bakti bulanan pada hari Sabtu, pukul 07.00 WITA. Diharapkan partisipasi seluruh warga untuk menjaga kebersihan lingkungan.',
  true,
  CURRENT_DATE
),
(
  'Jadwal Posyandu Bulan Ini',
  'Posyandu Melati akan dilaksanakan pada hari Rabu minggu kedua setiap bulan. Mohon para ibu yang memiliki balita untuk hadir membawa buku KIA. Pelayanan meliputi penimbangan, imunisasi, dan konsultasi gizi.',
  true,
  CURRENT_DATE - INTERVAL '2 days'
),
(
  'Pelayanan Administrasi Libur Nasional',
  'Diberitahukan bahwa pelayanan administrasi Kelurahan Paceda akan diliburkan pada tanggal merah nasional. Pelayanan akan kembali normal pada hari kerja berikutnya. Terima kasih atas pengertiannya.',
  true,
  CURRENT_DATE - INTERVAL '5 days'
);

-- ============================================
-- STORAGE BUCKETS (Run in Supabase Dashboard)
-- ============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('berkas-surat', 'berkas-surat', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('surat-pdf', 'surat-pdf', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('pengumuman', 'pengumuman', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('lokasi-foto', 'lokasi-foto', true);
