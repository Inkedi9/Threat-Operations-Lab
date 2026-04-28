import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom';
import { getActorById, getRecordsForActor, resolveCampaigns } from '../lib/engine';
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

function buildActorGraph(actor, records, campaigns) {
  const relations = [
    {
      id: `actor-${actor.id}`,
      label: `Actor · ${actor.name}`,
      type: 'actor',
      risk: actor.confidence >= 85 ? 'bad' : 'warn',
      x: 50,
      y: 46,
    },
    ...campaigns.slice(0, 3).map((campaign, index) => ({
      id: `campaign-${campaign.id}`,
      label: `Campaign · ${campaign.name}`,
      type: 'campaign',
      risk: campaign.severity === 'critical' ? 'bad' : 'warn',
      x: [24, 76, 50][index] || 70,
      y: [26, 28, 78][index] || 26,
    })),
    ...records.slice(0, 3).map((record, index) => ({
      id: `record-${record.id}`,
      label: `${record.type} · ${record.title.length > 20 ? `${record.title.slice(0, 20)}…` : record.title}`,
      type: record.type.toLowerCase(),
      risk: record.threatScore >= 85 ? 'bad' : record.threatScore >= 70 ? 'warn' : 'info',
      x: [20, 80, 28][index] || 78,
      y: [72, 70, 48][index] || 60,
    })),
  ];

  const edges = [];

  campaigns.slice(0, 3).forEach((campaign) => {
    edges.push([`actor-${actor.id}`, `campaign-${campaign.id}`]);
  });

  records.slice(0, 3).forEach((record) => {
    edges.push([`actor-${actor.id}`, `record-${record.id}`]);
  });

  if (campaigns[0] && records[0]) edges.push([`campaign-${campaigns[0].id}`, `record-${records[0].id}`]);
  if (campaigns[1] && records[1]) edges.push([`campaign-${campaigns[1].id}`, `record-${records[1].id}`]);

  return { relations, edges };
}

export default function ActorDetailPage() {
  const { actorId } = useParams();
  const { handleLookup } = useOutletContext();
  const actor = getActorById(actorId);

  if (!actor) return <Navigate to="/actors" replace />;

  const records = getRecordsForActor(actor.id);
  const linkedCampaigns = resolveCampaigns(actor.campaignIds || []);
  const graph = buildActorGraph(actor, records, linkedCampaigns);

  const averageThreatScore = records.length
    ? Math.round(records.reduce((sum, record) => sum + record.threatScore, 0) / records.length)
    : 0;

  const topTags = [...new Set(records.flatMap((record) => record.tags || []))].slice(0, 8);

  const timeline = [
    {
      date: 'Seed',
      title: 'Actor profile initialized',
      body: `${actor.name} was modeled as a strategic CTI object with an initial ${actor.confidence}% attribution confidence.`,
    },
    {
      date: 'Linkage',
      title: 'Campaign overlap established',
      body: `${linkedCampaigns.length} campaign relationships reinforce the attribution surface and strengthen operational context.`,
    },
    {
      date: 'TTPs',
      title: 'Behavioral patterns stabilized',
      body: `TTP clustering highlights recurring tradecraft across phishing, delivery and infrastructure camouflage patterns.`,
    },
    {
      date: 'Current',
      title: 'Analyst profile active',
      body: `Profile remains useful for attribution storytelling, sector targeting analysis and future campaign pivots.`,
    },
  ];

  return (
    <div className="space-y-5">
      <section className="panel-strong relative overflow-hidden rounded-[2rem] p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(221,183,106,0.16),transparent_24%),linear-gradient(135deg,transparent,rgba(255,255,255,0.03),transparent_62%)]" />
        <div className="relative">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="label-caps text-gold">Threat actor attribution dossier</div>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-ivory sm:text-5xl">
                {actor.name}
              </h2>
              <p className="mt-4 text-sm leading-8 text-muted">{actor.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <TagChip>{actor.sophistication} sophistication</TagChip>
                <TagChip>{actor.confidence}% confidence</TagChip>
                {actor.aliases.map((alias) => (
                  <TagChip key={alias}>{alias}</TagChip>
                ))}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Attribution</div>
                  <div className="mt-2 text-sm font-semibold text-ivory">Confidence-weighted profile</div>
                </div>

                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Tradecraft</div>
                  <div className="mt-2 text-sm font-semibold text-ivory">TTP and campaign overlap</div>
                </div>

                <div className="rounded-[1.2rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Analyst value</div>
                  <div className="mt-2 text-sm font-semibold text-ivory">Hunting and reporting ready</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/actors"
                className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-muted hover:border-gold/18 hover:text-gold-soft"
              >
                Back to actors
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <MetricStrip
              items={[
                ['Sophistication', actor.sophistication],
                ['Confidence', `${actor.confidence}%`],
                ['Campaigns', linkedCampaigns.length],
                ['Mapped IoCs', records.length],
              ]}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
        <div className="space-y-5">
          <section className="panel rounded-[1.9rem] p-6">
            <div className="mb-4">
              <div className="label-caps text-gold">Actor intelligence</div>
              <h3 className="mt-2 text-2xl font-black text-ivory">Attribution profile</h3>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-[1.35rem] border border-white/6 bg-black/30 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Regional footprint</div>
                <p className="mt-3 text-sm leading-7 text-muted">{actor.regions.join(' · ')}</p>
              </article>

              <article className="rounded-[1.35rem] border border-white/6 bg-black/30 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Primary sectors</div>
                <p className="mt-3 text-sm leading-7 text-muted">{actor.sectors.join(' · ')}</p>
              </article>

              <article className="rounded-[1.35rem] border border-white/6 bg-black/30 p-4 lg:col-span-2">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted">TTP summary</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {actor.ttps.map((ttp) => (
                    <TagChip key={ttp}>{ttp}</TagChip>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <RelationshipMap result={graph} />

          <section className="panel rounded-[1.9rem] p-6">
            <div className="mb-4">
              <div className="label-caps text-gold">Mapped indicators</div>
              <h3 className="mt-2 text-2xl font-black text-ivory">Observed artifacts</h3>
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
            <div className="label-caps text-gold">Attribution scoring</div>
            <div className="mt-4 space-y-4">
              {[
                ['Attribution confidence', actor.confidence],
                ['Average IoC threat score', averageThreatScore],
                ['Campaign linkage strength', Math.min(100, linkedCampaigns.length * 28)],
                ['Tradecraft breadth', Math.min(100, actor.ttps.length * 16)],
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
            <div className="label-caps text-gold">Campaign attribution</div>
            <div className="mt-4 grid gap-3">
              {linkedCampaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  to={`/campaigns/${campaign.id}`}
                  className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4 transition hover:border-gold/18"
                >
                  <div className="text-sm font-semibold text-ivory">{campaign.name}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {campaign.severity} · {campaign.confidence}% confidence
                  </div>
                  <div className="mt-2 text-sm leading-7 text-muted">{campaign.summary}</div>
                </Link>
              ))}
            </div>
          </section>

          <section className="panel rounded-[1.9rem] p-6">
            <div className="label-caps text-gold">Dominant tags</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <TagChip key={tag}>{tag}</TagChip>
              ))}
            </div>
          </section>

          <section className="panel rounded-[1.9rem] p-6">
            <div className="label-caps text-gold">Recommended CTI pivots</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <li>Compare this actor against adjacent campaign clusters.</li>
              <li>Track repeated TTP motifs across phishing and loader delivery paths.</li>
              <li>Pivot into infrastructure camouflage and brand impersonation overlap.</li>
              <li>Use the workbench to build attribution notes and saved hypotheses.</li>
            </ul>
          </section>
        </div>
      </section>

      <TimelinePanel items={timeline} />
    </div>
  );
}