import { cn } from "@/lib/utils";

export function SidebarCard({ children, className = "" }) {
    return (
        <aside
            className={cn(
                "relative overflow-hidden rounded-3xl border border-blue-500/20 p-4",
                "bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))]",
                "shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
                className
            )}
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.18),transparent_34%)]" />
            <div className="relative z-10">{children}</div>
        </aside>
    );
}