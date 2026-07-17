import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinned, Plus, Pencil, Trash2, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input, { Textarea, Select } from '../../components/common/Input';
import { CategoryBadge } from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { supabase } from '../../lib/supabase';
import { KATEGORI_PETA } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

const kategoriOptions = Object.entries(KATEGORI_PETA).map(([value, data]) => ({
  value,
  label: data.label,
}));

export default function KelolaPetaPage() {
  const { user } = useAuth();
  const [lokasi, setLokasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nama: '', kategori: '', latitude: '', longitude: '', deskripsi: '', alamat: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchLokasi(); }, []);

  async function fetchLokasi() {
    setLoading(true);
    const { data } = await supabase.from('lokasi_peta').select('*').order('nama');
    if (data) setLokasi(data);
    setLoading(false);
  }

  const openNew = () => {
    setEditing(null);
    setForm({ nama: '', kategori: '', latitude: '', longitude: '', deskripsi: '', alamat: '' });
    setShowForm(true);
  };

  const openEdit = (l) => {
    setEditing(l);
    setForm({
      nama: l.nama,
      kategori: l.kategori,
      latitude: l.latitude?.toString() || '',
      longitude: l.longitude?.toString() || '',
      deskripsi: l.deskripsi || '',
      alamat: l.alamat || '',
    });
    setShowForm(true);
  };

  async function handleSave() {
    if (!form.nama.trim() || !form.kategori || !form.latitude || !form.longitude) {
      alert('Nama, kategori, latitude, dan longitude wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nama: form.nama,
        kategori: form.kategori,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        deskripsi: form.deskripsi,
        alamat: form.alamat,
      };

      if (editing) {
        const { error } = await supabase.from('lokasi_peta').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lokasi_peta').insert({ ...payload, created_by: user.id });
        if (error) throw error;
      }
      await fetchLokasi();
      setShowForm(false);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus lokasi ini?')) return;
    await supabase.from('lokasi_peta').delete().eq('id', id);
    fetchLokasi();
  }

  const filtered = lokasi.filter((l) =>
    l.nama.toLowerCase().includes(search.toLowerCase()) ||
    l.kategori.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Kelola Peta Digital</h1>
          <p className="text-sm text-slate-500">Tambah, edit, dan hapus lokasi pada peta</p>
        </div>
        <Button icon={Plus} onClick={openNew}>Tambah Lokasi</Button>
      </motion.div>

      <div className="max-w-md mb-6">
        <Input placeholder="Cari lokasi..." icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={MapPinned} title="Belum ada lokasi" action={<Button icon={Plus} onClick={openNew}>Tambah Lokasi</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((l, i) => {
            const kat = KATEGORI_PETA[l.kategori] || {};
            return (
              <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card padding="p-5" hover={false}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 mb-1 truncate">{l.nama}</h3>
                      <CategoryBadge category={l.kategori} label={kat.label} color={kat.color} className="mb-2" />
                      {l.alamat && <p className="text-xs text-slate-400 mt-1">📍 {l.alamat}</p>}
                      <p className="text-[10px] text-slate-300 mt-1">
                        {l.latitude?.toFixed(4)}, {l.longitude?.toFixed(4)}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" icon={Pencil} onClick={() => openEdit(l)} />
                      <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(l.id)} className="!text-red-500 hover:!bg-red-50" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Lokasi' : 'Tambah Lokasi'} size="md">
        <div className="space-y-4">
          <Input label="Nama Lokasi" placeholder="Nama tempat" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
          <Select label="Kategori" options={kategoriOptions} value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude" type="number" placeholder="1.4477" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required step="any" />
            <Input label="Longitude" type="number" placeholder="125.1932" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required step="any" />
          </div>
          <Input label="Alamat" placeholder="Alamat lokasi" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
          <Textarea label="Deskripsi" placeholder="Deskripsi lokasi..." value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Batal</Button>
            <Button onClick={handleSave} loading={saving} className="flex-1">{editing ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
