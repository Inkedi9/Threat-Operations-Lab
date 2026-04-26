import RiskBadge from "./RiskBadge";

export default function EmailViewer({ email }) {
    if (!email) {
        return (
            <div className="rounded-2xl border border-border bg-card p-6 text-muted">
                Select an email to begin analysis.
            </div>
        );
    }

    const badgeClass =
        email.badge === "External"
            ? "bg-danger/15 text-danger border-danger/30"
            : email.badge === "Internal"
                ? "bg-success/15 text-success border-success/30"
                : "bg-accent/15 text-accent border-accent/30";

    return (
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="border-b border-border bg-panel px-6 py-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-2xl font-black text-white">{email.subject}</h2>

                        <div className="mt-4 space-y-1 text-sm text-slate-300">
                            <p>
                                <span className="font-semibold text-white">From:</span> {email.senderName}
                            </p>
                            <p className="break-all text-slate-400">{email.senderEmail}</p>
                            <p>
                                <span className="font-semibold text-white">Date:</span> {email.date}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
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
                    </div>
                </div>
            </div>

            <div className="px-6 py-6">
                <div className="rounded-2xl border border-border bg-slate-950/40 p-5">
                    <div className="whitespace-pre-line leading-8 text-slate-200">
                        {email.body}
                    </div>

                    {email.linkText && (
                        <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                            <p className="text-sm font-semibold text-accent">Embedded Link</p>
                            <p className="mt-2 text-sm text-slate-100">{email.linkText}</p>
                            <p className="mt-2 break-all text-xs text-danger">{email.linkUrl}</p>
                        </div>
                    )}

                    {email.attachment && (
                        <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 p-4">
                            <p className="text-sm font-semibold text-warning">Attachment Detected</p>
                            <p className="mt-2 text-sm text-slate-200">{email.attachment}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}