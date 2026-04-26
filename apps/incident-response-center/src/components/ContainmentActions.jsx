import { ShieldBan } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ActionButton from "./ActionButton";

export default function ContainmentActions({ actions, onRunAction }) {
    return (
        <section className="glass-panel rounded-[2rem] p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                        Containment Actions
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-command-text">
                        Response Playbook
                    </h2>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-300">
                    <ShieldBan size={22} />
                </div>
            </div>

            <div className="mt-6 space-y-3">
                {actions.map((action, index) => (
                    <div
                        key={action.id}
                        className="premium-hover rounded-3xl border border-white/5 bg-black/35 p-4"
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 font-mono text-sm font-black text-amber-300">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="font-black text-command-text">
                                            {action.label}
                                        </h3>
                                        <StatusBadge status={action.status} />
                                    </div>

                                    <p className="mt-2 text-sm text-command-muted">
                                        Target{" "}
                                        <span className="font-mono text-amber-300">
                                            {action.target}
                                        </span>{" "}
                                        · Expected reduction{" "}
                                        <span className="font-bold text-green-300">
                                            -{action.riskReduction}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <ActionButton
                                onClick={() => onRunAction(action.id)}
                                disabled={action.status === "completed"}
                            >
                                {action.status === "completed" ? "Completed" : "Execute"}
                            </ActionButton>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}