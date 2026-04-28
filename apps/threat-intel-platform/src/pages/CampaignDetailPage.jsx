import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom';
import { getCampaignById, getRecordsForCampaign, resolveActors } from '../lib/engine';
import TagChip from '../components/ui/TagChip';
import TimelinePanel from '../components/shared/TimelinePanel';
import RelationshipMap from '../components/shared/RelationshipMap';

function MetricStrip({ items }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {items.map(([label, value]) => (
        <article key={label} className="rounded-[1.35rem] border border-white/6 bg-white/[0.03] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
          <div className="mt-2 text-xl font-black text-ivory">{value}</div>
        </article>
      ))}
    </div>
  );
}

function buildCampaignGraph(campaign, records, actors) {
  const relations = [
    {
      id: `campaign-${campaign.id}`,
      label: `Campaign · ${campaign.name}`,
      type: 'campaign',
      risk: campaign.severity === 'critical' ? 'bad' : 'warn',
      x: 50,
      y: 46,
    },
    ...records.slice(0, 4).map((record, index) => ({
      id: `record-${record.id}`,
      label: `${record.type} · ${record.title.length > 22 ? `${record.title.slice(0, 22)}…` : record.title}`,
      type: record.type.toLowerCase(),
      risk: record.threatScore >= 85 ? 'bad' : record.threatScore >= 70 ? 'warn' : 'info',
      x: [18, 30, 74, 82][index] || 26,
      y: [24, 74, 26, 70][index] || 68,
    })),
    ...actors.slice(0, 2).map((actor, index) => ({
      id: `actor-${actor.id}`,
      label: `Actor · ${actor.name}`,
      type: 'actor',
      risk: actor.confidence >= 85 ? 'bad' : 'warn',
      x: [68, 84][index] || 78,
      y: [74, 48][index] || 58,
    })),
  ];

  const edges = [];

  records.slice(0, 4).forEach((record) => {
    edges.push([`campaign-${campaign.id}`, `record-${record.id}`]);
  });

  actors.slice(0, 2).forEach((actor) => {
    edges.push([`campaign-${campaign.id}`, `actor-${actor.id}`]);
  });

  if (records[0] && records[1]) edges.push([`record-${records[0].id}`, `record-${records[1].id}`]);
  if (records[2] && records[3]) edges.push([`record-${records[2].id}`, `record-${records[3].id}`]);

  return { relations, edges };
}

export default function CampaignDetailPage() {
  const { campaignId } = useParams();
  const { handleLookup } = useOutletContext();
  const campaign = getCampaignById(campaignId);

  if (!campaign) return <Navigate to="/campaigns" replace />;

  const records = getRecordsForCampaign(campaign.id);
  const relatedActors = resolveActors(campaign.actorIds || []);

  const averageThreatScore = records.length
    ? Math.round(records.reduce((sum, record) => sum + record.threatScore, 0) / records.length)
    : 0;

  const uniqueTypes = [...new Set(records.map((record) => record.type))];
  const topTags = [...new Set(records.flatMap((record) => record.tags || []))].slice(0, 8);

  const graph = buildCampaignGraph(campaign, records, relatedActors);

  const timeline = [
    {
      date: 'Initial',
      title: 'Campaign seeded',
      body: `${campaign.name} entered the mocked CTI corpus as a structured campaign object with a ${campaign.severity} severity label.`,
    },
    {
      date: 'Infra',
      title: 'Infrastructure overlap increased',
      body: `${campaign.overlap}% infrastructure overlap observed across linked domains, IPs and delivery artifacts.`,
    },
    {
      date: 'Intel',
      title: 'Enrichment sources converged',
      body: `${records.length} mapped artifacts now support the campaign narrative with cross-source enrichment and confidence layering.`,
    },
    {
      date: 'Current',
      title: 'Analyst focus maintained',
      body: `Campaign remains relevant within ${campaign.timelineWindow} and continues to justify investigation pivots.`,
    },
  ];

  return (
    <div className="space-y-5">
      <section className="panel-strong relative overflow-hidden rounded-[2rem] p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(221,183,106,0.16),transparent_24%),linear-gradient(135deg,transparent,rgba(255,255,255,0.03),transparent_62%)]" />
        <div className="relative">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="label-caps text-gold">Campaign intelligence dossier</div>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-ivory sm:text-5xl">
                {campaign.name}
              </h2>
              <p className="mt-4 text-sm leading-8 text-muted">{campaign.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <TagChip>{campaign.severity}</TagChip>
                <TagChip>{campaign.timelineWindow}</TagChip>
                {campaign.malwareFamilies.map((family) => (
                  <TagChip key={family}>{family}</TagChip>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Narrative</div>
                  <div className="mt-2 text-sm font-semibold text-ivory">Strategic campaign context</div>
                </div>

                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Use case</div>
                  <div className="mt-2 text-sm font-semibold text-ivory">CTI clustering and attribution</div>
                </div>

                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Analyst value</div>
                  <div className="mt-2 text-sm font-semibold text-ivory">Pivot and report ready</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/campaigns"
                className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-muted hover:border-gold/18 hover:text-gold-soft"
              >
                Back to campaigns
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <MetricStrip
              items={[
                ['Severity', campaign.severity],
                ['Confidence', `${campaign.confidence}%`],
                ['Infra overlap', `${campaign.overlap}%`],
                ['Mapped IoCs', records.length],
              ]}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
        <div className="space-y-5">
          <section className="panel rounded-[1.9rem] p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="label-caps text-gold">Campaign intelligence</div>
                <h3 className="mt-2 text-2xl font-black text-ivory">Operational narrative</h3>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-[1.35rem] border border-white/6 bg-black/30 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Target sectors</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {campaign.sectors.map((sector) => (
                    <TagChip key={sector}>{sector}</TagChip>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.35rem] border border-white/6 bg-black/30 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Regions</div>
                <p className="mt-3 text-sm leading-7 text-muted">{campaign.regions.join(' · ')}</p>
              </article>

              <article className="rounded-[1.35rem] border border-white/6 bg-black/30 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Malware families</div>
                <p className="mt-3 text-sm leading-7 text-muted">{campaign.malwareFamilies.join(' · ')}</p>
              </article>

              <article className="rounded-[1.35rem] border border-white/6 bg-black/30 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Analyst readout</div>
                <p className="mt-3 text-sm leading-7 text-muted">
                  This campaign combines polished lure theming, rotating infrastructure and reusable delivery mechanics,
                  making it ideal for demonstrating CTI enrichment, clustering and strategic attribution.
                </p>
              </article>
            </div>
          </section>

          <RelationshipMap result={graph} />

          <section className="panel rounded-[1.9rem] p-6">
            <div className="mb-4">
              <div className="label-caps text-gold">Campaign artifacts</div>
              <h3 className="mt-2 text-2xl font-black text-ivory">Mapped indicators</h3>
            </div>

            <div className="grid gap-3">
              {records.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => handleLookup(record.query)}
                  className="premium-hover rounded-[1.25rem] border border-white/6 bg-black/30 p-4 text-left transition hover:border-gold/18"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-ivory">{record.title}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                        {record.type} · {record.classification}
                      </div>
                    </div>
                    <div className="text-sm font-black text-gold-soft">{record.threatScore}</div>
                  </div>

                  <div className="mt-2 text-sm leading-7 text-muted">{record.summary}</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(record.tags || []).slice(0, 4).map((tag) => (
                      <TagChip key={tag}>{tag}</TagChip>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="panel rounded-[1.9rem] p-6">
            <div className="label-caps text-gold">Campaign scoring</div>
            <div className="mt-4 space-y-4">
              {[
                ['Average threat score', averageThreatScore],
                ['Campaign confidence', campaign.confidence],
                ['Infrastructure overlap', campaign.overlap],
                ['Indicator diversity', uniqueTypes.length * 20],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted">{label}</span>
                    <strong className="text-ivory">{value}%</strong>
                  </div>
                  <div className="h-2 rounded-full border border-white/6 bg-black/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold/40 via-gold to-amber shadow-[0_0_24px_rgba(221,183,106,0.26)]"
                      style={{ width: `${Math.min(100, value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel rounded-[1.9rem] p-6">
            <div className="label-caps text-gold">Associated actors</div>
            <div className="mt-4 grid gap-3">
              {relatedActors.map((actor) => (
                <Link
                  key={actor.id}
                  to={`/actors/${actor.id}`}
                  className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4 transition hover:border-gold/18"
                >
                  <div className="text-sm font-semibold text-ivory">{actor.name}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {actor.sophistication} sophistication · {actor.confidence}% confidence
                  </div>
                  <div className="mt-2 text-sm leading-7 text-muted">{actor.summary}</div>
                </Link>
              ))}
            </div>
          </section>

          <section className="panel rounded-[1.9rem] p-6">
            <div className="label-caps text-gold">Key tags</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <TagChip key={tag}>{tag}</TagChip>
              ))}
            </div>
          </section>

          <section className="panel rounded-[1.9rem] p-6">
            <div className="label-caps text-gold">Recommended CTI pivots</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <li>Pivot on registrar, cert reuse and passive DNS adjacency.</li>
              <li>Review lure reuse across sectors and regional targeting patterns.</li>
              <li>Correlate delivery artifacts with malware family overlap.</li>
              <li>Compare this campaign against emerging lookalike clusters in the workbench.</li>
            </ul>
          </section>
        </div>
      </section>

      <TimelinePanel items={timeline} />
    </div>
  );
}