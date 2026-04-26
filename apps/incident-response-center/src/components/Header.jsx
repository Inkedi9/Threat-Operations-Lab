import {
    RotateCcw,
    FileText,
    ShieldAlert,
    RadioTower,
    Activity,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function Header({ incident, onReset, onGenerateReport }) {
    return (
        <header className="glass-panel rounded-[2rem] p-6 lg:p-7">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl bg-amber-500/20 blur-2xl" />
                            <div className="relative rounded-3xl border border-amber-400/30 bg-amber-500/10 p-4 text-amber-300 shadow-amberGlow">
                                <ShieldAlert size={32} />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
                                    Incident Command Center
                                </span>

                                <span className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                                    <RadioTower size={13} />
                                    Live Simulation
                                </span>
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-command-text text-glow-amber md:text-4xl 2xl:text-5xl">
                                Incident Response & Remediation Center
                            </h1>

                            <p className="mt-3 max-w-4xl text-sm leading-6 text-command-muted md:text-base">
                                Coordinate containment, remediation and recovery actions across
                                a simulated cyber incident.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-3xl border border-white/5 bg-black/30 p-4 xl:min-w-[360px]">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-[0.24em] text-command-muted">
                            Active Incident
                        </span>
                        <div className="flex gap-2">
                            <StatusBadge status={incident.severity} />
                            <StatusBadge status={incident.status} />
                        </div>
                    </div>

                    <div>
                        <p className="font-mono text-sm text-amber-300">{incident.id}</p>
                        <p className="mt-1 font-bold text-command-text">{incident.name}</p>
                    </div>

                    <div className="command-divider" />

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onReset}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-stone-700 bg-stone-900/70 px-4 py-3 text-sm font-bold text-stone-200 transition hover:border-stone-500 hover:bg-stone-800"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>

                        <button
                            onClick={onGenerateReport}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-black text-black shadow-amberGlow transition hover:bg-amber-400"
                        >
                            <FileText size={16} />
                            Report
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-command-muted">
                        <Activity size={14} className="text-amber-300" />
                        Response state updates in real time.
                    </div>
                </div>
            </div>
        </header>
    );
}