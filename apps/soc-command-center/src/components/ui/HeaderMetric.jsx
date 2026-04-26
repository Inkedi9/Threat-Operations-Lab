import { cn } from "@/lib/utils";

export function HeaderMetric({
    icon: Icon,
    label,
    value,
    description,
    tone = "blue",
    pulse = false,
    glow = false,
}) {
    const tones = {
        blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
        green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
        orange: "border-orange-500/20 bg-orange-500/10 text-orange-300",
        red: "border-red-500/20 bg-red-500/10 text-red-300",
        slate: "border-slate-500/20 bg-slate-500/10 text-slate-300",
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border px-4 py-3 min-w-[180px]",
                "bg-slate-950/35 backdrop-blur-sm",
                "transition-all duration-300",
                tones[tone],
                glow && "shadow-[0_0_28px_rgba(59,130,246,0.22)]"
            )}
        >
            {glow && (
                <>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.24),transparent_48%)]" />
                    <div className="pointer-events-none absolute -inset-px rounded-2xl border border-blue-400/30 animate-pulse" />
                </>
            )}

            <div className="relative z-10">
                <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.16em] opacity-90">
                    {Icon && <Icon className={cn("h-4 w-4", glow && "animate-pulse")} />}
                    {label}
                </div>

                <div className="flex items-center gap-2">
                    {pulse && (
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </span>
                    )}

                    <p className="text-sm font-bold text-white">{value}</p>
                </div>

                {description && (
                    <p className="mt-1 text-xs text-slate-400">{description}</p>
                )}
            </div>
        </div>
    );
}