import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = 'Memuat...', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 sm:py-12 gap-3 sm:gap-4 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} rounded-full border-slate-200 border-t-blue-600`}
      />
      {text && <p className="text-xs sm:text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-slate-200 border-t-blue-600 mx-auto mb-3 sm:mb-4"
        />
        <p className="text-sm sm:text-base text-slate-500 font-medium">Memuat halaman...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ size = 'sm' }) {
  const sizes = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} rounded-full border-slate-300 border-t-blue-600 inline-block`}
    />
  );
}
