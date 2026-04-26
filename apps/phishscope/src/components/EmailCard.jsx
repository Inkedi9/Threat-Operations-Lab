import RiskBadge from "./RiskBadge";

export default function EmailCard({ email, selected, onClick, completed }) {
    const badgeClass =
        email.badge === "External"
            ? "bg-danger/15 text-danger border-danger/30"
            : email.badge === "Internal"
                ? "bg-success/15 text-success border-success/30"
                : "bg-accent/15 text-accent border-accent/30";

    return (
        <button
            onClick={onClick}
            className={`w-full rounded-2xl border p-4 text-left transition duration-200 ${selected
                    ? "border-accent bg-slate-800/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/20"
                    : completed
                        ? "border-success/30 bg-success/5 shadow-md shadow-green-500/5 hover:border-success/50"
                        : "border-border bg-card/80 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-cyan-500/5"
                }`}
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">{email.senderName}</h3>
                    <p className="truncate text-xs text-slate-400">{email.senderEmail}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">{email.date}</span>
            </div>

            <p className="truncate text-sm font-semibold text-slate-100">{email.subject}</p>
            <p className="mt-1 text-sm text-muted">{email.preview}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200">
                    {email.category}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200">
                    {email.difficulty}
                </span>

                <span className={`rounded-full border px-3 py-1 text-xs ${badgeClass}`}>
                    {email.badge}
                </span>

                <RiskBadge level={email.riskLevel} />

                {completed && (
                    <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
                        ✔ Analyzed
                    </span>
                )}
            </div>
        </button>
    );
}