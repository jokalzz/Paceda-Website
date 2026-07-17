import { motion } from 'framer-motion';
import {
  Info, MapPin, Users, Target, Eye, Building2, Heart,
  Phone, Mail, Clock, Shield, Award, Star, Landmark,
} from 'lucide-react';
import Card from '../../components/common/Card';
import { KELURAHAN_INFO } from '../../lib/constants';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function TentangPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-100 rounded-full text-xs font-semibold mb-6">
              <Info className="w-3.5 h-3.5" /> Profil Kelurahan
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Tentang Kelurahan Paceda
            </h1>
            <p className="text-blue-200/70 max-w-2xl mx-auto text-lg">
              Kelurahan Paceda, Kecamatan Maesa, Kota Bitung, Provinsi Sulawesi Utara
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sejarah */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-4">
                <Landmark className="w-3.5 h-3.5" /> Sejarah
              </span>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Sejarah Kelurahan Paceda</h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                Kelurahan Paceda merupakan salah satu kelurahan yang berada di Kecamatan Maesa, Kota Bitung,
                Provinsi Sulawesi Utara. Kelurahan ini memiliki sejarah panjang sebagai bagian dari
                perkembangan Kota Bitung yang dikenal sebagai kota pelabuhan dan industri perikanan.
              </p>
              <p className="text-slate-500 leading-relaxed mb-4">
                Seiring berjalannya waktu, Kelurahan Paceda terus berkembang menjadi wilayah yang
                semakin modern dengan tetap mempertahankan nilai-nilai gotong royong dan kebersamaan
                yang menjadi ciri khas masyarakatnya.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Dengan hadirnya Smart Kelurahan Paceda, pelayanan administrasi kini dapat dilakukan
                secara digital untuk memudahkan seluruh warga dalam mengakses layanan pemerintah.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-100 to-emerald-50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Building2 className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                    <p className="text-blue-800 font-bold text-xl">Kelurahan Paceda</p>
                    <p className="text-blue-600 text-sm">Kecamatan Maesa, Kota Bitung</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-100 rounded-2xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Visi & Misi</h2>
            <p className="text-slate-500">Arah dan tujuan Kelurahan Paceda</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card padding="p-8" className="h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Visi</h3>
                <p className="text-slate-500 leading-relaxed text-lg italic">
                  "Mewujudkan Kelurahan Paceda yang maju, mandiri, dan sejahtera melalui
                  pelayanan publik yang modern, transparan, dan berintegritas."
                </p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <Card padding="p-8" className="h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Misi</h3>
                <ul className="space-y-3">
                  {[
                    'Meningkatkan kualitas pelayanan administrasi kepada masyarakat',
                    'Mendorong partisipasi masyarakat dalam pembangunan kelurahan',
                    'Mengembangkan infrastruktur dan fasilitas umum yang memadai',
                    'Meningkatkan kesejahteraan masyarakat melalui pemberdayaan ekonomi lokal',
                    'Menerapkan teknologi informasi untuk pelayanan publik yang efisien',
                  ].map((misi, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-emerald-600">{i + 1}</span>
                      </div>
                      <span className="text-slate-500">{misi}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Struktur Organisasi</h2>
            <p className="text-slate-500">Perangkat Kelurahan Paceda</p>
          </motion.div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { nama: 'Lurah Paceda', jabatan: 'Lurah', icon: Shield, color: 'from-blue-500 to-blue-600' },
              { nama: 'Sekretaris Lurah', jabatan: 'Sekretaris', icon: Users, color: 'from-slate-600 to-slate-700' },
              { nama: 'Kasi Pemerintahan', jabatan: 'Kepala Seksi', icon: Building2, color: 'from-emerald-500 to-emerald-600' },
              { nama: 'Kasi Kesejahteraan', jabatan: 'Kepala Seksi', icon: Heart, color: 'from-rose-500 to-rose-600' },
              { nama: 'Kasi Pembangunan', jabatan: 'Kepala Seksi', icon: Award, color: 'from-amber-500 to-amber-600' },
              { nama: 'Staff Kelurahan', jabatan: 'Staff', icon: Star, color: 'from-violet-500 to-violet-600' },
            ].map((person, i) => (
              <motion.div key={i} variants={item}>
                <Card padding="p-6" className="text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${person.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <person.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{person.nama}</h3>
                  <p className="text-sm text-slate-400">{person.jabatan}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Info Stats */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Profil Kelurahan</h2>
            <p className="text-slate-500">Informasi umum Kelurahan Paceda</p>
          </motion.div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Jumlah Lingkungan', value: '5', icon: MapPin },
              { label: 'Jumlah RT', value: '15', icon: Users },
              { label: 'Luas Wilayah', value: '1.2 km²', icon: Building2 },
              { label: 'Jumlah Penduduk', value: '±3.500', icon: Heart },
            ].map((stat, i) => (
              <motion.div key={i} variants={item}>
                <Card padding="p-6" className="text-center">
                  <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Kontak */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card padding="p-8" className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Informasi Kontak</h2>
              <div className="grid sm:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">Alamat</p>
                    <p className="text-sm text-slate-500">{KELURAHAN_INFO.alamat}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">Telepon</p>
                    <p className="text-sm text-slate-500">{KELURAHAN_INFO.telepon}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">Email</p>
                    <p className="text-sm text-slate-500">{KELURAHAN_INFO.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">Jam Pelayanan</p>
                    <p className="text-sm text-slate-500">Senin - Jumat, 08.00 - 15.00 WITA</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
