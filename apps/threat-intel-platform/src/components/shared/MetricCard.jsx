import { motion } from 'framer-motion';
import { cn, toneMap } from '../../lib/utils';

export default function MetricCard({ metric, index = 0 }) {
  const tone = toneMap[metric.tone] || toneMap.gold;
  const points = metric.spark
    .map((value, pointIndex) => `${(pointIndex / (metric.spark.length - 1)) * 100},${40 - value / 1.5}`)
    .join(' ');

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      className="panel rounded-[1.7rem] p-5"
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{metric.label}</div>
      <div className="mt-3 text-3xl font-black tracking-tight text-ivory">{metric.value}</div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <span className={cn('text-xs font-semibold', tone.text)}>{metric.delta}</span>
        <svg viewBox="0 0 100 40" className="h-9 w-24 opacity-90">
          <polyline fill="none" stroke="currentColor" strokeWidth="3" className={tone.text} points={points} />
        </svg>
      </div>
    </motion.article>
  );
}
