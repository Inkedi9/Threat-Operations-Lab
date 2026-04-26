import { cn } from "@/lib/utils";

export function PhishPanel({ children, className = "", variant = "default" }) {
    const variants = {
        default:
            "border-[#2a3038] bg-[#101418] shadow-[0_18px_45px_rgba(0,0,0,0.45)]",
        card:
            "border-[#303741] bg-[#151a20] shadow-[0_12px_32px_rgba(0,0,0,0.38)]",
        glow:
            "border-teal-400/25 bg-[#101418] shadow-[0_0_28px_rgba(45,212,191,0.08),0_18px_45px_rgba(0,0,0,0.45)]",
        threat:
            "border-red-500/30 bg-[#1a1114] shadow-[0_0_24px_rgba(239,68,68,0.10)]",
        success:
            "border-emerald-500/25 bg-[#0f1a16] shadow-[0_0_22px_rgba(16,185,129,0.08)]",
        warning:
            "border-amber-500/25 bg-[#1a1710] shadow-[0_0_22px_rgba(245,158,11,0.08)]",
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
                variants[variant] || variants.default,
                className
            )}
        >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.045),transparent_35%)] opacity-70" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}