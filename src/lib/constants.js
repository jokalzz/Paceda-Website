export const APP_NAME = 'Smart Kelurahan Paceda';
export const APP_DESCRIPTION = 'Sistem Pelayanan Digital Kelurahan Paceda, Kecamatan Maesa, Kota Bitung';

export const KELURAHAN_INFO = {
  nama: 'Kelurahan Paceda',
  kecamatan: 'Maesa',
  kota: 'Bitung',
  provinsi: 'Sulawesi Utara',
  kodePos: '95511',
  telepon: '(0438) 12345',
  email: 'kelurahan.paceda@bitungkota.go.id',
  alamat: 'Jl. Paceda, Kec. Maesa, Kota Bitung, Sulawesi Utara',
  latitude: 1.4477,
  longitude: 125.1932,
};

export const STATUS_SURAT = {
  menunggu: { label: 'Menunggu Verifikasi', color: 'warning', icon: 'Clock' },
  diproses: { label: 'Sedang Diproses', color: 'info', icon: 'Loader' },
  ditolak: { label: 'Ditolak', color: 'danger', icon: 'XCircle' },
  disetujui: { label: 'Disetujui', color: 'success', icon: 'CheckCircle' },
  selesai: { label: 'Selesai', color: 'success', icon: 'CheckCircle2' },
};

export const KATEGORI_PETA = {
  kantor: { label: 'Kantor Kelurahan', color: '#1E40AF', icon: 'Building2' },
  posyandu: { label: 'Posyandu', color: '#DC2626', icon: 'HeartPulse' },
  sekolah: { label: 'Sekolah', color: '#F59E0B', icon: 'GraduationCap' },
  ibadah: { label: 'Tempat Ibadah', color: '#7C3AED', icon: 'Church' },
  balai: { label: 'Balai Pertemuan', color: '#059669', icon: 'Landmark' },
  umkm: { label: 'UMKM', color: '#EA580C', icon: 'Store' },
  fasilitas: { label: 'Fasilitas Umum', color: '#0891B2', icon: 'TreePine' },
};

export const NAV_LINKS = [
  { label: 'Beranda', path: '/', icon: 'Home' },
  { label: 'Pengajuan Surat', path: '/pengajuan-surat', icon: 'FileText', auth: true },
  { label: 'Status Surat', path: '/status-surat', icon: 'ClipboardList', auth: true },
  { label: 'Pengumuman', path: '/pengumuman', icon: 'Megaphone' },
  { label: 'Tentang Paceda', path: '/tentang', icon: 'Info' },
  { label: 'Peta Digital', path: '/peta-digital', icon: 'Map' },
];

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
  { label: 'Kelola Surat', path: '/admin/surat', icon: 'FileStack' },
  { label: 'Kelola Pengumuman', path: '/admin/pengumuman', icon: 'Newspaper' },
  { label: 'Kelola Peta', path: '/admin/peta', icon: 'MapPinned' },
];
