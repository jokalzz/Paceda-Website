import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileStack, Newspaper, MapPinned,
  LogOut, ChevronLeft, Home,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_NAV_LINKS } from '../../lib/constants';

const iconMap = {
  LayoutDashboard,
  FileStack,
  Newspaper,
  MapPinned,
};

export default function Sidebar({ collapsed, onToggle }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 bg-slate-900 z-30 flex flex-col border-r border-slate-800 hidden lg:flex"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">SP</span>
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-white font-bold text-sm leading-tight">Admin Panel</h1>
            <p className="text-blue-400 text-[10px] font-semibold">Kelurahan Paceda</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          );
        })}

        <div className="border-t border-slate-800 my-3" />

        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
        >
          <Home className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Halaman Utama</span>}
        </NavLink>
      </nav>

      {/* Profile & Controls */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>

        <button
          onClick={onToggle}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-800 w-full transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <ChevronLeft className={`w-5 h-5 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span>Tutup Sidebar</span>}
        </button>
      </div>
    </motion.aside>
  );
}
