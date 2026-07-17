import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle2, XCircle, Download, TrendingUp,
  MapPin, Megaphone, User, Settings, ArrowRight, Calendar,
  Bell, Sparkles, Star, Home, Users, Heart, Phone, Info
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatDate';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function UserDashboardPage() {
  const { user, profile } = useAuth();
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

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    try {
      setLoading(true);

      // Fetch pengajuan stats
      const { data: pengajuanData } = await supabase
        .from('pengajuan_surat')
        .select('status')
        .eq('user_id', user.id);

      if (pengajuanData) {
        const stats = {
          total: pengajuanData.length,
          menunggu: pengajuanData.filter(p => p.status === 'menunggu').length,
          diproses: pengajuanData.filter(p => p.status === 'diproses').length,
          ditolak: pengajuanData.filter(p => p.status === 'ditolak').length,
          disetujui: pengajuanData.filter(p => p.status === 'disetujui').length,
          selesai: pengajuanData.filter(p => p.status === 'selesai').length,
        };
        setPengajuanStats(stats);
      }

      // Fetch recent pengajuan
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

      if (recent) setRecentPengajuan(recent);

      // Fetch pengumuman terbaru
      const { data: announcements } = await supabase
        .from('pengumuman')
        .select('*')
        .eq('is_published', true)
        .order('tanggal', { ascending: false })
        .limit(3);

      if (announcements) setPengumuman(announcements);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'menunggu': return Clock;
      case 'diproses': return TrendingUp;
      case 'ditolak': return XCircle;
      case 'disetujui': return CheckCircle2;
      case 'selesai': return Download;
      default: return FileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'menunggu': return 'from-yellow-500 to-yellow-600';
      case 'diproses': return 'from-blue-500 to-blue-600';
      case 'ditolak': return 'from-red-500 to-red-600';
      case 'disetujui': return 'from-emerald-500 to-emerald-600';
      case 'selesai': return 'from-violet-500 to-violet-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (user?.email) {
      // Extract name from email (before @)
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitial = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return <LoadingSpinner text="Memuat dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Header */}
      <section className="relative py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-blue-300 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 sm:w-64 sm:h-64 bg-emerald-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 sm:w-36 sm:h-36 bg-violet-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Greeting Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {getCurrentGreeting()}
            </motion.div>

            {/* Main Greeting */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4"
            >
              Selamat Datang{' '}
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300">
                {getUserDisplayName()}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 text-blue-100/80 mb-4"
            >
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Smart Kelurahan Paceda</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-blue-300/50" />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </motion.div>

            {/* Status Info */}
            {pengajuanStats.menunggu > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-medium">
                    {pengajuanStats.menunggu} surat menunggu verifikasi
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Stats Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12"
        >
          {[
            { label: 'Total', value: pengajuanStats.total, icon: FileText, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
            { label: 'Menunggu', value: pengajuanStats.menunggu, icon: Clock, color: 'from-yellow-500 to-yellow-600', shadow: 'shadow-yellow-500/20' },
            { label: 'Diproses', value: pengajuanStats.diproses, icon: TrendingUp, color: 'from-cyan-500 to-cyan-600', shadow: 'shadow-cyan-500/20' },
            { label: 'Ditolak', value: pengajuanStats.ditolak, icon: XCircle, color: 'from-red-500 to-red-600', shadow: 'shadow-red-500/20' },
            { label: 'Disetujui', value: pengajuanStats.disetujui, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
            { label: 'Selesai', value: pengajuanStats.selesai, icon: Download, color: 'from-violet-500 to-violet-600', shadow: 'shadow-violet-500/20' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} variants={item}>
                <Card padding="p-4 sm:p-5" className="text-center group hover:scale-105 transition-all duration-300">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-1">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{stat.label}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Quick Actions */}
            <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    Akses Cepat
                  </CardTitle>
                  <CardDescription>Fitur yang paling sering digunakan</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Link to="/pengajuan-surat">
                    <Button variant="primary" fullWidth size="lg" iconRight={ArrowRight} className="justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Ajukan Surat Baru
                      </span>
                    </Button>
                  </Link>
                  <Link to="/status-surat">
                    <Button variant="outline" fullWidth size="lg" iconRight={ArrowRight} className="justify-between">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Cek Status Surat
                      </span>
                    </Button>
                  </Link>
                  <Link to="/profil">
                    <Button variant="outline" fullWidth size="lg" iconRight={User} className="justify-between">
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Profil Saya
                      </span>
                    </Button>
                  </Link>
                  <Link to="/peta-digital">
                    <Button variant="outline" fullWidth size="lg" iconRight={MapPin} className="justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Peta Digital
                      </span>
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Recent Pengajuan */}
            <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex items-center justify-between flex-row">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-600" />
                      Pengajuan Terbaru
                    </CardTitle>
                    <CardDescription>Riwayat pengajuan surat Anda</CardDescription>
                  </div>
                  <Link to="/status-surat" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold whitespace-nowrap ml-4 flex items-center gap-1">
                    Lihat Semua <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardHeader>
                
                {loading ? (
                  <div className="py-8 text-center text-slate-500">
                    <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                    <p className="text-sm mt-2">Memuat data...</p>
                  </div>
                ) : recentPengajuan.length > 0 ? (
                  <div className="space-y-3">
                    {recentPengajuan.map((pengajuan, index) => {
                      const StatusIcon = getStatusIcon(pengajuan.status);
                      return (
                        <motion.div
                          key={pengajuan.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getStatusColor(pengajuan.status)} flex items-center justify-center shrink-0 shadow-md`}>
                              <StatusIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {pengajuan.jenis_surat?.nama || 'Surat'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatDate(pengajuan.submitted_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Badge status={pengajuan.status} size="sm" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-600 mb-2">Belum ada pengajuan</h3>
                    <p className="text-sm text-slate-500 mb-4">Mulai ajukan surat pertama Anda</p>
                    <Link to="/pengajuan-surat">
                      <Button variant="primary" size="sm" iconRight={ArrowRight}>
                        Ajukan Surat Sekarang
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6 sm:space-y-8">
            {/* Profile Card */}
            <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Card className="text-center hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-3xl font-bold">
                    {getUserInitial()}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">
                  {getUserDisplayName()}
                </h3>
                <p className="text-xs text-slate-500 mb-2 truncate">{user?.email}</p>
                {profile?.nik && (
                  <p className="text-xs text-slate-400 mb-4">NIK: {profile.nik}</p>
                )}
                <Link to="/profil" className="w-full inline-block">
                  <Button variant="outline" fullWidth size="sm" className="justify-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profil
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Pengumuman */}
            <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-amber-600" />
                    <span>Pengumuman</span>
                  </CardTitle>
                </CardHeader>
                
                {pengumuman.length > 0 ? (
                  <div className="space-y-3">
                    {pengumuman.map((p, index) => (
                      <Link key={p.id} to={`/pengumuman/${p.id}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
                        >
                          <p className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-amber-700 transition-colors mb-1">
                            {p.judul}
                          </p>
                          <p className="text-xs text-slate-400">{formatDate(p.tanggal)}</p>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Tidak ada pengumuman</p>
                  </div>
                )}
                
                <Link to="/pengumuman" className="inline-block mt-4 w-full">
                  <Button variant="outline" fullWidth size="sm" iconRight={ArrowRight}>
                    Lihat Semua Pengumuman
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Info Card */}
            <motion.div variants={item} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-2">Butuh Bantuan?</h4>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    Tim admin Kelurahan Paceda siap membantu Anda
                  </p>
                  <div className="space-y-2">
                    <a href="tel:+62821234567" className="block">
                      <Button variant="primary" size="sm" fullWidth>
                        <Phone className="w-4 h-4 mr-2" />
                        Hubungi Kami
                      </Button>
                    </a>
                    <Link to="/tentang" className="block">
                      <Button variant="outline" size="sm" fullWidth>
                        <Info className="w-4 h-4 mr-2" />
                        Info Kelurahan
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
