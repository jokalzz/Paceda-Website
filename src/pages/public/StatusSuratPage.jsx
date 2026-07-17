import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Download, Search, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Timeline from '../../components/common/Timeline';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import Input from '../../components/common/Input';

export default function StatusSuratPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchPengajuan();
  }, [user]);

  async function fetchPengajuan() {
    setLoading(true);
    const { data, error } = await supabase
      .from('pengajuan_surat')
      .select('*, jenis_surat(*)')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false });

    if (data) setPengajuan(data);
    setLoading(false);
  }

  const filtered = pengajuan.filter((p) => {
    const matchSearch = p.jenis_surat?.nama?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus ? p.status === filterStatus : true;
    return matchSearch && matchFilter;
  });

  const statusFilters = [
    { value: '', label: 'Semua' },
    { value: 'menunggu', label: 'Menunggu' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'disetujui', label: 'Disetujui' },
    { value: 'ditolak', label: 'Ditolak' },
    { value: 'selesai', label: 'Selesai' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 mb-2">Status Pengajuan Surat</h1>
        <p className="text-slate-500">Pantau perkembangan pengajuan surat Anda</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Cari jenis surat..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === f.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Belum Ada Pengajuan"
          description="Anda belum memiliki pengajuan surat. Mulai ajukan surat melalui menu Pengajuan Surat."
          action={
            <Button onClick={() => navigate('/pengajuan-surat')}>
              Ajukan Surat
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                padding="p-5"
                onClick={() => setSelectedPengajuan(p)}
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 mb-1">{p.jenis_surat?.nama || 'Surat'}</h3>
                    <p className="text-xs text-slate-400">Diajukan: {formatDate(p.submitted_at)}</p>
                    {p.alasan_penolakan && p.status === 'ditolak' && (
                      <p className="text-xs text-red-500 mt-2 bg-red-50 px-3 py-1.5 rounded-lg">
                        Alasan: {p.alasan_penolakan}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge status={p.status} />
                    {p.surat_pdf_url && p.status === 'selesai' && (
                      <a href={p.surat_pdf_url} target="_blank" rel="noreferrer">
                        <Button variant="secondary" size="sm" icon={Download}>
                          PDF
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedPengajuan}
        onClose={() => setSelectedPengajuan(null)}
        title="Detail Pengajuan"
        size="md"
      >
        {selectedPengajuan && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Jenis Surat</p>
              <p className="font-bold text-slate-800">{selectedPengajuan.jenis_surat?.nama}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Tanggal Pengajuan</p>
                <p className="text-sm font-medium text-slate-800">{formatDateTime(selectedPengajuan.submitted_at)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Status</p>
                <Badge status={selectedPengajuan.status} />
              </div>
            </div>

            {selectedPengajuan.keterangan_tambahan && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Keterangan Tambahan</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{selectedPengajuan.keterangan_tambahan}</p>
              </div>
            )}

            {selectedPengajuan.alasan_penolakan && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                <p className="text-sm font-semibold text-red-700 mb-1">Alasan Penolakan:</p>
                <p className="text-sm text-red-600">{selectedPengajuan.alasan_penolakan}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-slate-500 mb-3">Status Pengajuan</p>
              <Timeline
                currentStatus={selectedPengajuan.status}
                timestamps={{
                  menunggu: selectedPengajuan.submitted_at,
                  diproses: selectedPengajuan.processed_at,
                  disetujui: selectedPengajuan.completed_at,
                  ditolak: selectedPengajuan.completed_at,
                  selesai: selectedPengajuan.completed_at,
                }}
              />
            </div>

            {selectedPengajuan.surat_pdf_url && selectedPengajuan.status === 'selesai' && (
              <a href={selectedPengajuan.surat_pdf_url} target="_blank" rel="noreferrer">
                <Button fullWidth icon={Download} variant="secondary">
                  Download Surat PDF
                </Button>
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
