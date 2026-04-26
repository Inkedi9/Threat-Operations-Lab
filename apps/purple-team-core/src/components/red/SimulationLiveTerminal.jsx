import { useEffect, useMemo, useRef, useState } from "react";
import ConsoleShell from "../ui/ConsoleShell";
import MetricBar from "../ui/MetricBar";
import EmptyState from "../ui/EmptyState";

/* ========================================
   🖥️ Simulation Live Terminal
======================================== */

export default function SimulationLiveTerminal({
    events = [],
    isRunning = false,
}) {
    const containerRef = useRef(null);
    const [visibleLines, setVisibleLines] = useState([]);

    /* ========================================
       🧠 Build formatted lines
    ======================================== */
    const formattedEvents = useMemo(() => {
        return events.map((event, index) => ({
            id: `${event.time}-${index}-${event.scenarioName || "main"}`,
            prefix: event.type?.toUpperCase() ?? "LOG",
            message: event.message,
            time: event.time,
            type: event.type,
            title: event.title,
        }));
    }, [events]);

    /* ========================================
       ✍️ Typing / streaming effect
    ======================================== */
    useEffect(() => {
        setVisibleLines(formattedEvents);
    }, [formattedEvents]);

    /* ========================================
       🔄 Auto-scroll
    ======================================== */
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [visibleLines]);

    const progress = events.length === 0 ? 0 : Math.min(100, Math.round((events.length / 12) * 100));

    return (
        <ConsoleShell
            title="simulation-live.log"
            showLiveBadge
            isLive={isRunning}
        >
            {/* 📈 Progress */}
            <div className="mb-5">
                <div className="mb-2 flex items-center justify-between text-xs font-mono text-cyber-muted">
                    <span>attack-stream.progress</span>
                </div>

                <MetricBar
                    value={progress}
                    showValue
                    size="md"
                    tone="red"
                />
            </div>

            {/* 🧠 Command line */}
            <div className="mb-3 font-mono text-xs text-cyan-400">
                red-ops@purple-lab:~$ execute --live-stream
            </div>

            {/* 📡 Stream */}
            <div
                ref={containerRef}
                className="min-h-[220px] max-h-[420px] overflow-auto pr-1 font-mono"
            >
                {!visibleLines.length ? (
                    <EmptyState
                        title="No attack output yet"
                        description="Launch the simulation to start the offensive live stream."
                        compact
                    />
                ) : (
                    <div className="space-y-2">
                        {visibleLines.map((line, index) => (
                            <div
                                key={line.id}
                                className={`rounded px-1 text-sm leading-6 ${index === visibleLines.length - 1 ? "bg-white/5" : ""
                                    }`}
                            >
                                <span className="text-cyber-violet">$</span>{" "}
                                <span className="text-slate-500">[{line.time}]</span>{" "}
                                <span className={getTypeColor(line.type)}>
                                    [{line.prefix}]
                                </span>{" "}
                                <span className="text-slate-200">{line.title} — </span>
                                <span className="text-slate-300">{line.message}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ConsoleShell>
    );
}

/* ========================================
   🎨 Type Colors
======================================== */

function getTypeColor(type) {
    if (type === "attack") return "text-red-400";
    if (type === "alert") return "text-cyber-blue";
    if (type === "purple") return "text-green-400";
    if (type === "log") return "text-cyan-400";
    if (type === "campaign") return "text-cyber-violet";
    return "text-slate-400";
}