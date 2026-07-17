import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard,
  Home, FileText, ClipboardList, Megaphone, Info, Map,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME, NAV_LINKS } from '../../lib/constants';

const iconMap = { Home, FileText, ClipboardList, Megaphone, Info, Map };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const visibleLinks = NAV_LINKS.filter((link) => !link.auth || user);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 z-50">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-xs sm:text-sm">SP</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">Smart Kelurahan</h1>
                <p className="text-[9px] sm:text-[10px] text-blue-600 font-semibold tracking-wider uppercase">Paceda</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {visibleLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`py-2 px-1 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-slate-600 hover:text-blue-700'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors active:scale-95"
                    aria-label="Profile menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">
                        {(profile?.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                      {profile?.full_name || user.email}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-slate-100">
                            <p className="text-sm font-semibold text-slate-800 truncate">{profile?.full_name || 'User'}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/profil"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <User className="w-4 h-4" /> Profil Saya
                            </Link>
                            {isAdmin && (
                              <Link
                                to="/admin"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4" /> Dashboard Admin
                              </Link>
                            )}
                          </div>
                          <div className="border-t border-slate-100 pt-1">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                            >
                              <LogOut className="w-4 h-4" /> Keluar
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors active:scale-95"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                  >
                    Daftar
                  </Link>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors active:scale-95"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                <motion.div
                  animate={mobileOpen ? 'open' : 'closed'}
                  variants={{
                    open: { rotate: 90 },
                    closed: { rotate: 0 }
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">SP</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">{APP_NAME}</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors active:scale-95"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* User info for mobile */}
              {user && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">
                        {(profile?.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-1">
                {visibleLinks.map((link) => {
                  const Icon = iconMap[link.icon] || Home;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-indicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {user ? (
                <div className="p-4 border-t border-slate-100 space-y-1 mt-auto">
                  <Link
                    to="/profil"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors active:scale-95"
                  >
                    <User className="w-5 h-5" />
                    Profil Saya
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors active:scale-95"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors active:scale-95"
                  >
                    <LogOut className="w-5 h-5" />
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="p-4 border-t border-slate-100 space-y-2 sticky bottom-0 bg-white">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 text-sm font-semibold text-blue-600 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition-colors active:scale-95"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg active:scale-95 transition-transform"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 lg:h-18" />
    </>
  );
}
