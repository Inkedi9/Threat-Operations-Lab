import TagChip from '../ui/TagChip';
import SectionHeading from '../ui/SectionHeading';

export default function ProfileCard({ result }) {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Indicator Identity Card" subtitle={`adapted profile · ${result.type}`} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {result.profile.map(([label, value]) => (
          <div key={label} className="rounded-[1.15rem] border border-white/6 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
            <div className="mt-2 text-sm font-semibold leading-6 text-ivory">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {result.tags.map((tag) => (
          <TagChip key={tag}>{tag}</TagChip>
        ))}
      </div>
    </section>
  );
}
