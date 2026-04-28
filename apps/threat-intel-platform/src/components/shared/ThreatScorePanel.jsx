import SectionHeading from '../ui/SectionHeading';

export default function ThreatScorePanel({ result }) {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Threat Score & Verdict Synthesis" subtitle="overall analyst disposition" />
      <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-center">
        <div className="mx-auto grid h-56 w-56 place-items-center rounded-full border border-gold/20 bg-[conic-gradient(from_-110deg,rgba(255,108,95,.95)_0_20%,rgba(255,180,76,.9)_20%_56%,rgba(221,183,106,.92)_56%_82%,rgba(83,216,168,.82)_82%_100%)] p-5 shadow-[0_0_40px_rgba(221,183,106,0.1)]">
          <div className="grid h-full w-full place-items-center rounded-full border border-gold/18 bg-black/90 text-center">
            <div>
              <div className="text-5xl font-black tracking-tight text-ivory">{result.threatScore}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-muted">Overall Threat Score</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['Disposition', result.disposition],
            ['Confidence', `${result.confidence}%`],
            ['Classification', result.classification],
            ['TLP / Severity', `${result.tlp} · ${result.severity}`],
            ['Analyst Priority', result.analystPriority],
            ['Recommended Action', result.recommendedAction],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
              <div className="mt-2 text-lg font-semibold leading-6 text-ivory">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
