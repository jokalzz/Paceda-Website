# 📊 User Dashboard Guide - Smart Kelurahan Paceda

## Overview

User Dashboard adalah halaman utama yang tampil **setelah user login**. Dashboard ini menampilkan:
- Statistik pengajuan surat
- Riwayat pengajuan terbaru
- Akses cepat ke fitur-fitur penting
- Profil user
- Pengumuman terbaru

---

## 🎯 Fitur-Fitur Dashboard

### 1. Header Hero Section
**Apa yang ditampilkan:**
- Salam selamat datang dengan nama user
- Statistik quick info (jumlah surat menunggu)
- Desain yang menarik dengan gradient background

**Fungsi:**
- Memberikan greeting yang personal
- Quick overview status terbaru

---

### 2. Statistics Cards (6 Stat Cards)
**Menampilkan:**
1. **Total** - Total semua pengajuan surat
2. **Menunggu** - Surat yang masih menunggu verifikasi
3. **Diproses** - Surat yang sedang diproses admin
4. **Ditolak** - Surat yang ditolak admin
5. **Disetujui** - Surat yang sudah disetujui
6. **Selesai** - Surat yang sudah selesai

**Warna Status:**
- Total: 🔵 Blue
- Menunggu: 🟡 Yellow
- Diproses: 🩵 Cyan
- Ditolak: 🔴 Red
- Disetujui: 🟢 Green
- Selesai: 🟣 Purple

**Interaksi:**
- Card hover akan scale up (membesar)
- Responsive di semua device

---

### 3. Quick Actions (4 Tombol)
**Akses Cepat ke:**
1. **Ajukan Surat Baru** → Ke halaman pengajuan surat
2. **Cek Status Surat** → Ke halaman status surat
3. **Profil Saya** → Ke halaman profil user
4. **Peta Digital** → Ke halaman peta digital

**Keuntungan:**
- User tidak perlu navigasi panjang untuk akses fitur
- Semua fitur utama ada di satu tempat

---

### 4. Recent Pengajuan (Riwayat Terbaru)
**Menampilkan:**
- Daftar 5 pengajuan surat terbaru
- Nama jenis surat
- Tanggal pengajuan
- Status surat dengan badge warna
- Icon untuk setiap status

**Fitur:**
- Dapat di-click untuk melihat detail
- Loading state saat fetch data
- Empty state jika belum ada pengajuan
- "Lihat Semua" link ke halaman status surat

**Status yang Ditampilkan:**
- ⏳ Menunggu Verifikasi
- ⚙️ Sedang Diproses
- ❌ Ditolak
- ✅ Disetujui
- 🎉 Selesai

---

### 5. Profile Card (Sidebar)
**Informasi:**
- Avatar dengan initial nama user
- Nama lengkap
- Email

**Action:**
- Tombol "Edit Profil" untuk update info

---

### 6. Pengumuman Terbaru (Sidebar)
**Fitur:**
- 3 pengumuman terbaru dari kelurahan
- Dapat di-click untuk baca full
- Menampilkan tanggal pengumuman
- Link "Lihat Semua Pengumuman"

---

### 7. Help Card (Sidebar)
**Konten:**
- Informasi bantuan
- Contact phone number
- Tombol hubungi kami

---

## 🔄 Data Flow

```
User Login (LoginPage)
        ↓
Credentials validated (Supabase Auth)
        ↓
Redirect ke /dashboard
        ↓
UserLayout render
        ↓
DashboardPage load
        ↓
Fetch data dari Supabase:
  • pengajuan_surat (status count)
  • pengajuan_surat (recent 5)
  • pengumuman (published, limit 3)
        ↓
Display data di UI
```

---

## 💾 Database Queries

### Query 1: Get Pengajuan Status Count
```javascript
const { data: pengajuanData } = await supabase
  .from('pengajuan_surat')
  .select('status')
  .eq('user_id', user.id);
```

**Hasil:** Array dengan semua pengajuan user
**Digunakan untuk:** Calculate stats (total, menunggu, diproses, dll)

### Query 2: Get Recent Pengajuan
```javascript
const { data: recent } = await supabase
  .from('pengajuan_surat')
  .select(`
    id,
    status,
    submitted_at,
    jenis_surat_id,
    jenis_surat (nama)
  `)
  .eq('user_id', user.id)
  .order('submitted_at', { ascending: false })
  .limit(5);
```

**Hasil:** 5 pengajuan terbaru dengan join ke jenis_surat
**Digunakan untuk:** Display recent pengajuan list

### Query 3: Get Pengumuman
```javascript
const { data: announcements } = await supabase
  .from('pengumuman')
  .select('*')
  .eq('is_published', true)
  .order('tanggal', { ascending: false })
  .limit(3);
```

**Hasil:** 3 pengumuman published terbaru
**Digunakan untuk:** Display pengumuman sidebar

---

## 📱 Responsive Design

### Mobile (< 640px)
- Header: Single column, nama lebih kecil
- Stats: 2 kolom grid
- Layout: Single column
- Font: Lebih kecil (text-xs, text-sm)

### Tablet (640px - 1024px)
- Header: Info & stats side-by-side
- Stats: 3 kolom grid
- Layout: 2 column (content + sidebar)
- Font: Medium (text-sm, text-base)

### Desktop (> 1024px)
- Header: Full layout dengan background blur
- Stats: 6 kolom grid
- Layout: Full 3 column (main + sidebar)
- Font: Larger (text-base, text-lg)

---

## 🎨 Design Pattern

### Colors
- **Primary**: Blue (hover, active)
- **Warning**: Yellow/Amber (menunggu)
- **Info**: Cyan (diproses)
- **Error**: Red (ditolak)
- **Success**: Green (disetujui)
- **Info**: Purple (selesai)

### Spacing
- Mobile: p-3, p-4
- Tablet: p-4, p-5
- Desktop: p-5, p-6

### Typography
- **Header**: text-2xl sm:text-3xl lg:text-4xl
- **Title**: text-base sm:text-lg
- **Body**: text-xs sm:text-sm
- **Helper**: text-[10px] sm:text-xs

### Components
- Card: Rounded-xl, shadow-sm hover:shadow-md
- Badge: Inline-flex dengan icon
- Button: Responsive size, fullWidth di mobile
- Hover Effects: Scale, color change, shadow

---

## 🔐 Security

### Row Level Security (RLS)
- User hanya bisa lihat pengajuan sendiri (`user_id = auth.uid()`)
- User tidak bisa update/delete pengajuan
- Admin bisa view/update semua pengajuan

### Protected Route
```javascript
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

- Dashboard hanya bisa diakses setelah login
- Non-authenticated users akan redirect ke login

---

## 📊 State Management

### Component State
```javascript
const [pengajuanStats, setPengajuanStats] = useState({
  total: 0,
  menunggu: 0,
  diproses: 0,
  ditolak: 0,
  disetujui: 0,
  selesai: 0,
});
const [recentPengajuan, setRecentPengajuan] = useState([]);
const [pengumuman, setPengumuman] = useState([]);
const [loading, setLoading] = useState(true);
```

### Global State (from Context)
```javascript
const { user, profile } = useAuth();
```

- `user`: Dari Supabase Auth
- `profile`: Dari table profiles (full_name, role, dll)

---

## 🔄 Real-time Updates (Optional)

Untuk menampilkan data real-time (update tanpa refresh):

```javascript
// Subscribe to pengajuan changes
useEffect(() => {
  const subscription = supabase
    .from('pengajuan_surat')
    .on('*', payload => {
      console.log('Change received!', payload)
      // Update state
      fetchData();
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

---

## 🚀 Performance Optimizations

1. **Lazy Loading Images**
   - Gunakan component `<LazyImage />`
   - Images load hanya saat visible

2. **Memoization**
   - Card components bisa di-memoize dengan `React.memo()`
   - Prevent unnecessary re-renders

3. **Query Optimization**
   - Select hanya field yang dibutuhkan
   - Use `limit()` untuk pagination
   - Use `order()` untuk sorting

4. **Loading States**
   - Spinner saat data fetching
   - Empty state jika data kosong
   - Skeleton screens (optional)

---

## 📋 File Structure

```
src/
├── pages/
│   ├── public/
│   │   └── LoginPage.jsx (updated)
│   └── user/
│       └── DashboardPage.jsx (NEW)
├── components/
│   └── layout/
│       └── UserLayout.jsx (NEW)
└── App.jsx (updated with /dashboard route)
```

---

## ✨ Future Enhancements

1. **Statistics Chart**
   - Graph showing pengajuan trends
   - Monthly/yearly comparison

2. **Export Data**
   - Export riwayat surat ke PDF
   - Download pengajuan details

3. **Notifications**
   - Real-time notifications
   - Email reminders
   - Push notifications

4. **Quick Summary**
   - Total waktu rata-rata diproses
   - Success rate statistics
   - Recommended next action

5. **Calendar View**
   - Visual timeline pengajuan
   - Important dates highlight

---

## 🎓 Testing Checklist

- [ ] Login dengan user biasa → redirect ke /dashboard
- [ ] Admin user → masih bisa akses /dashboard
- [ ] Admin dapat akses /admin juga
- [ ] Stats cards menampilkan data benar
- [ ] Recent pengajuan list tampil benar
- [ ] Click pengajuan card → bisa navigate
- [ ] Pengumuman sidebar tampil
- [ ] Click pengumuman → navigate ke detail
- [ ] Edit Profil button → ke profil page
- [ ] Responsive di mobile/tablet/desktop
- [ ] Loading state saat fetch data
- [ ] Empty state saat belum ada data
- [ ] Error handling jika query gagal

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
1. Check Database yang sudah dibuat
2. Verify Supabase credentials di `.env`
3. Check console browser untuk error messages
4. Baca dokumentasi SUPABASE_SETUP_GUIDE.md

---

Dibuat dengan ❤️ untuk Smart Kelurahan Paceda
