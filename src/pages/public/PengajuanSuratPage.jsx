import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ArrowLeft, ArrowRight, Upload, CheckCircle2, Send,
  Home, Briefcase, Heart, CreditCard, Users, HeartOff, MapPin, Baby,
  Check, AlertCircle,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Textarea } from '../../components/common/Input';
import FileUpload from '../../components/common/FileUpload';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const iconMap = { Home, Briefcase, Heart, CreditCard, Users, HeartOff, MapPin, Baby };

const STEPS = [
  { id: 1, label: 'Pilih Surat' },
  { id: 2, label: 'Persyaratan' },
  { id: 3, label: 'Upload Berkas' },
  { id: 4, label: 'Keterangan' },
  { id: 5, label: 'Kirim' },
];

export default function PengajuanSuratPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [jenisSurat, setJenisSurat] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [files, setFiles] = useState([]);
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchJenisSurat();
  }, [user]);

  async function fetchJenisSurat() {
    const { data } = await supabase.from('jenis_surat').select('*').eq('is_active', true).order('id');
    if (data) setJenisSurat(data);
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Upload files
      const uploadedFiles = [];
      for (const file of files) {
        const fileName = `${user.id}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage.from('berkas-surat').upload(fileName, file);
        if (!error) uploadedFiles.push({ name: file.name, path: data.path });
      }

      // Create pengajuan
      const { error } = await supabase.from('pengajuan_surat').insert({
        user_id: user.id,
        jenis_surat_id: selectedSurat.id,
        keterangan_tambahan: keterangan,
        berkas_upload: uploadedFiles,
        status: 'menunggu',
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      alert('Gagal mengirim pengajuan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-3">Pengajuan Berhasil Dikirim!</h2>
          <p className="text-slate-500 mb-8">Pengajuan surat Anda sedang dalam proses verifikasi. Pantau status pengajuan melalui menu Status Surat.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate('/status-surat')} iconRight={ArrowRight}>Cek Status Surat</Button>
            <Button variant="outline" onClick={() => { setSuccess(false); setStep(1); setSelectedSurat(null); setFiles([]); setKeterangan(''); }}>Ajukan Lagi</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 mb-2">Pengajuan Surat</h1>
        <p className="text-slate-500">Ikuti langkah-langkah berikut untuk mengajukan surat</p>
      </motion.div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center shrink-0">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step > s.id ? 'bg-emerald-500 text-white' :
                step === s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' :
                'bg-slate-100 text-slate-400'
              }`}>
                {step > s.id ? <Check className="w-5 h-5" /> : s.id}
              </div>
              <span className={`text-xs mt-2 font-medium whitespace-nowrap ${
                step >= s.id ? 'text-slate-700' : 'text-slate-400'
              }`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 sm:w-20 h-0.5 mx-2 mt-[-18px] transition-all duration-300 ${
                step > s.id ? 'bg-emerald-400' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Pilih Jenis Surat */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Pilih Jenis Surat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                const isSelected = selectedSurat?.id === surat.id;
                return (
                  <div
                    key={surat.id}
                    onClick={() => setSelectedSurat(surat)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">{surat.nama}</p>
                      <p className="text-xs text-slate-400">{surat.deskripsi}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 ml-auto" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Persyaratan */}
        {step === 2 && selectedSurat && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Persyaratan: {selectedSurat.nama}</h2>
            <p className="text-sm text-slate-500 mb-6">Pastikan Anda telah menyiapkan dokumen berikut sebelum melanjutkan:</p>
            <Card padding="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Dokumen yang Diperlukan</p>
                  <p className="text-xs text-slate-400">Semua dokumen wajib dilengkapi</p>
                </div>
              </div>
              <ul className="space-y-3">
                {(selectedSurat.persyaratan || [
                  'KTP asli dan fotokopi',
                  'Kartu Keluarga (KK) asli dan fotokopi',
                  'Surat Pengantar RT/RW',
                  'Pas foto 3x4 (2 lembar)',
                ]).map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                    </div>
                    <span className="text-sm text-slate-600">{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Upload Berkas */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Upload Berkas</h2>
            <p className="text-sm text-slate-500 mb-6">Upload dokumen persyaratan dalam format PDF, JPG, atau PNG.</p>
            <FileUpload
              label="Berkas Persyaratan"
              multiple
              files={files}
              onChange={setFiles}
              required
            />
          </motion.div>
        )}

        {/* Step 4: Keterangan Tambahan */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Keterangan Tambahan</h2>
            <p className="text-sm text-slate-500 mb-6">Tambahkan informasi atau keterangan yang diperlukan (opsional).</p>
            <Textarea
              label="Keterangan"
              placeholder="Contoh: Surat ini diperlukan untuk keperluan melamar kerja..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={6}
            />
          </motion.div>
        )}

        {/* Step 5: Konfirmasi */}
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Konfirmasi Pengajuan</h2>
            <Card padding="p-6" className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Jenis Surat</span>
                <span className="text-sm font-semibold text-slate-800">{selectedSurat?.nama}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Jumlah Berkas</span>
                <span className="text-sm font-semibold text-slate-800">{files.length} file</span>
              </div>
              <div className="py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Keterangan Tambahan</span>
                <p className="text-sm font-medium text-slate-800 mt-1">{keterangan || '-'}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Pastikan data yang Anda masukkan sudah benar. Pengajuan yang sudah dikirim tidak dapat diubah.</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Kembali
        </Button>

        {step < 5 ? (
          <Button
            iconRight={ArrowRight}
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !selectedSurat}
          >
            Lanjut
          </Button>
        ) : (
          <Button
            icon={Send}
            onClick={handleSubmit}
            loading={loading}
          >
            Kirim Pengajuan
          </Button>
        )}
      </div>
    </div>
  );
}
