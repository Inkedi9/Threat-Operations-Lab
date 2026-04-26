import { cn } from "@/lib/utils";

export function SidebarItem({
    icon: Icon,
    label,
    active = false,
    badge,
    onClick,
    className = "",
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-200",
                active
                    ? "border-blue-400/40 bg-blue-500/15 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.16)]"
                    : "border-transparent text-slate-400 hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-slate-100",
                className
            )}
        >
            <span className="flex items-center gap-3">
                {Icon && (
                    <span
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
                            active
                                ? "border-blue-400/40 bg-blue-500/20 text-blue-200"
                                : "border-slate-700/60 bg-slate-950/50 text-slate-400 group-hover:border-blue-500/30 group-hover:text-blue-300"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                    </span>
                )}

                <span className="text-sm font-medium">{label}</span>
            </span>

            {badge && (
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-300">
                    {badge}
                </span>
            )}
        </button>
    );
}