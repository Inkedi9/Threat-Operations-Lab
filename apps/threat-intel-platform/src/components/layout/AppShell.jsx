import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Star, StarOff } from 'lucide-react';
import Sidebar from './Sidebar';
import RightRail from './RightRail';
import TopBar from './TopBar';
import { navItems } from '../../data/intelData';
import { buildSearchSuggestions, lookupAsync } from '../../lib/engine';
import { detectIndicatorType } from '../../lib/utils';
import { usePersistentState } from '../../hooks/usePersistentState';
import Toast from '../ui/Toast';
import LoadingIntel from '../ui/LoadingIntel';

import { readIncidentParams, hasIncidentContext, getPrimaryIoc } from '../../lib/incidentParams';
import LinkedIncidentBanner from '../ecosystem/LinkedIncidentBanner';
import IncidentCorrelationPanel from '../ecosystem/IncidentCorrelationPanel';

const viewMeta = {
  '/': {
    eyebrow: 'Threat Intelligence Platform · Phase 3',
    title: 'Obsidian Correlation',
    accent: 'Suite',
    subtitle:
      'A standalone cyber threat intelligence module designed to enrich, correlate and visualize indicators of compromise across a premium analyst workflow.',
  },
  '/investigate': {
    eyebrow: 'Investigation Surface',
    title: 'Deep Lookup',
    accent: 'Workbench',
    subtitle: 'Pivot across enrichment sources, relationship maps, entity links and analyst actions from a URL-shareable lookup route.',
  },
  '/campaigns': {
    eyebrow: 'Campaign Command',
    title: 'Operation',
    accent: 'Clusters',
    subtitle: 'Strategic intelligence pages centered on campaign narratives, targeted sectors, timeline windows and infrastructure overlap.',
  },
  '/actors': {
    eyebrow: 'Attribution Layer',
    title: 'Threat Actor',
    accent: 'Profiles',
    subtitle: 'Detailed actor views designed to keep the product separate from a SOC dashboard and closer to strategic CTI tooling.',
  },
  '/workbench': {
    eyebrow: 'Analyst Workbench',
    title: 'Saved',
    accent: 'State',
    subtitle: 'Persisted lookups, watchlists, notes and recruiter-friendly workflow hooks stored locally in the browser.',
  },
  '/compare': {
    eyebrow: 'Comparison Engine',
    title: 'Indicator',
    accent: 'Parity',
    subtitle: 'Compare two indicators side by side to assess shared sources, tags, campaigns, ATT&CK mappings and correlation strength.',
  },
  '/reports': {
    eyebrow: 'Report Generator',
    title: 'Intel',
    accent: 'Reporting',
    subtitle: 'Generate an exportable analyst report from the current lookup, including verdict, MITRE mapping and recommended actions.',
  },
  '/hunting': {
    eyebrow: 'Threat Hunting Surface',
    title: 'Hunting',
    accent: 'Mode',
    subtitle:
      'Pivot the current lookup into analyst hypotheses, observables, ATT&CK-aligned clues and investigation prompts.',
  },
};

function resolveMeta(pathname) {
  if (pathname.startsWith('/campaigns')) return viewMeta['/campaigns'];
  if (pathname.startsWith('/actors')) return viewMeta['/actors'];
  if (pathname.startsWith('/hunting')) return viewMeta['/hunting'];
  if (pathname.startsWith('/workbench')) return viewMeta['/workbench'];
  if (pathname.startsWith('/compare')) return viewMeta['/compare'];
  if (pathname.startsWith('/reports')) return viewMeta['/reports'];
  if (pathname.startsWith('/investigate')) return viewMeta['/investigate'];
  return viewMeta['/'];
}

function MobileNav() {
  const location = useLocation();
  const routeMap = {
    overview: '/',
    investigate: '/investigate',
    campaigns: '/campaigns',
    actors: '/actors',
    workbench: '/workbench',
    hunting: '/hunting',
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 xl:hidden">
      {navItems.map((item) => {
        const href = routeMap[item.id];
        const active = item.id === 'overview' ? location.pathname === '/' : location.pathname.startsWith(href);
        return (
          <Link
            key={item.id}
            to={href}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${active ? 'border-gold/24 bg-gold/10 text-gold-soft' : 'border-white/8 bg-white/[0.03] text-muted'
              }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawQuery = searchParams.get('q');
  const incidentContext = readIncidentParams(location.search);
  const linkedPrimaryIoc = getPrimaryIoc(incidentContext);
  const initialQuery = rawQuery || linkedPrimaryIoc || '185.217.143.91';

  const [query, setQuery] = useState(initialQuery);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [savedLookups, setSavedLookups] = usePersistentState('tip.saved-lookups', []);
  const [watchlist, setWatchlist] = usePersistentState('tip.watchlist', []);
  const [analystNotes, setAnalystNotes] = usePersistentState('tip.analyst-notes', {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const suggestions = buildSearchSuggestions(query);
  const meta = resolveMeta(location.pathname);
  const isTracked = result ? watchlist.some((item) => item.id === result.id) : false;

  const shouldUseLinkedIoc = hasIncidentContext(incidentContext) && linkedPrimaryIoc;

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timeout = isScanning ? window.setTimeout(() => setIsScanning(false), 900) : null;
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [isScanning]);

  const persistLookup = (resolved) => {
    if (!resolved) return;

    setSavedLookups((current) => {
      const next = [
        {
          id: `${resolved.id}-${Date.now()}`,
          query: resolved.query,
          title: resolved.title,
          type: resolved.type,
          threatScore: resolved.threatScore,
          savedAt: new Date().toISOString(),
          pinned: false,
        },
        ...current.filter((item) => item.query !== resolved.query),
      ];
      return next.slice(0, 12);
    });
  };

  const handleLookup = async (lookupValue, path = '/investigate') => {
    const trimmed = lookupValue?.trim();
    if (!trimmed) return;

    setQuery(trimmed);
    setIsScanning(true);
    setLoading(true);
    setError(null);

    try {
      const data = await lookupAsync(trimmed);
      setResult(data);
      persistLookup(data);

      setToast({
        type: 'success',
        message: `Lookup completed for ${trimmed}`,
      });

      const targetUrl = `${path}?q=${encodeURIComponent(trimmed)}`;
      const currentUrl = `${location.pathname}${location.search}`;

      if (currentUrl !== targetUrl) {
        navigate(targetUrl);
      }
    } catch (err) {
      console.error(err);
      const message = err?.message || 'Lookup failed. Mock enrichment pipeline returned an error.';
      setError(message);
      setToast({
        type: 'error',
        message,
      });
      setLoading(false);
    }

  };

  useEffect(() => {
    const targetPath = location.pathname === '/' ? '/investigate' : location.pathname;
    handleLookup(initialQuery, targetPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function toggleWatchlist() {
    if (!result) return;

    setWatchlist((current) => {
      if (current.some((item) => item.id === result.id)) {
        return current.filter((item) => item.id !== result.id);
      }

      return [
        {
          id: result.id,
          query: result.query,
          title: result.title,
          type: result.type,
          severity: result.severity,
          threatScore: result.threatScore,
        },
        ...current,
      ].slice(0, 20);
    });
  }

  const outletContext = {
    query: initialQuery,
    result,
    loading,
    error,
    savedLookups,
    watchlist,
    analystNotes,
    setAnalystNotes,
    handleLookup,
    toggleWatchlist,
    isTracked,
    incidentContext,
  };

  return (
    <div className="min-h-screen xl:grid xl:grid-cols-[6rem_minmax(0,1fr)]">
      <Sidebar />

      <div className="min-w-0">
        <TopBar currentQuery={query} onQuickInvestigate={handleLookup} />

        <div className="px-4 pb-4 pt-[5.6rem] sm:px-6 sm:pb-6 sm:pt-[5.8rem] xl:px-7 xl:pb-7 xl:pt-[6.2rem]">
          <div className="space-y-5">
            <MobileNav />
            {hasIncidentContext(incidentContext) && (
              <LinkedIncidentBanner context={incidentContext} />
            )}

            <section className="panel-strong relative overflow-hidden rounded-[2rem] p-6 sm:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(221,183,106,0.18),transparent_25%),linear-gradient(135deg,transparent,rgba(255,255,255,0.03),transparent_60%)]" />
              <div className="relative">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-4xl">
                    <div className="label-caps text-gold">{meta.eyebrow}</div>
                    <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-ivory sm:text-6xl">
                      {meta.title} <span className="text-gradient-gold">{meta.accent}</span>
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-8 text-muted sm:text-[15px]">{meta.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      <div className="rounded-full border border-gold/18 bg-gold/10 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-gold-soft">
                        Current lookup · {detectIndicatorType(query)}
                      </div>

                      <div className="rounded-full border border-white/8 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted">
                        SaaS CTI demo
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleWatchlist}
                      className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted hover:border-gold/18 hover:text-gold-soft"
                    >
                      {isTracked ? <StarOff size={14} /> : <Star size={14} />}
                      {isTracked ? 'Remove watchlist' : 'Add watchlist'}
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
                  <div className="radar-sweep relative overflow-hidden rounded-[1.6rem] border border-gold/18 bg-black/70 px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-gold/18 bg-gold/10 text-gold-soft">⌕</div>

                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') handleLookup(query);
                        }}
                        className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-muted sm:text-base"
                        placeholder="Search IP, domain, URL, hash, email, malware family or threat actor"
                      />

                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        {['lookup', 'multi-source', 'pivot-ready'].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLookup(query)}
                    className="rounded-[1.1rem] bg-[linear-gradient(180deg,rgba(246,216,151,.95),rgba(201,148,66,.95))] px-5 py-4 text-sm font-black text-[#2f1c06] shadow-[0_10px_30px_rgba(221,183,106,0.24)]"
                  >
                    Run Deep Scan
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleLookup(item.query)}
                      className="premium-hover rounded-full border border-white/8 bg-black/40 px-3 py-2 text-[11px] text-muted transition hover:border-gold/24 hover:text-gold-soft"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {isScanning && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-5 rounded-[1.3rem] border border-gold/14 bg-black/50 px-5 py-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="label-caps text-gold">Lookup in progress</div>
                          <div className="mt-1 text-sm text-muted">
                            Parsing <span className="font-mono text-ivory">{query}</span> as{' '}
                            <span className="text-gold-soft">{detectIndicatorType(query)}</span>
                          </div>
                        </div>

                        <div className="h-2.5 w-full max-w-sm overflow-hidden rounded-full border border-white/6 bg-white/5">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.9, ease: 'easeInOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-gold/35 via-gold-soft to-amber"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {hasIncidentContext(incidentContext) && (
              <IncidentCorrelationPanel context={incidentContext} />
            )}

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_23rem]">
              <main className="min-w-0 space-y-5">
                {loading && <LoadingIntel />}

                {error && (
                  <div className="panel rounded-[1.4rem] border border-danger/20 p-4 text-sm text-danger">
                    {error}
                  </div>
                )}

                <Outlet context={outletContext} />
              </main>

              <div className="2xl:sticky 2xl:top-[6.5rem] 2xl:self-start">
                <RightRail
                  result={result}
                  onQuickSelect={handleLookup}
                  watchlist={watchlist}
                  savedLookups={savedLookups}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}