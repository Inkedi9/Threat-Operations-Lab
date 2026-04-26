import { CheckCircle2, Circle } from "lucide-react";

export default function RemediationChecklist({ checklist, onToggle }) {
    const completed = checklist.filter((item) => item.completed).length;
    const progress = Math.round((completed / checklist.length) * 100);

    return (
        <section className="glass-panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                Remediation Checklist
            </p>

            <div className="mt-2 flex items-center justify-between">
                <h2 className="text-xl font-black text-command-text">
                    Recovery Tasks
                </h2>
                <span className="text-sm font-bold text-green-300">{progress}%</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-800">
                <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-6 space-y-3">
                {checklist.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onToggle(item.id)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-black/30 p-4 text-left transition hover:border-green-500/30"
                    >
                        {item.completed ? (
                            <CheckCircle2 className="text-green-400" size={20} />
                        ) : (
                            <Circle className="text-command-muted" size={20} />
                        )}

                        <span
                            className={
                                item.completed
                                    ? "text-green-200 line-through"
                                    : "text-command-text"
                            }
                        >
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}