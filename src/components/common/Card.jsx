import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  glass = false,
  padding = 'p-6',
  onClick,
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;
  
  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={hover && !onClick ? { y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={`
        rounded-2xl border transition-all duration-300
        ${glass
          ? 'bg-white/70 backdrop-blur-xl border-white/20 shadow-lg'
          : 'bg-white border-slate-200/60 shadow-sm hover:shadow-md'
        }
        ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
        ${padding}
        ${onClick ? 'cursor-pointer active:scale-95' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-3 sm:mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base sm:text-lg font-bold text-slate-800 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
