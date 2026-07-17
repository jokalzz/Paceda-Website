import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Map, Megaphone, Info, ArrowRight, Users,
  CheckCircle2, Clock, Shield, Home, Briefcase, Heart,
  CreditCard, HeartOff, MapPin, Baby, ChevronRight,
  Sparkles, Star,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  Home, Briefcase, Heart, CreditCard, Users, HeartOff, MapPin, Baby,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function AnimatedCounter({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString('id-ID')}{suffix}</span>;
}

export default function HomePage() {
  const { user } = useAuth();
  const [pengumuman, setPengumuman] = useState([]);
  const [jenisSurat, setJenisSurat] = useState([]);

  useEffect(() => {
    fetchPengumuman();
    fetchJenisSurat();
  }, []);

  async function fetchPengumuman() {
    const { data } = await supabase
      .from('pengumuman')
      .select('*')
      .eq('is_published', true)
      .order('tanggal', { ascending: false })
      .limit(3);
    if (data) setPengumuman(data);
  }

  async function fetchJenisSurat() {
    const { data } = await supabase
      .from('jenis_surat')
      .select('*')
      .eq('is_active', true)
      .order('id');
    if (data) setJenisSurat(data);
  }

  return (
    <div className="overflow-hidden">
      {/* ========== HERO BANNER ========== */}
      <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900" />
        {/* Simplified background for mobile performance */}
        <div className="absolute inset-0 opacity-10 hidden sm:block">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
        </div>
        {/* Grid pattern - desktop only */}
        <div className="absolute inset-0 opacity-5 hidden lg:block" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-100 text-xs font-medium mb-4 sm:mb-6"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Sistem Pelayanan Digital
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 sm:mb-6">
                Smart Kelurahan
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300">
                  Paceda
                </span>
              </h1>

              <p className="text-base sm:text-lg text-blue-100/80 max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
                Layanan administrasi kelurahan yang lebih cepat, mudah, dan transparan.
                Ajukan surat secara online tanpa perlu antre.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 sm:px-0">
                <Link to={user ? '/pengajuan-surat' : '/register'} className="w-full sm:w-auto">
                  <Button variant="white" size="lg" iconRight={ArrowRight} className="w-full sm:w-auto justify-center">
                    {user ? 'Ajukan Surat' : 'Daftar Sekarang'}
                  </Button>
                </Link>
                <Link to="/tentang" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto justify-center !border-white/30 !text-white hover:!bg-white/10">
                    Tentang Paceda
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats Cards - Hidden on mobile, grid on tablet+ */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:grid grid-cols-2 gap-3 lg:gap-4"
            >
              {[
                { icon: FileText, label: 'Jenis Layanan Surat', value: 8, color: 'from-blue-500 to-blue-600' },
                { icon: Users, label: 'Warga Terlayani', value: 500, suffix: '+', color: 'from-emerald-500 to-emerald-600' },
                { icon: CheckCircle2, label: 'Surat Diproses', value: 1200, suffix: '+', color: 'from-violet-500 to-violet-600' },
                { icon: Clock, label: 'Jam Pelayanan', value: 7, suffix: ' Jam/Hari', color: 'from-amber-500 to-amber-600' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl lg:rounded-2xl p-4 lg:p-5"
                >
                  <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 lg:mb-3`}>
                    <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <p className="text-xl lg:text-2xl font-bold text-white">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix || ''} />
                  </p>
                  <p className="text-xs lg:text-sm text-blue-200/70">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Stats - Horizontal scroll */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:hidden flex gap-3 overflow-x-auto pb-2 px-4 -mx-4 snap-x snap-mandatory smooth-scroll"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { icon: FileText, label: 'Jenis Layanan', value: 8, color: 'from-blue-500 to-blue-600' },
                { icon: Users, label: 'Warga Terlayani', value: 500, suffix: '+', color: 'from-emerald-500 to-emerald-600' },
                { icon: CheckCircle2, label: 'Surat Diproses', value: 1200, suffix: '+', color: 'from-violet-500 to-violet-600' },
                { icon: Clock, label: 'Jam Pelayanan', value: 7, suffix: ' Jam', color: 'from-amber-500 to-amber-600' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/10 border border-white/20 rounded-xl p-4 min-w-[140px] snap-start"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xl font-bold text-white">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix || ''} />
                  </p>
                  <p className="text-xs text-blue-200/70 whitespace-nowrap">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== SAMBUTAN ========== */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden shadow-xl">
                  <div className="text-center p-6 sm:p-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <span className="text-white text-2xl sm:text-3xl font-bold">P</span>
                    </div>
                    <p className="text-blue-800 font-bold text-base sm:text-lg">Kelurahan Paceda</p>
                    <p className="text-blue-600 text-xs sm:text-sm">Kecamatan Maesa, Kota Bitung</p>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-2xl -z-10" />
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-xl -z-10" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-3 sm:mb-4">
                <Star className="w-3.5 h-3.5" /> Sambutan Lurah
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 mb-3 sm:mb-4">
                Selamat Datang di
                <span className="block sm:inline text-blue-600"> Smart Kelurahan Paceda</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-3 sm:mb-4">
                Puji syukur kepada Tuhan Yang Maha Esa. Dengan hadirnya website Smart Kelurahan Paceda,
                kami berharap pelayanan administrasi kepada masyarakat dapat semakin cepat, mudah, dan transparan.
              </p>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-4 sm:mb-6">
                Website ini memudahkan warga untuk mengajukan berbagai jenis surat secara online,
                memantau status pengajuan, serta mendapatkan informasi terbaru mengenai kegiatan di Kelurahan Paceda.
              </p>
              <div className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm sm:text-base">Lurah Paceda</p>
                  <p className="text-xs sm:text-sm text-slate-500">Kelurahan Paceda, Kec. Maesa</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== LAYANAN SURAT ========== */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-3 sm:mb-4">
              <FileText className="w-3.5 h-3.5" /> Layanan Surat
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 mb-2 sm:mb-3 px-4">
              Pelayanan Surat Online
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto px-4">
              Ajukan berbagai jenis surat secara online. Cepat, mudah, dan tanpa perlu antre.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {(jenisSurat.length > 0 ? jenisSurat : [
              { id: 1, nama: 'Surat Keterangan Domisili', icon: 'Home', deskripsi: 'Keterangan tempat tinggal' },
              { id: 2, nama: 'Surat Keterangan Usaha', icon: 'Briefcase', deskripsi: 'Keterangan usaha/bisnis' },
              { id: 3, nama: 'Surat Keterangan Tidak Mampu', icon: 'Heart', deskripsi: 'Keterangan kurang mampu' },
              { id: 4, nama: 'Surat Pengantar KTP', icon: 'CreditCard', deskripsi: 'Pengantar pembuatan KTP' },
              { id: 5, nama: 'Surat Pengantar KK', icon: 'Users', deskripsi: 'Pengantar pembuatan KK' },
              { id: 6, nama: 'Surat Keterangan Belum Menikah', icon: 'HeartOff', deskripsi: 'Keterangan belum menikah' },
              { id: 7, nama: 'Surat Keterangan Pindah', icon: 'MapPin', deskripsi: 'Keterangan pindah domisili' },
              { id: 8, nama: 'Surat Keterangan Kelahiran', icon: 'Baby', deskripsi: 'Keterangan kelahiran' },
            ]).map((surat) => {
              const Icon = iconMap[surat.icon] || FileText;
              return (
                <motion.div key={surat.id} variants={item}>
                  <Card className="h-full group" padding="p-4 sm:p-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-3 sm:mb-4 group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-xs sm:text-sm mb-1 leading-snug line-clamp-2">{surat.nama}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1 hidden sm:block">{surat.deskripsi}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center mt-8 sm:mt-10">
            <Link to={user ? '/pengajuan-surat' : '/login'} className="inline-block w-full sm:w-auto px-4">
              <Button variant="primary" size="lg" iconRight={ArrowRight} className="w-full sm:w-auto justify-center">
                Ajukan Surat Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== SHORTCUT MENU ========== */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 mb-2 sm:mb-3 px-4">
              Akses Cepat
            </h2>
            <p className="text-sm sm:text-base text-slate-500 px-4">Fitur utama yang bisa Anda akses dengan cepat</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {[
              { icon: FileText, label: 'Pengajuan Surat', desc: 'Ajukan surat online', path: user ? '/pengajuan-surat' : '/login', color: 'from-blue-500 to-blue-600' },
              { icon: Map, label: 'Peta Digital', desc: 'Jelajahi Paceda', path: '/peta-digital', color: 'from-emerald-500 to-emerald-600' },
              { icon: Megaphone, label: 'Pengumuman', desc: 'Info terbaru', path: '/pengumuman', color: 'from-amber-500 to-amber-600' },
              { icon: Info, label: 'Tentang Paceda', desc: 'Profil kelurahan', path: '/tentang', color: 'from-violet-500 to-violet-600' },
            ].map((shortcut, i) => (
              <motion.div key={i} variants={item}>
                <Link to={shortcut.path}>
                  <Card className="text-center group" padding="p-5 sm:p-6 lg:p-8">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${shortcut.color} flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <shortcut.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-0.5 sm:mb-1">{shortcut.label}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">{shortcut.desc}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== PENGUMUMAN TERBARU ========== */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 lg:mb-12 gap-4"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold mb-2 sm:mb-3">
                <Megaphone className="w-3.5 h-3.5" /> Pengumuman
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Pengumuman Terbaru</h2>
            </div>
            <Link to="/pengumuman" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          >
            {(pengumuman.length > 0 ? pengumuman : [
              { id: '1', judul: 'Jadwal Kerja Bakti Bulanan', isi: 'Diberitahukan kepada seluruh warga bahwa akan diadakan kerja bakti bulanan pada hari Sabtu.', tanggal: new Date().toISOString() },
              { id: '2', judul: 'Jadwal Posyandu Bulan Ini', isi: 'Posyandu Melati akan dilaksanakan pada hari Rabu minggu kedua setiap bulan.', tanggal: new Date(Date.now() - 86400000 * 2).toISOString() },
              { id: '3', judul: 'Pelayanan Administrasi Libur Nasional', isi: 'Pelayanan administrasi Kelurahan Paceda akan diliburkan pada tanggal merah nasional.', tanggal: new Date(Date.now() - 86400000 * 5).toISOString() },
            ]).map((p) => (
              <motion.div key={p.id} variants={item}>
                <Link to={`/pengumuman/${p.id}`}>
                  <Card className="h-full group" padding="p-0">
                    {p.foto_url ? (
                      <div className="aspect-video bg-slate-100 rounded-t-2xl overflow-hidden">
                        <img src={p.foto_url} alt={p.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-emerald-50 rounded-t-2xl flex items-center justify-center">
                        <Megaphone className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300" />
                      </div>
                    )}
                    <div className="p-4 sm:p-5">
                      <p className="text-xs text-slate-400 mb-2">{formatDate(p.tanggal)}</p>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{p.judul}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">{p.isi}</p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-6 sm:mt-8 sm:hidden">
            <Link to="/pengumuman" className="inline-block w-full px-4">
              <Button variant="outline" iconRight={ChevronRight} className="w-full justify-center">
                Lihat Semua Pengumuman
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 p-8 sm:p-12 lg:p-16 text-center"
          >
            {/* Simplified background for mobile */}
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl hidden sm:block" />
            <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl hidden sm:block" />

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 sm:mb-4 px-4">
                Siap Mengajukan Surat?
              </h2>
              <p className="text-sm sm:text-base text-blue-100/80 max-w-xl mx-auto mb-6 sm:mb-8 px-4">
                Daftar sekarang dan nikmati kemudahan pelayanan administrasi kelurahan secara online.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4">
                <Link to={user ? '/pengajuan-surat' : '/register'} className="w-full sm:w-auto">
                  <Button variant="white" size="lg" iconRight={ArrowRight} className="w-full sm:w-auto justify-center">
                    {user ? 'Ajukan Surat' : 'Daftar Sekarang'}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
