import { cn } from "@/lib/utils";

export function TabButton({ active, children, ...props }) {
    return (
        <button
            className={cn(
                "rounded-xl border px-3 py-1.5 text-sm font-medium transition-all duration-200",
                active
                    ? "border-blue-500/40 bg-blue-500/15 text-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.14)]"
                    : "border-blue-400/10 bg-slate-950/50 text-slate-400 hover:border-blue-500/25 hover:bg-blue-500/10 hover:text-slate-100"
            )}
            {...props}
        >
            {children}
        </button>
    );
}