import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileStack, Newspaper, MapPinned, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { formatDate, timeAgo } from '../../utils/formatDate';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, pengajuan: 0, selesai: 0, pengumuman: 0, lokasi: 0 });
  const [recentPengajuan, setRecentPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentPengajuan();
  }, []);

  async function fetchStats() {
    const [usersRes, pengajuanRes, selesaiRes, pengumumanRes, lokasiRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'user'),
      supabase.from('pengajuan_surat').select('id', { count: 'exact', head: true }),
      supabase.from('pengajuan_surat').select('id', { count: 'exact', head: true }).eq('status', 'selesai'),
      supabase.from('pengumuman').select('id', { count: 'exact', head: true }),
      supabase.from('lokasi_peta').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      users: usersRes.count || 0,
      pengajuan: pengajuanRes.count || 0,
      selesai: selesaiRes.count || 0,
      pengumuman: pengumumanRes.count || 0,
      lokasi: lokasiRes.count || 0,
    });
    setLoading(false);
  }

  async function fetchRecentPengajuan() {
    const { data } = await supabase
      .from('pengajuan_surat')
      .select('*, jenis_surat(nama), profiles:user_id(full_name)')
      .order('submitted_at', { ascending: false })
      .limit(5);
    if (data) setRecentPengajuan(data);
  }

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Total User', value: stats.users, icon: Users, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { label: 'Total Pengajuan', value: stats.pengajuan, icon: FileStack, color: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-500/20' },
    { label: 'Surat Selesai', value: stats.selesai, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
    { label: 'Pengumuman', value: stats.pengumuman, icon: Newspaper, color: 'from-violet-500 to-violet-600', shadow: 'shadow-violet-500/20' },
    { label: 'Lokasi Peta', value: stats.lokasi, icon: MapPinned, color: 'from-rose-500 to-rose-600', shadow: 'shadow-rose-500/20' },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Dashboard</h1>
        <p className="text-sm text-slate-500">Ringkasan data Kelurahan Paceda</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card padding="p-5" hover={false}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg ${stat.shadow}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Pengajuan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card padding="p-0">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Pengajuan Terbaru</h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-50">
            {recentPengajuan.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">Belum ada pengajuan.</p>
            ) : (
              recentPengajuan.map((p) => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {p.profiles?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-slate-400">{p.jenis_surat?.nama} • {timeAgo(p.submitted_at)}</p>
                  </div>
                  <Badge status={p.status} />
                </div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
