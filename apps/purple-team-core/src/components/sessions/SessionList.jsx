import { Clock, PlayCircle, FolderClock } from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";

/* ========================================
   📁 Session List
======================================== */

export default function SessionList({
    sessions = [],
    activeSessionId,
    onSelectSession,
}) {
    return (
        <PanelCard variant="signal">
            <PanelHeader
                icon={<FolderClock className="h-5 w-5 text-cyber-violet" />}
                title="Sessions"
                subtitle="Simulation history & replay"
            />

            <div className="mt-4 space-y-3">
                {sessions.map((session) => {
                    const active = session.id === activeSessionId;

                    return (
                        <button
                            key={session.id}
                            onClick={() => onSelectSession(session.id)}
                            className={[
                                "w-full rounded-2xl border p-4 text-left transition-all duration-200",
                                active
                                    ? "border-cyber-violet bg-cyber-violet/10 shadow-[0_0_20px_rgba(139,92,246,0.12)]"
                                    : "border-cyber-border bg-cyber-panel2 hover:border-cyber-violet/30 hover:bg-cyber-panel",
                            ].join(" ")}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-cyber-text">
                                        {session.name}
                                    </p>
                                </div>

                                <div
                                    className={[
                                        "rounded-full border p-1.5",
                                        active
                                            ? "border-cyber-violet/30 bg-cyber-violet/10 text-cyber-violet"
                                            : "border-cyber-border bg-cyber-bgSoft text-cyber-muted",
                                    ].join(" ")}
                                >
                                    <PlayCircle className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-cyber-muted">
                                <span className="rounded-lg border border-white/[0.06] bg-black/10 px-2 py-1 uppercase tracking-wide">
                                    {session.mode}
                                </span>
                                <span>{session.status}</span>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-xs text-cyber-muted">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{formatDate(session.createdAt)}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧠 Format date
======================================== */

function formatDate(date) {
    if (!date) return "n/a";
    return new Date(date).toLocaleString();
}