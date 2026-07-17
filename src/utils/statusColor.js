export const statusConfig = {
  menunggu: {
    label: 'Menunggu Verifikasi',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    icon: 'Clock',
  },
  diproses: {
    label: 'Sedang Diproses',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
    icon: 'Loader2',
  },
  ditolak: {
    label: 'Ditolak',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    icon: 'XCircle',
  },
  disetujui: {
    label: 'Disetujui',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    icon: 'CheckCircle2',
  },
  selesai: {
    label: 'Selesai',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600',
    icon: 'CircleCheckBig',
  },
};

export function getStatusConfig(status) {
  return statusConfig[status] || statusConfig.menunggu;
}
