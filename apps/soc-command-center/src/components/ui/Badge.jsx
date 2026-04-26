import { cn } from "@/lib/utils";

export function Badge({ children, tone = "blue", className = "" }) {
    const tones = {
        blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        red: "bg-red-500/10 text-red-300 border-red-500/20",
        orange: "bg-orange-500/10 text-orange-300 border-orange-500/20",
        yellow: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
        green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
        slate: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    };

    return (
        <span className={cn("rounded-lg border px-2 py-1 text-xs", tones[tone], className)}>
            {children}
        </span>
    );
}