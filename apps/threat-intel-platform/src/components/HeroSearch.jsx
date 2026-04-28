import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { detectIndicatorType } from '../lib/utils';
import TagChip from './ui/TagChip';

const supported = ['IPv4', 'Domain', 'URL', 'Hash', 'Email', 'Malware Family', 'Threat Actor'];

export default function HeroSearch({ query, setQuery, onExampleClick, currentType }) {
  return (
    <section className="panel-strong relative overflow-hidden rounded-[2.2rem] p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(221,183,106,0.16),transparent_22%),radial-gradient(circle_at_92%_8%,rgba(255,255,255,0.08),transparent_10%),linear-gradient(135deg,transparent,rgba(255,255,255,0.02),transparent_55%)]" />
      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_22rem] xl:items-end">
        <div>
          <div className="label-caps text-gold">Threat Intelligence Platform · V1</div>
          <h1 className="mt-3 max-w-[12ch] text-5xl font-black leading-none tracking-[-0.06em] sm:text-7xl">
            Obsidian <span className="text-gradient-gold">Correlation</span> Engine
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Aggregate, enrich and correlate threat indicators across a multi-source intelligence environment. Une web app
            CTI premium pensée pour impressionner visuellement tout en restant crédible pour un recruteur cyber.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {supported.map((item) => (
              <TagChip key={item}>{item}</TagChip>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="radar-sweep relative flex items-center gap-3 overflow-hidden rounded-[1.7rem] border border-gold/24 bg-black/65 px-4 py-4 shadow-[0_0_32px_rgba(221,183,106,0.08)]">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-gold/18 bg-gold/10 text-gold-soft">
                <Search className="h-5 w-5" />
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent font-mono text-sm text-ivory outline-none placeholder:text-muted sm:text-base"
                placeholder="Search IP, domain, URL, hash, malware family, actor..."
              />
              <div className="hidden gap-2 lg:flex">
                <span className="rounded-full border border-gold/14 bg-white/4 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-muted">
                  {detectIndicatorType(query)}
                </span>
                <span className="rounded-full border border-gold/14 bg-white/4 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-muted">
                  6 sources
                </span>
              </div>
            </div>
            <button className="rounded-[1.2rem] bg-gradient-to-b from-[#f5dfad] to-[#c59044] px-5 py-4 text-sm font-extrabold tracking-wide text-[#2c1b07] shadow-[0_12px_28px_rgba(221,183,106,0.26)] transition hover:-translate-y-0.5">
              Run Deep Scan
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {['185.217.143.91', 'api-helion-sync.com', 'northforge jackal', 'hollowdrift'].map((example) => (
              <button
                key={example}
                onClick={() => onExampleClick(example)}
                className="rounded-full border border-gold/14 bg-white/4 px-3 py-2 text-xs text-muted transition hover:border-gold/22 hover:text-gold-soft"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="panel relative overflow-hidden rounded-[1.8rem] p-5"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/12 blur-3xl" />
          <div className="label-caps text-gold">Current Threat Posture</div>
          <div className="relative mx-auto mt-4 grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(from_220deg,rgba(221,183,106,0.18),rgba(221,183,106,0.98)_74%,rgba(255,108,95,0.85)_92%,rgba(221,183,106,0.22))] p-4 shadow-[0_0_34px_rgba(221,183,106,0.12)]">
            <div className="grid h-full w-full place-items-center rounded-full border border-gold/18 bg-[radial-gradient(circle_at_50%_35%,rgba(38,38,42,0.95),rgba(8,8,9,0.98))] text-center">
              <div>
                <div className="text-5xl font-black tracking-[-0.06em]">87</div>
                <div className="label-caps mt-2 text-muted">Threat Score</div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-ivory">High Confidence Malicious</h2>
              <p className="mt-1 text-sm text-muted">Detected type · {currentType}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/18 bg-gold/10 text-gold-soft">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
