import { motion } from 'framer-motion';
import { cn, toneMap } from '../../lib/utils';
import StatusBadge from '../ui/StatusBadge';
import TagChip from '../ui/TagChip';
import SectionHeading from '../ui/SectionHeading';

export default function SourceMatrix({ sources }) {
  return (
    <section className="panel premium-hover rounded-[1.9rem] p-6">
      <SectionHeading title="Multi-Source Lookup Orchestration" subtitle={`${sources.length}/${sources.length} completed`} />
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {sources.map((source, index) => {
          const tone = toneMap[source.tone] || toneMap.info;
          return (
            <motion.article
              key={source.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn('rounded-[1.4rem] border p-4', tone.border, tone.glow, 'bg-white/[0.03]')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-ivory">{source.name}</div>
                  <div className="mt-1 text-xs text-muted">response: {source.response} ms</div>
                </div>
                <StatusBadge tone={source.tone}>{source.verdict}</StatusBadge>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted">score</span>
                <strong className="text-ivory">{source.score}</strong>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full border border-white/6 bg-white/5">
                <div className={cn('h-full rounded-full bg-gradient-to-r from-gold/35 to-gold-soft', tone.text)} style={{ width: `${source.score}%` }} />
              </div>

              <ul className="mt-4 space-y-2 text-xs leading-6 text-muted">
                {source.details.map((detail) => (
                  <li key={detail}>• {detail}</li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {source.tags.map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
