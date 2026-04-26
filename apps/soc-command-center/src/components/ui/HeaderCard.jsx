import { cn } from "@/lib/utils";
import { ShieldAlert, Siren, FolderOpen, Activity } from "lucide-react";

export function HeaderCard({ eyebrow, title, description, children, className = "" }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl border border-blue-500/30 p-6",
                "bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.22),transparent_42%),linear-gradient(135deg,#020617,#0f172a)]",
                "shadow-[0_0_36px_rgba(59,130,246,0.16),0_22px_60px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_35%)] opacity-60" />

            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    {eyebrow && (
                        <p className="text-xs uppercase tracking-[0.32em] text-blue-300">
                            {eyebrow}
                        </p>
                    )}

                    <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                            {description}
                        </p>
                    )}
                </div>

                {children && <div className="flex flex-wrap gap-2">{children}</div>}
            </div>
        </div>
    );
}