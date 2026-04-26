import {
    FileText,
    Download,
    ShieldAlert,
    Activity,
    CheckCircle2,
    AlertTriangle,
    ListChecks,
} from "lucide-react";

export default function ReportPreview({
    incident,
    riskScore,
    actions,
    checklist,
    timeline,
    report,
    onExport,
}) {
    const completedActions = actions.filter(
        (action) => action.status === "completed"
    );

    const completedChecklist = checklist.filter((item) => item.completed);

    const remediationProgress = Math.round(
        (completedChecklist.length / checklist.length) * 100
    );

    const reduction = incident.initialRisk - riskScore;
    const reductionPercent = Math.round((reduction / incident.initialRisk) * 100);

    return (
        <section className="glass-panel rounded-[2rem] p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                        Report Preview
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-command-text">
                        Incident Response Report
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-command-muted">
                        Executive and technical preview generated from current containment,
                        remediation and recovery state.
                    </p>
                </div>

                <button
                    onClick={onExport}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-black shadow-amberGlow transition hover:bg-amber-400"
                >
                    <Download size={17} />
                    Export TXT
                </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    icon={ShieldAlert}
                    label="Severity"
                    value={incident.severity}
                    tone="text-red-300"
                />
                <SummaryCard
                    icon={Activity}
                    label="Risk Reduction"
                    value={`${reductionPercent}%`}
                    tone="text-green-300"
                />
                <SummaryCard
                    icon={CheckCircle2}
                    label="Containment"
                    value={`${completedActions.length}/${actions.length}`}
                    tone="text-green-300"
                />
                <SummaryCard
                    icon={ListChecks}
                    label="Remediation"
                    value={`${remediationProgress}%`}
                    tone="text-amber-300"
                />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                    <ReportBlock title="Executive Summary">
                        <p>{incident.businessImpact}</p>
                        <p className="mt-3">
                            The response team coordinated containment and remediation actions
                            to reduce exposure from{" "}
                            <span className="font-bold text-red-300">
                                {incident.initialRisk}/100
                            </span>{" "}
                            to{" "}
                            <span className="font-bold text-green-300">
                                {riskScore}/100
                            </span>
                            .
                        </p>
                    </ReportBlock>

                    <ReportBlock title="Attack Path">
                        <div className="flex flex-wrap gap-2">
                            {incident.attackPath.map((step) => (
                                <span
                                    key={step}
                                    className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-200"
                                >
                                    {step}
                                </span>
                            ))}
                        </div>
                    </ReportBlock>

                    <ReportBlock title="MITRE ATT&CK">
                        <div className="flex flex-wrap gap-2">
                            {incident.mitre.map((technique) => (
                                <span
                                    key={technique}
                                    className="rounded-xl border border-amber-500/20 bg-black/40 px-3 py-2 font-mono text-xs font-bold text-amber-300"
                                >
                                    {technique}
                                </span>
                            ))}
                        </div>
                    </ReportBlock>

                    <ReportBlock title="Recommendations">
                        <ul className="space-y-2 text-sm text-command-muted">
                            <li>• Enforce MFA on affected identities.</li>
                            <li>• Review privileged groups and service accounts.</li>
                            <li>• Confirm IoCs are blocked across security controls.</li>
                            <li>• Update detection rules and run lessons learned review.</li>
                        </ul>
                    </ReportBlock>
                </div>

                <div className="space-y-4">
                    <ReportBlock title="Actions Taken">
                        <div className="space-y-3">
                            {completedActions.length ? (
                                completedActions.map((action) => (
                                    <div
                                        key={action.id}
                                        className="rounded-2xl border border-green-500/10 bg-green-500/5 p-3"
                                    >
                                        <p className="font-bold text-green-300">{action.label}</p>
                                        <p className="mt-1 text-xs text-command-muted">
                                            Target:{" "}
                                            <span className="font-mono text-command-text">
                                                {action.target}
                                            </span>
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <EmptyState text="No containment action completed yet." />
                            )}
                        </div>
                    </ReportBlock>

                    <ReportBlock title="Remediation Status">
                        <div className="mb-4 h-2 overflow-hidden rounded-full bg-stone-900">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-green-700 to-green-400 transition-all"
                                style={{ width: `${remediationProgress}%` }}
                            />
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                            {checklist.map((item) => (
                                <div
                                    key={item.id}
                                    className={`rounded-2xl border p-3 text-xs ${item.completed
                                        ? "border-green-500/15 bg-green-500/5 text-green-300"
                                        : "border-white/5 bg-black/30 text-command-muted"
                                        }`}
                                >
                                    {item.completed ? "✓" : "○"} {item.label}
                                </div>
                            ))}
                        </div>
                    </ReportBlock>

                    <ReportBlock title="Latest Timeline Events">
                        <div className="space-y-3">
                            {timeline.slice(-4).map((event) => (
                                <div
                                    key={event.id}
                                    className="rounded-2xl border border-white/5 bg-black/30 p-3"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">
                                            {event.phase}
                                        </p>
                                        <p className="font-mono text-xs text-command-muted">
                                            {event.time}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-sm font-bold text-command-text">
                                        {event.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ReportBlock>
                </div>
            </div>

            <details className="mt-6 rounded-3xl border border-white/5 bg-black/40 p-5">
                <summary className="cursor-pointer select-none text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                    Raw TXT Report Preview
                </summary>

                <pre className="mt-5 max-h-[420px] overflow-auto rounded-2xl border border-white/5 bg-black/70 p-5 text-xs leading-relaxed text-stone-300">
                    {report}
                </pre>
            </details>
        </section>
    );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
    return (
        <div className="premium-hover rounded-3xl border border-white/5 bg-black/35 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-command-muted">
                        {label}
                    </p>
                    <p className={`mt-2 text-2xl font-black ${tone}`}>{value}</p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
                    <Icon size={19} />
                </div>
            </div>
        </div>
    );
}

function ReportBlock({ title, children }) {
    return (
        <div className="rounded-3xl border border-white/5 bg-black/35 p-5">
            <div className="mb-4 flex items-center gap-2">
                <FileText size={16} className="text-amber-300" />
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-command-text">
                    {title}
                </h3>
            </div>

            <div className="text-sm leading-6 text-command-muted">{children}</div>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-orange-500/10 bg-orange-500/5 p-3 text-sm text-orange-300">
            <AlertTriangle size={16} />
            {text}
        </div>
    );
}