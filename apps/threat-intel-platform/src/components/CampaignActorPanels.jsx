import { actor, campaign } from '../data/mockData';
import SectionHeading from './ui/SectionHeading';

function InfoPanel({ title, subtitle, name, summary, stats }) {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="text-2xl font-black tracking-tight text-ivory">{name}</div>
      <p className="mt-3 text-sm leading-7 text-muted">{summary}</p>
      <div className="mt-4 divide-y divide-white/5">
        {stats.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-muted">{label}</span>
            <strong className="text-right text-ivory">{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CampaignActorPanels() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <InfoPanel title="Campaign Cluster" subtitle="Linked operation" name={campaign.name} summary={campaign.summary} stats={campaign.stats} />
      <InfoPanel title="Threat Actor Profile" subtitle="Attribution snapshot" name={actor.name} summary={actor.summary} stats={actor.stats} />
    </div>
  );
}
