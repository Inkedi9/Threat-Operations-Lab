import { scoreBreakdown } from '../data/mockData';
import { toneMap, cn } from '../lib/utils';
import SectionHeading from './ui/SectionHeading';

export default function ScoreBreakdown() {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Scoring Breakdown" subtitle="Mock CTI scoring signals" />
      <div className="space-y-4">
        {scoreBreakdown.map((item) => {
          const toneClasses = toneMap[item.tone] ?? toneMap.gold;
          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-xs text-muted">
                <span>{item.label}</span>
                <strong className="text-ivory">{item.value}</strong>
              </div>
              <div className="h-2 overflow-hidden rounded-full border border-white/6 bg-white/5">
                <div className={cn('h-full rounded-full bg-gradient-to-r from-gold/40 to-current', toneClasses.text)} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
