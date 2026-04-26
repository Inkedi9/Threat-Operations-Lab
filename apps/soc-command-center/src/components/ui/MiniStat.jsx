import { cn } from "@/lib/utils";

export function MiniStat({ label, value, tone = "blue" }) {
    const colors = {
        blue: "text-blue-300",
        red: "text-red-300",
        orange: "text-orange-300",
        yellow: "text-yellow-300",
        green: "text-emerald-300",
        cyan: "text-cyan-300",
    };

    return (
        <div className="rounded-xl border border-blue-400/10 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className={cn("mt-2 text-2xl font-black", colors[tone])}>{value}</p>
        </div>
    );
}