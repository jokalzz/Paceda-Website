import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileStack, Search, Eye, CheckCircle, XCircle, Upload, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input, { Textarea } from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Timeline from '../../components/common/Timeline';
import { supabase } from '../../lib/supabase';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';

export default function KelolaSuratPage() {
  const { user } = useAuth();
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchPengajuan(); }, []);

  async function fetchPengajuan() {
    setLoading(true);
    const { data } = await supabase
      .from('pengajuan_surat')
      .select('*, jenis_surat(nama, icon), profiles:user_id(full_name, nik, email, phone)')
      .order('submitted_at', { ascending: false });
    if (data) setPengajuan(data);
    setLoading(false);
  }

  async function updateStatus(id, status, extra = {}) {
    setProcessing(true);
    try {
      const updates = {
        status,
        processed_by: user.id,
        processed_at: status === 'diproses' ? new Date().toISOString() : undefined,
        completed_at: ['disetujui', 'ditolak', 'selesai'].includes(status) ? new Date().toISOString() : undefined,
        ...extra,
      };
      const { error } = await supabase.from('pengajuan_surat').update(updates).eq('id', id);
      if (error) throw error;
      await fetchPengajuan();
      setSelected(null);
      setRejectReason('');
    } catch (err) {
      alert('Gagal update: ' + err.message);
    } finally {
      setProcessing(false);
    }
  }

  const filtered = pengajuan.filter((p) => {
    const matchSearch =
      p.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.jenis_surat?.nama?.toLowerCase().includes(search.toLowerCase());
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
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Kelola Surat</h1>
        <p className="text-sm text-slate-500">Kelola pengajuan surat dari warga</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Cari nama / jenis surat..." icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === f.value ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={FileStack} title="Tidak ada pengajuan" />
      ) : (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Pemohon</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Jenis Surat</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{p.profiles?.full_name || '-'}</p>
                      <p className="text-xs text-slate-400">{p.profiles?.nik || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.jenis_surat?.nama}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(p.submitted_at)}</td>
                    <td className="px-6 py-4"><Badge status={p.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" icon={Eye} onClick={() => setSelected(p)}>Detail</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setRejectReason(''); }} title="Detail Pengajuan" size="lg">
        {selected && (
          <div className="space-y-6">
            {/* Pemohon Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">Nama Pemohon</p>
                <p className="font-semibold text-slate-800">{selected.profiles?.full_name}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">NIK</p>
                <p className="font-semibold text-slate-800">{selected.profiles?.nik || '-'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">Email</p>
                <p className="font-semibold text-slate-800">{selected.profiles?.email}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">No. HP</p>
                <p className="font-semibold text-slate-800">{selected.profiles?.phone || '-'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs text-slate-400 mb-1">Jenis Surat</p>
              <p className="font-semibold text-slate-800">{selected.jenis_surat?.nama}</p>
            </div>

            {selected.keterangan_tambahan && (
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">Keterangan Tambahan</p>
                <p className="text-sm text-slate-700">{selected.keterangan_tambahan}</p>
              </div>
            )}

            {/* Berkas */}
            {selected.berkas_upload?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Berkas Upload</p>
                <div className="space-y-2">
                  {selected.berkas_upload.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <FileStack className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-slate-600 flex-1 truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Status Progress</p>
              <Timeline
                currentStatus={selected.status}
                timestamps={{
                  menunggu: selected.submitted_at,
                  diproses: selected.processed_at,
                  disetujui: selected.completed_at,
                  ditolak: selected.completed_at,
                  selesai: selected.completed_at,
                }}
              />
            </div>

            {/* Actions */}
            {selected.status === 'menunggu' && (
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button variant="primary" icon={CheckCircle} onClick={() => updateStatus(selected.id, 'diproses')} loading={processing} className="flex-1">
                  Proses
                </Button>
                <Button variant="danger" icon={XCircle} onClick={() => {
                  if (!rejectReason.trim()) { alert('Masukkan alasan penolakan'); return; }
                  updateStatus(selected.id, 'ditolak', { alasan_penolakan: rejectReason });
                }} loading={processing} className="flex-1">
                  Tolak
                </Button>
              </div>
            )}

            {selected.status === 'diproses' && (
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button variant="secondary" icon={CheckCircle} onClick={() => updateStatus(selected.id, 'disetujui')} loading={processing} className="flex-1">
                  Setujui
                </Button>
                <Button variant="danger" icon={XCircle} onClick={() => {
                  if (!rejectReason.trim()) { alert('Masukkan alasan penolakan'); return; }
                  updateStatus(selected.id, 'ditolak', { alasan_penolakan: rejectReason });
                }} loading={processing} className="flex-1">
                  Tolak
                </Button>
              </div>
            )}

            {selected.status === 'disetujui' && (
              <div className="pt-4 border-t border-slate-100">
                <Button variant="secondary" icon={CheckCircle} onClick={() => updateStatus(selected.id, 'selesai')} loading={processing} fullWidth>
                  Tandai Selesai
                </Button>
              </div>
            )}

            {['menunggu', 'diproses'].includes(selected.status) && (
              <Textarea
                label="Alasan Penolakan (jika ditolak)"
                placeholder="Masukkan alasan penolakan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
