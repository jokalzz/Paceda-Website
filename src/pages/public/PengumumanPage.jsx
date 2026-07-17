import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, Search, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatDate';

export default function PengumumanPage() {
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPengumuman();
  }, []);

  async function fetchPengumuman() {
    const { data } = await supabase
      .from('pengumuman')
      .select('*')
      .eq('is_published', true)
      .order('tanggal', { ascending: false });
    if (data) setPengumuman(data);
    setLoading(false);
  }

  const filtered = pengumuman.filter((p) =>
    p.judul.toLowerCase().includes(search.toLowerCase()) ||
    p.isi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold mb-3">
          <Megaphone className="w-3.5 h-3.5" /> Informasi Terbaru
        </span>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 mb-2">Pengumuman Kelurahan</h1>
        <p className="text-slate-500">Informasi dan pengumuman terbaru dari Kelurahan Paceda</p>
      </motion.div>

      {/* Search */}
      <div className="max-w-md mb-8">
        <Input placeholder="Cari pengumuman..." icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Megaphone} title="Tidak Ada Pengumuman" description="Belum ada pengumuman yang dipublikasikan." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/pengumuman/${p.id}`}>
                <Card className="h-full group" padding="p-0">
                  {p.foto_url ? (
                    <div className="aspect-video bg-slate-100 rounded-t-2xl overflow-hidden">
                      <img src={p.foto_url} alt={p.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-amber-50 rounded-t-2xl flex items-center justify-center">
                      <Megaphone className="w-12 h-12 text-amber-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(p.tanggal)}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{p.judul}</h3>
                    <p className="text-sm text-slate-400 line-clamp-3">{p.isi}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
