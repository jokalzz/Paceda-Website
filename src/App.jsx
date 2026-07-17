import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PageLoader } from './components/common/LoadingSpinner';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import PengajuanSuratPage from './pages/public/PengajuanSuratPage';
import StatusSuratPage from './pages/public/StatusSuratPage';
import PengumumanPage from './pages/public/PengumumanPage';
import PengumumanDetailPage from './pages/public/PengumumanDetailPage';
import TentangPage from './pages/public/TentangPage';
import PetaDigitalPage from './pages/public/PetaDigitalPage';
import ProfilPage from './pages/public/ProfilPage';

// User Pages
import UserDashboardPage from './pages/user/DashboardPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import KelolaSuratPage from './pages/admin/KelolaSuratPage';
import KelolaPengumumanPage from './pages/admin/KelolaPengumumanPage';
import KelolaPetaPage from './pages/admin/KelolaPetaPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading, profile } = useAuth();
  if (loading) return <PageLoader />;
  if (!user || profile?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth Pages (No Layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
            <Route index element={<UserDashboardPage />} />
          </Route>

          {/* Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pengajuan-surat" element={<ProtectedRoute><PengajuanSuratPage /></ProtectedRoute>} />
            <Route path="/status-surat" element={<ProtectedRoute><StatusSuratPage /></ProtectedRoute>} />
            <Route path="/pengumuman" element={<PengumumanPage />} />
            <Route path="/pengumuman/:id" element={<PengumumanDetailPage />} />
            <Route path="/tentang" element={<TentangPage />} />
            <Route path="/peta-digital" element={<PetaDigitalPage />} />
            <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
          </Route>

          {/* Admin Pages */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="surat" element={<KelolaSuratPage />} />
            <Route path="pengumuman" element={<KelolaPengumumanPage />} />
            <Route path="peta" element={<KelolaPetaPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
