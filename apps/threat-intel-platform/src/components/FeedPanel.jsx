import { feedItems } from '../data/mockData';
import SectionHeading from './ui/SectionHeading';

export default function FeedPanel() {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Live Intel Stream" subtitle="Simulated platform heartbeat" />
      <div className="space-y-3">
        {feedItems.map((item) => (
          <article key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[1.2rem] border border-gold/12 bg-white/4 p-4">
            <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_16px_rgba(255,180,76,0.8)]" />
            <div>
              <h3 className="text-sm font-semibold text-ivory">{item.title}</h3>
              <p className="mt-1 text-xs leading-6 text-muted">{item.body}</p>
            </div>
            <span className="text-xs text-muted">{item.age}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
