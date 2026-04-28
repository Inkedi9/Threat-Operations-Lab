export const toneMap = {
  good: {
    text: 'text-success',
    bg: 'bg-success/12',
    border: 'border-success/20',
    glow: 'shadow-[0_0_28px_rgba(83,216,168,0.16)]',
  },
  warn: {
    text: 'text-amber',
    bg: 'bg-amber/12',
    border: 'border-amber/20',
    glow: 'shadow-[0_0_28px_rgba(255,180,76,0.16)]',
  },
  bad: {
    text: 'text-danger',
    bg: 'bg-danger/12',
    border: 'border-danger/20',
    glow: 'shadow-[0_0_28px_rgba(255,108,95,0.18)]',
  },
  info: {
    text: 'text-info',
    bg: 'bg-info/12',
    border: 'border-info/20',
    glow: 'shadow-[0_0_28px_rgba(89,213,208,0.16)]',
  },
  gold: {
    text: 'text-gold-soft',
    bg: 'bg-gold/10',
    border: 'border-gold/20',
    glow: 'shadow-[0_0_28px_rgba(221,183,106,0.16)]',
  },
};

export function cn(...items) {
  return items.filter(Boolean).join(' ');
}

export function normalizeTerm(value = '') {
  return value.trim().toLowerCase();
}

export function slugify(value = '') {
  return normalizeTerm(value).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function detectIndicatorType(value = '') {
  const term = value.trim();
  if (/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(term)) return 'IPv4';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term)) return 'Email';
  if (/^https?:\/\//i.test(term)) return 'URL';
  if (/^[a-f0-9]{32,64}$/i.test(term)) return 'Hash';
  if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(term)) return 'Domain';
  if (/(apt|jackal|collective|actor|group)/i.test(term)) return 'Threat Actor';
  return 'Malware / Keyword';
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
