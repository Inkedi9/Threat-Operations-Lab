/* ========================================
   🖥️ UI Primitive — ConsoleShell
======================================== */

export default function ConsoleShell({
    title = "console.log",
    children,
    className = "",
    bodyClassName = "",
    rightSlot = null,
    compact = false,
    isLive = false,
    showLiveBadge = false,
}) {
    const shouldShowLiveBadge = showLiveBadge || isLive;

    return (
        <div
            className={[
                "overflow-hidden border border-white/[0.04] bg-cyber-panel/85",
                "shadow-[0_0_30px_rgba(15,23,42,0.32),0_0_16px_rgba(59,130,246,0.05)]",
                "transition-all duration-300",
                compact ? "rounded-2xl" : "rounded-3xl",
                className,
            ].join(" ")}
        >
            {/* Topbar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] bg-[linear-gradient(180deg,rgba(18,24,38,0.92),rgba(14,18,30,0.9))] px-4 py-2">
                <div className="flex shrink-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <div className="min-w-0 flex-1 px-2 text-center">
                    <p className="truncate font-mono text-[11px] uppercase tracking-[0.28em] text-cyber-text/90">
                        {title}
                    </p>
                </div>

                <div className="flex min-w-0 shrink-0 items-center justify-end gap-2">
                    {shouldShowLiveBadge && (
                        <span
                            className={[
                                "inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-medium transition",
                                isLive
                                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                                    : "border-white/[0.06] bg-white/[0.03] text-cyber-muted",
                            ].join(" ")}
                        >
                            <span className="relative flex h-2 w-2">
                                {isLive && (
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                                )}
                                <span
                                    className={[
                                        "relative inline-flex h-2 w-2 rounded-full",
                                        isLive ? "bg-red-500" : "bg-slate-500",
                                    ].join(" ")}
                                />
                            </span>

                            <span>Live</span>
                        </span>
                    )}

                    {rightSlot ? (
                        <div className="min-w-0 shrink-0">
                            {rightSlot}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Body */}
            <div
                className={[
                    "bg-[linear-gradient(180deg,#090a0d_0%,#0b0d12_100%)] p-4 font-mono",
                    bodyClassName,
                ].join(" ")}
            >
                {children}
            </div>
        </div>
    );
}