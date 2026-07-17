import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Loader2, XCircle, CircleCheckBig } from 'lucide-react';
import { getStatusConfig } from '../../utils/statusColor';
import { formatDateTime } from '../../utils/formatDate';

const iconMap = {
  Clock,
  Loader2,
  XCircle,
  CheckCircle2,
  CircleCheckBig,
};

const steps = ['menunggu', 'diproses', 'disetujui', 'selesai'];

export default function Timeline({ currentStatus, timestamps = {} }) {
  const isDitolak = currentStatus === 'ditolak';
  const activeSteps = isDitolak
    ? ['menunggu', 'diproses', 'ditolak']
    : steps;

  return (
    <div className="space-y-0">
      {activeSteps.map((step, index) => {
        const config = getStatusConfig(step);
        const Icon = iconMap[config.icon] || Clock;
        const isActive = activeSteps.indexOf(currentStatus) >= index;
        const isCurrent = currentStatus === step;

        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            {/* Timeline line & dot */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center shrink-0
                  transition-all duration-300
                  ${isCurrent
                    ? `${config.bg} ${config.text} ring-4 ring-offset-2 ${config.border}`
                    : isActive
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              {index < activeSteps.length - 1 && (
                <div
                  className={`w-0.5 h-12 my-1 transition-all duration-300 ${
                    isActive ? 'bg-emerald-300' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-8">
              <p
                className={`font-semibold text-sm ${
                  isCurrent ? config.text : isActive ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {config.label}
              </p>
              {timestamps[step] && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDateTime(timestamps[step])}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
