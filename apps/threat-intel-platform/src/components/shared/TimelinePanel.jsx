import SectionHeading from '../ui/SectionHeading';

export default function TimelinePanel({ items }) {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Intel Timeline" subtitle="first seen → correlation escalation" />
      <div className="space-y-4">
        {items.map((item) => (
          <article key={`${item.date}-${item.title}`} className="grid gap-4 rounded-[1.3rem] border border-white/6 bg-white/[0.03] p-4 sm:grid-cols-[5rem_minmax(0,1fr)]">
            <div className="text-xs uppercase tracking-[0.18em] text-gold">{item.date}</div>
            <div>
              <h3 className="text-sm font-semibold text-ivory">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
