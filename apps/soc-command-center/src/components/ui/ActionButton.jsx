import { cn } from "@/lib/utils";

export function ActionButton({
    children,
    tone = "blue",
    size = "md",
    className = "",
    ...props
}) {
    const tones = {
        blue: "border-blue-500/30 bg-blue-500/15 text-blue-200 hover:bg-blue-500/25",
        red: "border-red-500/30 bg-red-500/15 text-red-200 hover:bg-red-500/25",
        green: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25",
        orange: "border-orange-500/30 bg-orange-500/15 text-orange-200 hover:bg-orange-500/25",
        slate: "border-slate-500/30 bg-slate-500/10 text-slate-200 hover:bg-slate-500/20",
        yellow: "border-yellow-500/30 bg-yellow-500/15 text-yellow-200 hover:bg-yellow-500/25",
        purple: "border-purple-500/30 bg-purple-500/15 text-purple-200 hover:bg-purple-500/25",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition-all duration-200 hover:-translate-y-0.5",
                tones[tone],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}