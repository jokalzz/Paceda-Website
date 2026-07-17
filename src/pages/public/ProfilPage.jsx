import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, CreditCard, Camera, Save, LogOut, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatDate';

export default function ProfilPage() {
  const { user, profile, updateProfile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', nik: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [riwayat, setRiwayat] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);

  useEffect(() => {
    if (!user && !authLoading) navigate('/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (profile) {
      setForm({ full_name: profile.full_name || '', nik: profile.nik || '', phone: profile.phone || '' });
    }
  }, [profile]);

  useEffect(() => {
    if (user) fetchRiwayat();
  }, [user]);

  async function fetchRiwayat() {
    const { data } = await supabase
      .from('pengajuan_surat')
      .select('*, jenis_surat(nama)')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(10);
    if (data) setRiwayat(data);
    setLoadingRiwayat(false);
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      setEditing(false);
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 mb-2">Profil Saya</h1>
        <p className="text-slate-500">Kelola informasi akun Anda</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <Card padding="p-6" className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">{profile?.full_name || 'User'}</h2>
            <p className="text-sm text-slate-400 mb-4">{user.email}</p>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">NIK</p>
                  <p className="text-sm font-medium text-slate-700">{profile?.nik || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">No. HP</p>
                  <p className="text-sm font-medium text-slate-700">{profile?.phone || '-'}</p>
                </div>
              </div>
            </div>
            <Button variant="danger" fullWidth icon={LogOut} className="mt-6" onClick={handleLogout}>
              Keluar
            </Button>
          </Card>
        </motion.div>

        {/* Edit & Riwayat */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          {/* Edit Profile */}
          <Card padding="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Informasi Pribadi</h3>
              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Batal</Button>
              )}
            </div>
            {editing ? (
              <div className="space-y-4">
                <Input label="Nama Lengkap" icon={User} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                <Input label="NIK" icon={CreditCard} value={form.nik} onChange={(e) => setForm({ ...form, nik: e.target.value })} maxLength={16} />
                <Input label="No. HP" icon={Phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Button icon={Save} onClick={handleSave} loading={saving}>Simpan Perubahan</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <User className="w-5 h-5 text-slate-400" />
                  <div><p className="text-xs text-slate-400">Nama Lengkap</p><p className="text-sm font-medium text-slate-700">{profile?.full_name || '-'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div><p className="text-xs text-slate-400">Email</p><p className="text-sm font-medium text-slate-700">{user.email}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <div><p className="text-xs text-slate-400">NIK</p><p className="text-sm font-medium text-slate-700">{profile?.nik || '-'}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div><p className="text-xs text-slate-400">No. HP</p><p className="text-sm font-medium text-slate-700">{profile?.phone || '-'}</p></div>
                </div>
              </div>
            )}
          </Card>

          {/* Riwayat */}
          <Card padding="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Riwayat Pengajuan Surat</h3>
            {loadingRiwayat ? (
              <LoadingSpinner size="sm" />
            ) : riwayat.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Belum ada riwayat pengajuan.</p>
            ) : (
              <div className="space-y-3">
                {riwayat.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{r.jenis_surat?.nama}</p>
                        <p className="text-xs text-slate-400">{formatDate(r.submitted_at)}</p>
                      </div>
                    </div>
                    <Badge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
