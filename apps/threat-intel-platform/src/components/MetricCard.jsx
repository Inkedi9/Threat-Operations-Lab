import { motion } from 'framer-motion';
import { toneMap, cn } from '../lib/utils';

function Sparkline({ points, tone }) {
  const color = {
    good: 'rgba(83,216,168,.95)',
    bad: 'rgba(255,108,95,.92)',
    warn: 'rgba(255,180,76,.95)',
    info: 'rgba(89,213,208,.95)',
  }[tone] ?? 'rgba(221,183,106,.95)';

  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${index * 12.5} ${point}`).join(' ');
  return (
    <svg className="h-8 w-24" viewBox="0 0 100 30" fill="none">
      <path d={path} stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default function MetricCard({ metric, index }) {
  const toneClasses = toneMap[metric.tone] ?? toneMap.gold;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="panel premium-hover relative overflow-hidden rounded-[1.65rem] p-5"
    >
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-gold/12 blur-2xl" />
      <div className="text-[11px] uppercase tracking-[0.22em] text-muted">{metric.label}</div>
      <div className="mt-3 text-4xl font-black tracking-[-0.06em] text-ivory">{metric.value}</div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className={cn('text-sm font-medium', toneClasses.text)}>{metric.change}</span>
        <Sparkline points={metric.spark} tone={metric.tone} />
      </div>
    </motion.article>
  );
}
