import { cn } from "@/lib/utils";

export function PhishCard({
    children,
    active = false,
    tone = "default",
    className = "",
    ...props
}) {
    const tones = {
        default:
            "border-[#303741] bg-[#151a20] hover:border-teal-400/25 hover:bg-[#181f26]",
        teal:
            "border-teal-400/35 bg-[#10201f] shadow-[0_0_18px_rgba(45,212,191,0.08)]",
        threat:
            "border-red-500/35 bg-[#211216] shadow-[0_0_18px_rgba(239,68,68,0.08)]",
        success:
            "border-emerald-500/30 bg-[#102019] shadow-[0_0_18px_rgba(16,185,129,0.07)]",
        warning:
            "border-amber-500/30 bg-[#211b11] shadow-[0_0_18px_rgba(245,158,11,0.07)]",
    };

    return (
        <div
            className={cn(
                "rounded-2xl border p-4 transition-all duration-200",
                "hover:-translate-y-0.5",
                tones[tone] || tones.default,
                active && "border-teal-400/60 shadow-[0_0_24px_rgba(45,212,191,0.16)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}