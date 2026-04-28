import { useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ArrowRightLeft, GitCompare, Radar, ShieldAlert } from 'lucide-react';
import { buildCompareResult } from '../lib/compare';
import TagChip from '../components/ui/TagChip';
import MitrePanel from '../components/intel/MitrePanel';

function ScoreRing({ label, value, tone = 'gold' }) {
  const color =
    tone === 'danger'
      ? 'from-danger via-danger to-amber'
      : tone === 'info'
        ? 'from-info via-gold to-amber'
        : 'from-gold via-gold-soft to-amber';

  return (
    <article className="panel rounded-[1.7rem] p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className="mt-5 flex items-center gap-5">
        <div className="relative grid h-28 w-28 place-items-center rounded-full border border-white/8 bg-black/50">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} opacity-25 blur-xl`}
          />
          <div className="relative text-3xl font-black text-ivory">{value}</div>
        </div>
        <div className="text-sm leading-7 text-muted">
          Normalized CTI comparison signal based on score, source, tag, actor and campaign overlap.
        </div>
      </div>
    </article>
  );
}

function IocCard({ title, result, align = 'left' }) {
  if (!result) {
    return (
      <section className="panel rounded-[1.9rem] p-6">
        <div className="label-caps text-gold">{title}</div>
        <div className="mt-3 text-sm text-muted">No IoC resolved.</div>
      </section>
    );
  }

  return (
    <section className="panel relative overflow-hidden rounded-[1.9rem] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(221,183,106,0.12),transparent_28%)]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="label-caps text-gold">{title}</div>
            <h3 className="mt-2 break-all text-2xl font-black text-ivory">{result.title || result.query}</h3>
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
              {result.type} · {result.classification || result.disposition || 'indicator'}
            </div>
          </div>

          <div className="rounded-2xl border border-gold/18 bg-gold/10 px-4 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">score</div>
            <div className="text-2xl font-black text-gold-soft">{result.threatScore}</div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-muted">{result.summary}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.1rem] border border-white/6 bg-black/30 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Severity</div>
            <div className="mt-1 text-sm font-semibold text-ivory">{result.severity}</div>
          </div>
          <div className="rounded-[1.1rem] border border-white/6 bg-black/30 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Sources</div>
            <div className="mt-1 text-sm font-semibold text-ivory">{result.sources?.length || 0}</div>
          </div>
          <div className="rounded-[1.1rem] border border-white/6 bg-black/30 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Campaigns</div>
            <div className="mt-1 text-sm font-semibold text-ivory">{result.campaigns?.length || 0}</div>
          </div>
        </div>

        <div className={`mt-5 flex flex-wrap gap-2 ${align === 'right' ? 'justify-start' : ''}`}>
          {(result.tags || []).slice(0, 8).map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverlapPanel({ compare }) {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-gold/18 bg-gold/10 text-gold-soft">
          <Radar size={18} />
        </div>
        <div>
          <div className="label-caps text-gold">Correlation overlap</div>
          <h3 className="mt-1 text-2xl font-black text-ivory">Shared intelligence signals</h3>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Shared tags</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {compare.sharedTags.length ? compare.sharedTags.map((tag) => <TagChip key={tag}>{tag}</TagChip>) : <span className="text-sm text-muted">None</span>}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Shared sources</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {compare.sharedSources.length ? compare.sharedSources.map((source) => <TagChip key={source}>{source}</TagChip>) : <span className="text-sm text-muted">None</span>}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Shared campaigns</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {compare.sharedCampaigns.length ? compare.sharedCampaigns.map((campaign) => <TagChip key={campaign}>{campaign}</TagChip>) : <span className="text-sm text-muted">None</span>}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Shared actors</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {compare.sharedActors.length ? compare.sharedActors.map((actor) => <TagChip key={actor}>{actor}</TagChip>) : <span className="text-sm text-muted">None</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

function VerdictPanel({ compare }) {
  return (
    <section className="panel-strong relative overflow-hidden rounded-[2rem] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(221,183,106,0.18),transparent_24%)]" />
      <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-center">
        <div>
          <div className="label-caps text-gold">Correlation verdict</div>
          <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-ivory">
            {compare.verdict}
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-muted">
            {compare.recommendation}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <TagChip>score delta {compare.scoreDelta}</TagChip>
            <TagChip>{compare.sharedTags.length} shared tags</TagChip>
            <TagChip>{compare.sharedSources.length} shared sources</TagChip>
            <TagChip>{compare.sharedCampaigns.length} shared campaigns</TagChip>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-gold/18 bg-black/40 p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Overlap score</div>
          <div className="mt-2 text-5xl font-black text-gold-soft">{compare.normalizedOverlap}</div>
          <div className="mt-3 h-2 rounded-full border border-white/6 bg-black/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/40 via-gold to-amber shadow-[0_0_24px_rgba(221,183,106,0.28)]"
              style={{ width: `${compare.normalizedOverlap}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CompareMitrePanel({ compare }) {
  const leftMitre = compare.leftMitre || [];
  const rightMitre = compare.rightMitre || [];
  const sharedMitre = compare.sharedMitre || [];

  return (
    <section className="panel rounded-[1.9rem] p-6">
      <div className="label-caps text-gold">MITRE ATT&CK Comparison</div>
      <h3 className="mt-2 text-2xl font-black text-ivory">
        Technique mapping across both indicators
      </h3>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <div className="rounded-[1.4rem] border border-white/6 bg-black/30 p-4">
          <div className="text-sm font-semibold text-ivory">Indicator A</div>
          <div className="mt-3 grid gap-2">
            {leftMitre.length ? (
              leftMitre.map((technique) => (
                <div key={technique.id} className="rounded-xl border border-white/6 bg-white/[0.03] p-3">
                  <div className="text-sm font-semibold text-ivory">
                    {technique.id} · {technique.name}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {technique.tactic}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted">No MITRE mapping.</div>
            )}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-gold/14 bg-gold/5 p-4">
          <div className="text-sm font-semibold text-gold-soft">Shared techniques</div>
          <div className="mt-3 grid gap-2">
            {sharedMitre.length ? (
              sharedMitre.map((technique) => (
                <div key={technique.id} className="rounded-xl border border-gold/14 bg-black/30 p-3">
                  <div className="text-sm font-semibold text-ivory">
                    {technique.id} · {technique.name}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {technique.tactic}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm leading-7 text-muted">
                No shared ATT&CK technique inferred yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/6 bg-black/30 p-4">
          <div className="text-sm font-semibold text-ivory">Indicator B</div>
          <div className="mt-3 grid gap-2">
            {rightMitre.length ? (
              rightMitre.map((technique) => (
                <div key={technique.id} className="rounded-xl border border-white/6 bg-white/[0.03] p-3">
                  <div className="text-sm font-semibold text-ivory">
                    {technique.id} · {technique.name}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                    {technique.tactic}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted">No MITRE mapping.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ComparePage() {
  const { result, handleLookup } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultLeft = searchParams.get('a') || result?.query || '185.217.143.91';
  const defaultRight = searchParams.get('b') || 'api-helion-sync.com';

  const [leftInput, setLeftInput] = useState(defaultLeft);
  const [rightInput, setRightInput] = useState(defaultRight);

  const compare = useMemo(
    () => buildCompareResult(defaultLeft, defaultRight),
    [defaultLeft, defaultRight],
  );

  const runCompare = () => {
    const a = leftInput.trim();
    const b = rightInput.trim();
    if (!a || !b) return;

    setSearchParams({ a, b });
  };

  const swap = () => {
    setLeftInput(defaultRight);
    setRightInput(defaultLeft);
    setSearchParams({ a: defaultRight, b: defaultLeft });
  };

  if (compare.error) {
    return (
      <section className="panel rounded-[1.9rem] p-6">
        <div className="label-caps text-gold">IoC comparison</div>
        <h2 className="mt-3 text-2xl font-black text-ivory">Unable to compare indicators</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{compare.error}</p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="panel-strong relative overflow-hidden rounded-[2rem] p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(221,183,106,0.17),transparent_26%)]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-gold/18 bg-gold/10 text-gold-soft">
              <GitCompare size={20} />
            </div>
            <div>
              <div className="label-caps text-gold">IoC visual comparison engine</div>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-ivory">
                Indicator <span className="text-gradient-gold">Correlation Compare</span>
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] xl:items-center">
            <input
              value={leftInput}
              onChange={(event) => setLeftInput(event.target.value)}
              className="rounded-[1.2rem] border border-white/8 bg-black/50 px-4 py-4 text-sm text-ivory outline-none placeholder:text-muted"
              placeholder="First IoC"
            />

            <button
              type="button"
              onClick={swap}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/8 bg-white/[0.03] text-gold-soft"
              title="Swap IoCs"
            >
              <ArrowRightLeft size={18} />
            </button>

            <input
              value={rightInput}
              onChange={(event) => setRightInput(event.target.value)}
              className="rounded-[1.2rem] border border-white/8 bg-black/50 px-4 py-4 text-sm text-ivory outline-none placeholder:text-muted"
              placeholder="Second IoC"
            />

            <button
              type="button"
              onClick={runCompare}
              className="rounded-[1.1rem] bg-[linear-gradient(180deg,rgba(246,216,151,.95),rgba(201,148,66,.95))] px-5 py-4 text-sm font-black text-[#2f1c06]"
            >
              Compare IoCs
            </button>
          </div>
        </div>
      </section>

      <VerdictPanel compare={compare} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <IocCard title="Indicator A" result={compare.left} />
        <IocCard title="Indicator B" result={compare.right} align="right" />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <ScoreRing label="Correlation overlap" value={compare.normalizedOverlap} tone="gold" />
        <ScoreRing label="Threat score delta" value={compare.scoreDelta} tone="danger" />
        <ScoreRing
          label="Shared evidence"
          value={
            compare.sharedTags.length +
            compare.sharedSources.length +
            compare.sharedCampaigns.length +
            compare.sharedActors.length
          }
          tone="info"
        />
      </section>

      <OverlapPanel compare={compare} />
      <CompareMitrePanel compare={compare} />
      {compare.sharedMitre.length === 0 && (
        <div className="mt-4 rounded-[1.2rem] border border-amber/20 bg-amber/10 p-4 text-sm text-amber">
          No shared ATT&CK techniques detected. Indicators may belong to different threat clusters or require additional enrichment.
        </div>
      )}
      <section className="panel rounded-[1.9rem] p-6">
        <div className="label-caps text-gold">Analyst interpretation</div>
        <h3 className="mt-2 text-2xl font-black text-ivory">Correlation readout</h3>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <article className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
            <div className="text-sm font-semibold text-ivory">Behavioral proximity</div>
            <p className="mt-2 text-sm leading-7 text-muted">
              ATT&CK overlap indicates whether both indicators share similar adversary behavior or only infrastructure-level proximity.
            </p>
          </article>

          <article className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
            <div className="text-sm font-semibold text-ivory">Infrastructure proximity</div>
            <p className="mt-2 text-sm leading-7 text-muted">
              Shared sources, campaigns and tags suggest common infrastructure, shared tooling or repeated threat operator tradecraft.
            </p>
          </article>

          <article className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
            <div className="text-sm font-semibold text-ivory">Recommended workflow</div>
            <p className="mt-2 text-sm leading-7 text-muted">
              Save both indicators, pivot into hunting mode, then generate a report if the overlap remains operationally relevant.
            </p>
          </article>
        </div>
      </section>

      <section className="panel rounded-[1.9rem] p-6">
        <div className="mb-4 flex items-center gap-3">
          <ShieldAlert className="text-gold-soft" size={18} />
          <div>
            <div className="label-caps text-gold">Analyst actions</div>
            <h3 className="mt-2 text-2xl font-black text-ivory">Comparison-driven triage</h3>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          {[
            'Validate shared sources and confirm whether both IoCs belong to the same investigation cluster.',
            'Pivot on shared tags, campaigns, infrastructure and passive DNS adjacency.',
            'Save both indicators in the workbench and generate an intelligence report if overlap remains significant.',
          ].map((action, index) => (
            <article key={action} className="rounded-[1.25rem] border border-white/6 bg-black/30 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-gold">
                Action {String(index + 1).padStart(2, '0')}
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{action}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleLookup(compare.left.query)}
            className="rounded-xl border border-gold/18 bg-gold/10 px-4 py-3 text-sm text-gold-soft"
          >
            Open Indicator A
          </button>
          <button
            type="button"
            onClick={() => handleLookup(compare.right.query)}
            className="rounded-xl border border-gold/18 bg-gold/10 px-4 py-3 text-sm text-gold-soft"
          >
            Open Indicator B
          </button>
        </div>
      </section>
    </div>
  );
}