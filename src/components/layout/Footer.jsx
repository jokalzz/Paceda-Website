import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { KELURAHAN_INFO, NAV_LINKS } from '../../lib/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs sm:text-sm">SP</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xs sm:text-sm">Smart Kelurahan</h3>
                <p className="text-blue-400 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">Paceda</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs">
              Sistem pelayanan digital Kelurahan Paceda untuk mempermudah warga dalam mengakses layanan administrasi secara online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs sm:text-sm mb-3 sm:mb-4 uppercase tracking-wider">Menu</h4>
            <ul className="space-y-2">
              {NAV_LINKS.filter(l => !l.auth).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-xs sm:text-sm mb-3 sm:mb-4 uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-2">
              <li><Link to="/pengajuan-surat" className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block">Pengajuan Surat</Link></li>
              <li><Link to="/status-surat" className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block">Cek Status Surat</Link></li>
              <li><Link to="/pengumuman" className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block">Pengumuman</Link></li>
              <li><Link to="/peta-digital" className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block">Peta Digital</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs sm:text-sm mb-3 sm:mb-4 uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-400 leading-snug">{KELURAHAN_INFO.alamat}</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
                <a href={`tel:${KELURAHAN_INFO.telepon}`} className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors">{KELURAHAN_INFO.telepon}</a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${KELURAHAN_INFO.email}`} className="text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors break-all">{KELURAHAN_INFO.email}</a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-400 leading-snug">Senin - Jumat<br className="sm:hidden" /><span className="hidden sm:inline">, </span>08.00 - 15.00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-500">
            <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Smart Kelurahan Paceda. Hak cipta dilindungi.</p>
            <p className="text-center sm:text-right">Kelurahan Paceda, Kec. Maesa, Kota Bitung</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
