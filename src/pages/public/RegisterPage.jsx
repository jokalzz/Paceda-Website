import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, CreditCard, Phone, ArrowRight, Sparkles } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validateNIK, validatePhone } from '../../utils/validation';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', nik: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!validateNIK(form.nik)) newErrors.nik = 'NIK harus 16 digit';
    if (!validateEmail(form.email)) newErrors.email = 'Email tidak valid';
    if (!validatePhone(form.phone)) newErrors.phone = 'Nomor HP tidak valid';
    if (form.password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);

    try {
      await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        nik: form.nik,
        phone: form.phone,
      });
      navigate('/');
    } catch (err) {
      setServerError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-blue-700 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative flex flex-col items-center justify-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
              <span className="text-white text-3xl font-bold">SP</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4">Bergabung Bersama Kami</h2>
            <p className="text-emerald-200/70 max-w-sm mx-auto leading-relaxed">
              Daftarkan diri Anda untuk menikmati kemudahan layanan administrasi Kelurahan Paceda.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Pendaftaran Baru
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">Buat Akun Baru</h2>
          <p className="text-slate-500 mb-8">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-6"
            >
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nama Lengkap" name="fullName" placeholder="Nama sesuai KTP" icon={User} value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} error={errors.fullName} required />
            <Input label="NIK (16 digit)" name="nik" placeholder="3571234567890123" icon={CreditCard} value={form.nik} onChange={(e) => updateForm('nik', e.target.value)} error={errors.nik} required maxLength={16} />
            <Input label="Email" type="email" name="email" placeholder="nama@email.com" icon={Mail} value={form.email} onChange={(e) => updateForm('email', e.target.value)} error={errors.email} required />
            <Input label="Nomor HP" name="phone" placeholder="08xxxxxxxxxx" icon={Phone} value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} error={errors.phone} required />
            <Input label="Password" type="password" name="password" placeholder="Minimal 6 karakter" icon={Lock} value={form.password} onChange={(e) => updateForm('password', e.target.value)} error={errors.password} required />
            <Input label="Konfirmasi Password" type="password" name="confirmPassword" placeholder="Ulangi password" icon={Lock} value={form.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} error={errors.confirmPassword} required />

            <Button type="submit" fullWidth size="lg" loading={loading} iconRight={ArrowRight}>
              Daftar Sekarang
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
