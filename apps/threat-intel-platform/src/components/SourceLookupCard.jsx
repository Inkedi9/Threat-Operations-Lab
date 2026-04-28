import { motion } from 'framer-motion';
import { cn, toneMap } from '../lib/utils';
import StatusBadge from './ui/StatusBadge';
import TagChip from './ui/TagChip';

export default function SourceLookupCard({ source, index }) {
  const toneClasses = toneMap[source.tone] ?? toneMap.gold;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 + index * 0.05 }}
      className={cn('panel relative overflow-hidden rounded-[1.6rem] p-5', toneClasses.glow)}
    >
      <div className={cn('absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-current', toneClasses.text)} />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-ivory">{source.name}</div>
          <div className="mt-1 text-xs text-muted">response: {source.responseTime} ms</div>
        </div>
        <StatusBadge tone={source.tone}>{source.verdict}</StatusBadge>
      </div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm text-muted">
        <span>{source.statLabel}</span>
        <strong className="text-ivory">{source.statValue}</strong>
      </div>
      <div className="h-2 overflow-hidden rounded-full border border-white/6 bg-white/4">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r from-gold/35 to-current', toneClasses.text)}
          style={{ width: `${source.confidence}%` }}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {source.tags.map((tag) => (
          <TagChip key={tag}>{tag}</TagChip>
        ))}
      </div>
    </motion.article>
  );
}
