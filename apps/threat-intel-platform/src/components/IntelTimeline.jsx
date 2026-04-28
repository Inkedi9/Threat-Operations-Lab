import { timelineItems } from '../data/mockData';
import SectionHeading from './ui/SectionHeading';

export default function IntelTimeline() {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Intel Timeline" subtitle="First seen → correlation escalation" />
      <div className="space-y-3">
        {timelineItems.map((item) => (
          <article key={item.title} className="rounded-[1.2rem] border border-gold/12 bg-white/4 p-4 md:grid md:grid-cols-[5.5rem_minmax(0,1fr)] md:gap-4">
            <div className="label-caps text-gold">{item.date}</div>
            <div>
              <h3 className="text-base font-semibold text-ivory">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
