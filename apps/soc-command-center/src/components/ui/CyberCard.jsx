import { cn } from "@/lib/utils";

export function CyberCard({
    className = "",
    variant = "default",
    children,
    ...props
}) {
    const base =
        "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 " +
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_35%)] before:opacity-60 " +
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl";

    const variants = {
        default:
            "bg-slate-950/70 border-slate-700/60 shadow-[0_18px_45px_rgba(0,0,0,0.45)] after:shadow-[inset_0_0_26px_rgba(148,163,184,0.06)]",

        glass:
            "bg-slate-950/45 border-slate-700/50 backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.35)]",

        metric:
            "bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.9))] border-blue-400/20 shadow-[0_0_24px_rgba(59,130,246,0.08),0_18px_40px_rgba(0,0,0,0.45)]",

        defense:
            "bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.22),transparent_40%),linear-gradient(135deg,#020617,#0f172a)] border-blue-500/50 shadow-[0_0_32px_rgba(59,130,246,0.18),0_18px_45px_rgba(0,0,0,0.55)] after:shadow-[inset_0_0_28px_rgba(59,130,246,0.12)]",

        threat:
            "bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.25),transparent_40%),linear-gradient(135deg,#0b0a10,#2a0f14)] border-red-500/60 shadow-[0_0_36px_rgba(239,68,68,0.22),0_20px_50px_rgba(0,0,0,0.6)] after:shadow-[inset_0_0_30px_rgba(239,68,68,0.14)]",

        success:
            "bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.16),transparent_42%),linear-gradient(135deg,#020617,#052e2b)] border-emerald-500/40 shadow-[0_0_26px_rgba(16,185,129,0.12),0_18px_45px_rgba(0,0,0,0.5)]",

        warning:
            "bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.18),transparent_42%),linear-gradient(135deg,#020617,#291604)] border-amber-500/40 shadow-[0_0_26px_rgba(245,158,11,0.12),0_18px_45px_rgba(0,0,0,0.5)]",
    };

    return (
        <div className={cn(base, variants[variant] || variants.default, className)} {...props}>
            <div className="relative z-10">{children}</div>
        </div>
    );
}