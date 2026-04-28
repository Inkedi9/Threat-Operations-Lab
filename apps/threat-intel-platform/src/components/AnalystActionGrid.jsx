import { analystActions } from '../data/mockData';

export default function AnalystActionGrid() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-ivory sm:text-xl">Analyst Notes / Recommended Actions</h2>
        <span className="text-xs text-muted">operational synthesis</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {analystActions.map((item, index) => (
          <article key={item.title} className="panel rounded-[1.6rem] p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted">Recommended Action {String(index + 1).padStart(2, '0')}</div>
            <h3 className="mt-3 text-lg font-semibold text-ivory">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
