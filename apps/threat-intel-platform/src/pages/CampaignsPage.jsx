import { Link, useOutletContext } from 'react-router-dom';
import { campaigns } from '../data/intelData';
import TagChip from '../components/ui/TagChip';

export default function CampaignsPage() {
  const { handleLookup } = useOutletContext();

  return (
    <div className="space-y-5">
      <section className="panel rounded-[1.9rem] p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="label-caps text-gold">Campaign Investigation</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-ivory">Threat Campaign Clusters</h2>
          </div>
          <div className="text-sm text-muted">Phase 3 adds dedicated detail routes for every campaign</div>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="premium-hover rounded-[1.5rem] border border-white/6 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xl font-bold text-ivory">{campaign.name}</div>
                <span className="rounded-full border border-gold/15 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-soft">
                  {campaign.severity}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{campaign.summary}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3"><span className="text-muted">Confidence</span><strong className="text-ivory">{campaign.confidence}%</strong></div>
                <div className="flex justify-between gap-3"><span className="text-muted">Infra overlap</span><strong className="text-ivory">{campaign.overlap}%</strong></div>
                <div className="flex justify-between gap-3"><span className="text-muted">Timeline</span><strong className="text-ivory">{campaign.timelineWindow}</strong></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {campaign.sectors.map((sector) => <TagChip key={sector}>{sector}</TagChip>)}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleLookup(campaign.malwareFamilies[0] || campaign.name.toLowerCase())}
                  className="rounded-2xl border border-gold/18 bg-gold/10 px-4 py-3 text-sm font-medium text-gold-soft transition hover:border-gold/28 hover:bg-gold/14"
                >
                  Pivot lookup
                </button>
                <Link
                  to={`/campaigns/${campaign.id}`}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center text-sm font-medium text-ivory transition hover:border-gold/20"
                >
                  Open detail page
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
