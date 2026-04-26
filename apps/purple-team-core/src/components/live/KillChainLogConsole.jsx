import { useMemo } from "react";
import ConsoleShell from "../ui/ConsoleShell";

/* ========================================
   🖥️ Kill Chain Log Console
======================================== */

export default function KillChainLogConsole({
    displayedEvents = [],
    visibleStatus = "In Progress",
    isRunning = false,
}) {
    /* ----------------------------------------
       🧠 Build console lines
    ---------------------------------------- */
    const lines = useMemo(() => {
        if (!displayedEvents.length) {
            return [
                "[idle] Waiting for simulation start...",
                "[kill-chain] No stage executed yet",
                `[status] ${visibleStatus}`,
            ];
        }

        return displayedEvents.map((event, index) => {
            const time =
                event.time ||
                (event.timestamp
                    ? new Date(event.timestamp).toLocaleTimeString()
                    : `evt-${index + 1}`);

            return `[${time}] ${event.type.toUpperCase()} :: ${event.title || "event"} :: ${event.message}`;
        });
    }, [displayedEvents, visibleStatus]);

    const isLive = isRunning;

    return (
        <ConsoleShell
            title="kill-chain.log"
            showLiveBadge
            isLive={isLive}
        >
            <div className="mb-3 text-xs text-cyan-400">
                purple-lab@ops:~$ tail -f kill-chain.log
            </div>

            <div className="max-h-[320px] space-y-2 overflow-auto pr-1">
                {lines.map((line, index) => (
                    <div
                        key={`${line}-${index}`}
                        className="break-words text-sm leading-6 text-slate-300"
                    >
                        <span className="text-cyber-violet">$</span>{" "}
                        <span>{line}</span>
                    </div>
                ))}
            </div>
        </ConsoleShell>
    );
}