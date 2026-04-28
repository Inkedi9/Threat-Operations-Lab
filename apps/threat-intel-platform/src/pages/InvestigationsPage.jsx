import { Link, useOutletContext } from 'react-router-dom';
import SourceMatrix from '../components/shared/SourceMatrix';
import RelationshipMap from '../components/shared/RelationshipMap';
import TimelinePanel from '../components/shared/TimelinePanel';
import ActionPanel from '../components/shared/ActionPanel';
import EntityPanels from '../components/shared/EntityPanels';
import { buildGraphStats, getRelatedRecords, resolveActors, resolveCampaigns } from '../lib/engine';
import TagChip from '../components/ui/TagChip';
import { mapMitreFromResult } from '../lib/mitre';
import MitrePanel from '../components/intel/MitrePanel';
import EmptyState from '../components/ui/EmptyState';

export default function InvestigationsPage() {
  const { result, handleLookup, loading } = useOutletContext();
  if (!result) {
    return (
      <EmptyState
        eyebrow="Investigation surface"
        title={loading ? 'Running lookup…' : 'No investigation loaded'}
        description="Launch a lookup from the hero search bar to populate enrichment, timeline, source matrix and analyst pivots."
      />
    );
  }
  const graphStats = buildGraphStats(result);

  const relatedRecords = getRelatedRecords(result);
  const relatedCampaigns = resolveCampaigns(result.campaigns || []);
  const relatedActors = resolveActors(result.actors || []);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-4">
        {[
          ['Source overlap', `${(result.sources || []).length} feeds`, 'Multi-source enrichment coverage'],
          ['Relationship graph', `${graphStats.totalNodes} nodes / ${graphStats.totalEdges} links`, 'Mapped CTI relationships'],
          ['Linked campaigns', relatedCampaigns.length || 'none', 'Campaign-level context'],
          ['Linked actors', relatedActors.length || 'none', 'Attribution candidates'],
        ].map(([label, value, hint]) => (
          <article key={label} className="panel premium-hover rounded-[1.4rem] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
            <div className="mt-2 text-xl font-black text-ivory">{value}</div>
            <div className="mt-2 text-xs leading-6 text-muted">{hint}</div>
          </article>
        ))}
      </section>

      <SourceMatrix sources={result.sources} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <RelationshipMap result={result} />
        <TimelinePanel items={result.timeline} />
      </section>

      <EntityPanels result={result} />
      <MitrePanel techniques={mapMitreFromResult(result)} />

      <section className="panel rounded-[1.9rem] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="label-caps text-gold">Investigation pivots</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-ivory">Related artifacts and intelligence pivots</h2>
          </div>
          <Link to={`/reports?q=${encodeURIComponent(result.query)}`} className="rounded-xl border border-gold/18 bg-gold/10 px-4 py-3 text-sm text-gold-soft hover:border-gold/28">
            Generate report
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
          <div className="rounded-[1.5rem] border border-white/6 bg-white/[0.03] p-5">
            <div className="text-sm font-semibold text-ivory">Connected records</div>
            <div className="mt-4 grid gap-3">
              {relatedRecords.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => handleLookup(record.query)}
                  className="premium-hover rounded-[1rem] border border-white/6 bg-black/30 p-4 text-left hover:border-gold/18"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-ivory">{record.title}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{record.type}</div>
                    </div>
                    <div className="text-sm font-black text-gold-soft">{record.threatScore}</div>
                  </div>
                  <div className="mt-2 text-sm leading-7 text-muted">{record.summary}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/6 bg-white/[0.03] p-5">
            <div className="text-sm font-semibold text-ivory">Current tag profile</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(result.tags || []).map((tag) => (
                <TagChip key={tag}>{tag}</TagChip>
              ))}
            </div>
            <div className="mt-5 text-sm leading-8 text-muted">
              This route acts as the analyst pivot surface. From here, the current IoC can be expanded into campaign context, actor attribution, comparison workflows, hunting hypotheses and report generation. <span className="text-gold-soft">campaign</span>, <span className="text-gold-soft">actor</span>, le <span className="text-gold-soft">compare mode</span> ou le <span className="text-gold-soft">report generator</span>.
            </div>
          </div>
        </div>
      </section>

      <ActionPanel notes={result.notes} />
    </div>
  );
}
