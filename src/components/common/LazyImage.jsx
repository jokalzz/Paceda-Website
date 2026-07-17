import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LazyImage({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-video',
  objectFit = 'object-cover',
  placeholder = 'blur',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} bg-slate-100 ${className}`}>
      {/* Placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="text-center text-slate-400 text-sm">
            <svg className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gambar gagal dimuat
          </div>
        </div>
      )}

      {/* Image */}
      {src && !error && (
        <motion.img
          src={src}
          alt={alt || 'Image'}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full ${objectFit} ${isLoaded ? 'block' : 'hidden'}`}
          {...props}
        />
      )}

      {/* Blur placeholder effect */}
      {placeholder === 'blur' && !isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 animate-pulse" />
      )}
    </div>
  );
}

// Avatar component with lazy loading
export function LazyAvatar({ src, alt, size = 'md', fallback, className = '' }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div className={`relative rounded-full overflow-hidden ${sizes[size]} bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ${className}`}>
      {src && !error ? (
        <motion.img
          src={src}
          alt={alt || 'Avatar'}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full object-cover ${isLoaded ? 'block' : 'hidden'}`}
        />
      ) : null}
      
      {(!src || error || !isLoaded) && (
        <span className="text-white font-bold">
          {fallback || (alt ? alt[0]?.toUpperCase() : '?')}
        </span>
      )}
    </div>
  );
}
