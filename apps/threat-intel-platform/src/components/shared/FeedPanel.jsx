import { liveFeed } from '../../data/intelData';
import SectionHeading from '../ui/SectionHeading';

export default function FeedPanel() {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Threat Feed / Live Intel Stream" subtitle="simulated platform heartbeat" />
      <div className="space-y-3">
        {liveFeed.map((item) => (
          <article key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[1.25rem] border border-white/6 bg-white/[0.03] p-4">
            <span className="h-3 w-3 rounded-full bg-gold shadow-[0_0_18px_rgba(221,183,106,0.65)]" />
            <div>
              <div className="text-sm font-medium text-ivory">{item.title}</div>
              <div className="mt-1 text-xs leading-6 text-muted">{item.body}</div>
            </div>
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">{item.age}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
