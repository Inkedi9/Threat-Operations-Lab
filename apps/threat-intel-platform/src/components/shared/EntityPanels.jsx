import { resolveActors, resolveCampaigns } from '../../lib/engine';
import SectionHeading from '../ui/SectionHeading';
import TagChip from '../ui/TagChip';

function PanelCard({ title, subtitle, name, summary, lines, chips = [] }) {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="text-2xl font-black tracking-tight text-ivory">{name}</div>
      <p className="mt-3 text-sm leading-7 text-muted">{summary}</p>
      <div className="mt-4 divide-y divide-white/5">
        {lines.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-muted">{label}</span>
            <strong className="text-right text-ivory">{value}</strong>
          </div>
        ))}
      </div>
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <TagChip key={chip}>{chip}</TagChip>
          ))}
        </div>
      )}
    </section>
  );
}

export default function EntityPanels({ result }) {
  const linkedCampaign = resolveCampaigns(result.campaigns)[0];
  const linkedActor = resolveActors(result.actors)[0];

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <PanelCard
        title="Campaigns Section"
        subtitle="linked operation"
        name={linkedCampaign?.name || 'No linked campaign'}
        summary={linkedCampaign?.summary || 'No campaign in the current mock dataset is linked to this object.'}
        lines={linkedCampaign
          ? [
              ['Severity', linkedCampaign.severity],
              ['Confidence', `${linkedCampaign.confidence}%`],
              ['Regions', linkedCampaign.regions.join(' · ')],
              ['Timeline', linkedCampaign.timelineWindow],
            ]
          : [['Status', 'No campaign mapping']]}
        chips={linkedCampaign?.malwareFamilies || []}
      />
      <PanelCard
        title="Threat Actor Section"
        subtitle="attribution snapshot"
        name={linkedActor?.name || 'No linked actor'}
        summary={linkedActor?.summary || 'No actor mapping is currently defined for this lookup.'}
        lines={linkedActor
          ? [
              ['Aliases', linkedActor.aliases.join(' · ')],
              ['Sophistication', linkedActor.sophistication],
              ['Confidence', `${linkedActor.confidence}%`],
              ['Primary Sectors', linkedActor.sectors.join(' · ')],
            ]
          : [['Status', 'No actor mapping']]}
        chips={linkedActor?.ttps || []}
      />
    </div>
  );
}
