import { cn } from "@/lib/utils";

export function PhishButton({
    children,
    tone = "teal",
    size = "md",
    className = "",
    ...props
}) {
    const tones = {
        teal:
            "border-teal-400/30 bg-teal-400/12 text-teal-200 hover:bg-teal-400/20 hover:border-teal-300/45",
        solid:
            "border-teal-300/50 bg-teal-400 text-[#03110f] hover:bg-teal-300",
        slate:
            "border-[#303741] bg-[#151a20] text-slate-200 hover:border-teal-400/25 hover:bg-[#181f26]",
        red:
            "border-red-500/30 bg-red-500/12 text-red-200 hover:bg-red-500/20",
        green:
            "border-emerald-500/30 bg-emerald-500/12 text-emerald-200 hover:bg-emerald-500/20",
        amber:
            "border-amber-500/30 bg-amber-500/12 text-amber-200 hover:bg-amber-500/20",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-3 text-sm",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition-all duration-200 hover:-translate-y-0.5",
                tones[tone] || tones.teal,
                sizes[size] || sizes.md,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}