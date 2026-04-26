import ConsoleShell from "../ui/ConsoleShell";
import EmptyState from "../ui/EmptyState";

/* ========================================
   🔴 Live Event Stream
======================================== */

export default function LiveEventStream({ events = [], isRunning = false }) {
    return (
        <ConsoleShell
            title="live-event-stream.log"
            showLiveBadge
            isLive={isRunning}
            className="border-white/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.34),0_0_18px_rgba(239,68,68,0.04)]"
            bodyClassName="bg-[linear-gradient(180deg,#07090f_0%,#0a0c12_100%)]"
        >
            <div className="mb-3 text-xs text-cyan-400">
                purple-lab@ops:~$ stream --events
            </div>

            {events.length === 0 ? (
                <EmptyState
                    title="No live events yet"
                    description="Start a simulation to populate the offensive event stream."
                    compact
                />
            ) : (
                <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
                    {events.map((event, index) => (
                        <EventLine
                            key={`${event.time}-${index}-${event.title ?? "evt"}`}
                            event={event}
                        />
                    ))}
                </div>
            )}
        </ConsoleShell>
    );
}

function EventLine({ event }) {
    return (
        <div className={`relative overflow-hidden rounded-xl border px-3 py-2 ${getEventContainerTone(event.type)}`}>
            <div className={`absolute inset-y-0 left-0 w-[3px] ${getEventRailTone(event.type)}`} />

            <div className="pl-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="font-mono text-[11px] text-cyber-muted">
                            [{event.time}]
                        </span>

                        <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getEventBadgeTone(event.type)}`}>
                            {event.type}
                        </span>
                    </div>

                    <span className="text-[11px] text-cyber-muted">
                        {event.scenarioName ?? "war-room"}
                    </span>
                </div>

                <p className={`mt-2 text-sm font-semibold ${getEventTone(event.type)}`}>
                    {event.title}
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-300">
                    {event.message}
                </p>
            </div>
        </div>
    );
}

function getEventTone(type) {
    switch (type) {
        case "attack":
            return "text-cyber-red";
        case "alert":
            return "text-cyber-blue";
        case "purple":
            return "text-cyber-violet";
        case "log":
            return "text-cyber-text";
        case "campaign":
            return "text-cyber-amber";
        default:
            return "text-slate-300";
    }
}

function getEventBadgeTone(type) {
    switch (type) {
        case "attack":
            return "border-cyber-red/30 bg-cyber-red/10 text-cyber-red";
        case "alert":
            return "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue";
        case "purple":
            return "border-cyber-violet/30 bg-cyber-violet/10 text-cyber-violet";
        case "log":
            return "border-white/[0.08] bg-white/[0.03] text-cyber-muted";
        case "campaign":
            return "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber";
        default:
            return "border-white/[0.08] bg-white/[0.03] text-slate-300";
    }
}

function getEventContainerTone(type) {
    switch (type) {
        case "attack":
            return "border-cyber-red/20 bg-[linear-gradient(180deg,rgba(50,10,14,0.28),rgba(12,8,10,0.76))]";
        case "alert":
            return "border-cyber-blue/20 bg-[linear-gradient(180deg,rgba(10,26,48,0.28),rgba(8,10,18,0.76))]";
        case "purple":
            return "border-cyber-violet/20 bg-[linear-gradient(180deg,rgba(34,16,58,0.28),rgba(10,8,18,0.78))]";
        case "campaign":
            return "border-cyber-amber/20 bg-[linear-gradient(180deg,rgba(60,34,10,0.24),rgba(14,10,8,0.78))]";
        default:
            return "border-white/[0.06] bg-white/[0.02]";
    }
}

function getEventRailTone(type) {
    switch (type) {
        case "attack":
            return "bg-cyber-red shadow-[0_0_18px_rgba(239,68,68,0.45)]";
        case "alert":
            return "bg-cyber-blue shadow-[0_0_18px_rgba(59,130,246,0.42)]";
        case "purple":
            return "bg-cyber-violet shadow-[0_0_18px_rgba(139,92,246,0.42)]";
        case "campaign":
            return "bg-cyber-amber shadow-[0_0_18px_rgba(245,158,11,0.42)]";
        default:
            return "bg-white/10";
    }
}