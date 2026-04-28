import SectionHeading from '../ui/SectionHeading';

export default function ActionPanel({ notes = [] }) {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Analyst Notes / Recommended Actions" subtitle="operational synthesis" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note, index) => (
          <article key={note} className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-gold">Action {String(index + 1).padStart(2, '0')}</div>
            <p className="mt-3 text-sm leading-7 text-muted">{note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
