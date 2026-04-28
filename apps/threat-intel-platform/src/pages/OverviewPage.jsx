import { useOutletContext } from 'react-router-dom';
import { executiveMetrics } from '../data/intelData';
import MetricCard from '../components/shared/MetricCard';
import ThreatScorePanel from '../components/shared/ThreatScorePanel';
import ProfileCard from '../components/shared/ProfileCard';
import ActivityChart from '../components/shared/ActivityChart';
import FeedPanel from '../components/shared/FeedPanel';
import EntityPanels from '../components/shared/EntityPanels';
import ActionPanel from '../components/shared/ActionPanel';
import EmptyState from '../components/ui/EmptyState';

export default function OverviewPage() {
  const { result, loading } = useOutletContext();

  if (!result) {
    return (
      <EmptyState
        eyebrow="Initializing intelligence surface"
        title={loading ? 'Loading current threat snapshot…' : 'No threat snapshot loaded'}
        description="The mock enrichment pipeline is preparing the current overview state."
      />
    );
  }

  return (

    <div className="space-y-5">
      <section className="panel-strong rounded-[1.9rem] p-6">
        <div className="label-caps text-gold">Executive CTI overview</div>
        <div className="mt-3 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.04em] text-ivory">
              Intelligence surface for <span className="text-gradient-gold">{result.title || result.query}</span>
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-8 text-muted">
              This dashboard summarizes enrichment, source confidence, correlation, MITRE hints and analyst actions
              from the current indicator. It is designed as a strategic threat intelligence module, not a SOC alert queue.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-gold/14 bg-gold/10 p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Current verdict</div>
            <div className="mt-2 text-2xl font-black text-gold-soft">{result.disposition || result.severity}</div>
            <div className="mt-1 text-sm text-muted">Threat score {result.threatScore}</div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {executiveMetrics.map((metric, index) => (
          <MetricCard key={metric.label} metric={metric} index={index} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]">
        <ThreatScorePanel result={result} />
        <ProfileCard result={result} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.92fr)]">
        <ActivityChart />
        <FeedPanel />
      </section>

      <EntityPanels result={result} />
      <ActionPanel notes={result.notes} />
    </div>
  );
}