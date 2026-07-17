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
            >
              Selamat Datang{' '}
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300">
                {profile?.full_name || 'User'}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 text-blue-100/80"
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
                className="mt-4 sm:mt-6 inline-flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
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