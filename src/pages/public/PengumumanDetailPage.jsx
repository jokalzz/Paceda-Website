import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Megaphone } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatDate';

export default function PengumumanDetailPage() {
  const { id } = useParams();
  const [pengumuman, setPengumuman] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPengumuman();
  }, [id]);

  async function fetchPengumuman() {
    const { data } = await supabase
      .from('pengumuman')
      .select('*')
      .eq('id', id)
      .single();
    if (data) setPengumuman(data);
    setLoading(false);
  }

  if (loading) return <LoadingSpinner />;
  if (!pengumuman) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <p className="text-slate-500">Pengumuman tidak ditemukan.</p>
      <Link to="/pengumuman"><Button variant="outline" className="mt-4" icon={ArrowLeft}>Kembali</Button></Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
      <Link to="/pengumuman">
        <Button variant="ghost" icon={ArrowLeft} className="mb-6">Kembali ke Pengumuman</Button>
      </Link>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {pengumuman.foto_url ? (
          <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-8">
            <img src={pengumuman.foto_url} alt={pengumuman.judul} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-amber-50 rounded-2xl flex items-center justify-center mb-8">
            <Megaphone className="w-16 h-16 text-amber-300" />
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <Calendar className="w-4 h-4" />
          {formatDate(pengumuman.tanggal)}
        </div>

        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 mb-6">
          {pengumuman.judul}
        </h1>

        <div className="prose prose-slate max-w-none">
          {pengumuman.isi.split('\n').map((p, i) => (
            <p key={i} className="text-slate-600 leading-relaxed mb-4">{p}</p>
          ))}
        </div>
      </motion.article>
    </div>
  );
}
