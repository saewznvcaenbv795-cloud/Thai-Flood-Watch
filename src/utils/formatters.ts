export const fmt = (v: number | null | undefined, d = 0): string => {
  if (v === null || v === undefined || Number.isNaN(v)) return '–';
  return v.toLocaleString('th-TH', {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
};

export const ago = (dateInput: Date | string | null | undefined): string => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (!date || Number.isNaN(date.getTime())) return '';

  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'เมื่อสักครู่';
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ชม.ที่แล้ว`;
  const days = Math.round(hours / 24);
  return `${days} วันที่แล้ว`;
};

export const clock = (dateInput: Date | string | null | undefined): string => {
  if (!dateInput) return '–';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (!date || Number.isNaN(date.getTime())) return '–';
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  }) + ' น.';
};

export interface LevelConfig {
  label: string;
  badgeClass: string;
  textClass: string;
  dotColor: string;
  borderClass: string;
}

export const LEVELS: Record<number, LevelConfig> = {
  5: {
    label: 'ล้นตลิ่ง',
    badgeClass: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40',
    textClass: 'text-red-600 dark:text-red-400',
    dotColor: '#d7263d',
    borderClass: 'border-red-500',
  },
  4: {
    label: 'น้ำมาก',
    badgeClass: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40',
    textClass: 'text-amber-600 dark:text-amber-400',
    dotColor: '#ea7a16',
    borderClass: 'border-amber-500',
  },
  3: {
    label: 'ปกติ',
    badgeClass: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    dotColor: '#279b63',
    borderClass: 'border-emerald-500',
  },
  2: {
    label: 'น้ำน้อย',
    badgeClass: 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border-yellow-500/40',
    textClass: 'text-yellow-600 dark:text-yellow-400',
    dotColor: '#be9719',
    borderClass: 'border-yellow-500',
  },
  1: {
    label: 'น้อยวิกฤต',
    badgeClass: 'bg-amber-900/20 text-amber-950 dark:text-amber-200 border-amber-900/40',
    textClass: 'text-amber-800 dark:text-amber-500',
    dotColor: '#875727',
    borderClass: 'border-amber-800',
  },
};

export const getRainCategory = (mm: number): { label: string; color: string; badgeClass: string } => {
  if (mm > 90) {
    return {
      label: 'ฝนหนักมาก (>90 มม.)',
      color: '#3a4ed7',
      badgeClass: 'bg-blue-600 text-white font-semibold',
    };
  }
  if (mm > 35) {
    return {
      label: 'ฝนหนัก (35–90 มม.)',
      color: '#4f6bf5',
      badgeClass: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
    };
  }
  if (mm > 10) {
    return {
      label: 'ฝนปานกลาง',
      color: '#60a5fa',
      badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20',
    };
  }
  return {
    label: 'ฝนเล็กน้อย',
    color: '#93c5fd',
    badgeClass: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-400/20',
  };
};
