import { motion } from 'framer-motion';
import { scoreSummary } from '../data/mockData';
import TagChip from './ui/TagChip';
import SectionHeading from './ui/SectionHeading';

export default function ThreatScorePanel() {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Threat Score & Verdict Synthesis" subtitle="Overall analyst disposition" />
      <div className="grid gap-6 xl:grid-cols-[15rem_minmax(0,1fr)] xl:items-center">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto">
          <div className="relative grid h-52 w-52 place-items-center rounded-full bg-[conic-gradient(from_-120deg,rgba(255,108,95,0.95)_0_20%,rgba(255,180,76,0.92)_20%_58%,rgba(221,183,106,0.95)_58%_82%,rgba(83,216,168,0.85)_82%_100%)] p-5 shadow-[0_0_42px_rgba(221,183,106,0.12)]">
            <div className="grid h-full w-full place-items-center rounded-full border border-gold/18 bg-[radial-gradient(circle_at_50%_35%,rgba(35,35,38,0.95),rgba(8,8,9,0.98))] text-center">
              <div>
                <div className="text-5xl font-black tracking-[-0.07em] text-ivory">{scoreSummary.overall}</div>
                <div className="label-caps mt-2 text-muted">Overall Threat Score</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Critical', 'Elevated', 'Correlated', 'Observed'].map((item) => (
              <TagChip key={item}>{item}</TagChip>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['Disposition', scoreSummary.disposition, ['Tier 1', 'TLP: Amber']],
            ['Confidence Level', scoreSummary.confidence, ['5 corroborating sources']],
            ['Classification', scoreSummary.classification, ['Infrastructure-associated IP']],
            ['Analyst Action', scoreSummary.action, ['block + retro hunt + pivot']],
          ].map(([label, value, tags]) => (
            <div key={label} className="rounded-[1.2rem] border border-gold/12 bg-white/4 p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted">{label}</div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-ivory">{value}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
