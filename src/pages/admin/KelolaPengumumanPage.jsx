import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Plus, Pencil, Trash2, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Textarea } from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';

export default function KelolaPengumumanPage() {
  const { user } = useAuth();
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ judul: '', isi: '', is_published: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPengumuman(); }, []);

  async function fetchPengumuman() {
    setLoading(true);
    const { data } = await supabase.from('pengumuman').select('*').order('created_at', { ascending: false });
    if (data) setPengumuman(data);
    setLoading(false);
  }

  const openNew = () => {
    setEditing(null);
    setForm({ judul: '', isi: '', is_published: true });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ judul: p.judul, isi: p.isi, is_published: p.is_published });
    setShowForm(true);
  };

  async function handleSave() {
    if (!form.judul.trim() || !form.isi.trim()) { alert('Judul dan isi wajib diisi'); return; }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('pengumuman').update({ judul: form.judul, isi: form.isi, is_published: form.is_published }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pengumuman').insert({ judul: form.judul, isi: form.isi, is_published: form.is_published, created_by: user.id, tanggal: new Date().toISOString().split('T')[0] });
        if (error) throw error;
      }
      await fetchPengumuman();
      setShowForm(false);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus pengumuman ini?')) return;
    await supabase.from('pengumuman').delete().eq('id', id);
    fetchPengumuman();
  }

  const filtered = pengumuman.filter((p) => p.judul.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Kelola Pengumuman</h1>
          <p className="text-sm text-slate-500">Tambah, edit, dan hapus pengumuman kelurahan</p>
        </div>
        <Button icon={Plus} onClick={openNew}>Tambah</Button>
      </motion.div>

      <div className="max-w-md mb-6">
        <Input placeholder="Cari pengumuman..." icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={Newspaper} title="Belum ada pengumuman" action={<Button icon={Plus} onClick={openNew}>Tambah Pengumuman</Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card padding="p-5" hover={false}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 truncate">{p.judul}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-1">{p.isi}</p>
                    <p className="text-xs text-slate-300">{formatDate(p.tanggal)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" icon={Pencil} onClick={() => openEdit(p)} />
                    <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(p.id)} className="!text-red-500 hover:!bg-red-50" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Pengumuman' : 'Tambah Pengumuman'} size="md">
        <div className="space-y-4">
          <Input label="Judul Pengumuman" placeholder="Masukkan judul pengumuman" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
          <Textarea label="Isi Pengumuman" placeholder="Tulis isi pengumuman..." value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} rows={6} required />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm font-medium text-slate-700">Publikasikan</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Batal</Button>
            <Button onClick={handleSave} loading={saving} className="flex-1">{editing ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
