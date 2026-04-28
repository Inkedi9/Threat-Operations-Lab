import { indicatorFields, indicatorTags } from '../data/mockData';
import SectionHeading from './ui/SectionHeading';
import TagChip from './ui/TagChip';

export default function IndicatorProfileCard() {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Indicator Identity Card" subtitle="Adapted profile · IPv4" />
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {indicatorFields.map(([label, value]) => (
          <div key={label} className="rounded-[1rem] border border-white/5 bg-white/3 p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
            <div className={`mt-2 text-sm font-semibold text-ivory ${label === 'Indicator' ? 'font-mono' : ''}`}>{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {indicatorTags.map((tag) => (
          <TagChip key={tag}>{tag}</TagChip>
        ))}
      </div>
    </section>
  );
}
