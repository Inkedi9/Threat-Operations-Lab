import { cn } from "@/lib/utils";

export function CyberPanel({ children, className = "", variant = "default" }) {
    const base =
        "relative overflow-hidden rounded-2xl border p-4 transition-all duration-300";

    const variants = {
        default:
            "bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] border-blue-400/15 shadow-[0_18px_45px_rgba(0,0,0,0.35)]",
        metric:
            "bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.16),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] border-blue-400/20 shadow-[0_0_24px_rgba(59,130,246,0.08),0_18px_40px_rgba(0,0,0,0.45)] hover:-translate-y-1",
        defense:
            "bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.22),transparent_40%),linear-gradient(135deg,#020617,#0f172a)] border-blue-500/50 shadow-[0_0_32px_rgba(59,130,246,0.18),0_18px_45px_rgba(0,0,0,0.55)]",
        threat:
            "bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.25),transparent_40%),linear-gradient(135deg,#0b0a10,#2a0f14)] border-red-500/60 shadow-[0_0_36px_rgba(239,68,68,0.22),0_20px_50px_rgba(0,0,0,0.6)]",
        success:
            "bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.16),transparent_42%),linear-gradient(135deg,#020617,#052e2b)] border-emerald-500/40 shadow-[0_0_26px_rgba(16,185,129,0.12),0_18px_45px_rgba(0,0,0,0.5)]",
        warning:
            "bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.16),transparent_42%),linear-gradient(135deg,#020617,#291604)] border-amber-500/40 shadow-[0_0_26px_rgba(245,158,11,0.12),0_18px_45px_rgba(0,0,0,0.5)]",
    };

    return (
        <div className={cn(base, variants[variant] || variants.default, className)}>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.07),transparent_35%)] opacity-50" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}