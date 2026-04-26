import { type, cx } from "../ui/typography";
/* ========================================
   🏷️ Shared Page Header
======================================== */

export default function PageHeader({
    eyebrow = "PURPLE TEAM VALIDATION PLATFORM",
    title,
    description,
    stats = [],
    variant = "default", // default | compact | immersive
}) {
    const wrapperClass =
        variant === "immersive"
            ? [
                "border-b border-white/[0.06]",
                "bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(10,14,24,0.94))]",
                "px-4 py-4 backdrop-blur-xl",
            ].join(" ")
            : variant === "compact"
                ? [
                    "rounded-3xl border border-white/[0.06]",
                    "bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(10,14,24,0.82))]",
                    "p-4 shadow-[0_0_24px_rgba(139,92,246,0.08),0_14px_32px_rgba(0,0,0,0.20)]",
                    "backdrop-blur animate-fade-in",
                ].join(" ")
                : [
                    "rounded-3xl border border-white/[0.06]",
                    "bg-[linear-gradient(180deg,rgba(15,23,42,0.84),rgba(10,14,24,0.84))]",
                    "p-5 shadow-[0_0_26px_rgba(139,92,246,0.08),0_14px_34px_rgba(0,0,0,0.22)]",
                    "backdrop-blur animate-fade-in",
                ].join(" ");

    return (
        <header className={wrapperClass}>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="mb-2 break-words text-[11px] uppercase tracking-[0.35em] text-cyber-violet">
                        {eyebrow}
                    </div>

                    <h1
                        className={`break-words font-bold tracking-tight ${variant === "compact" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
                            }`}
                    >
                        <span className="text-gradient-cyber">{title}</span>
                    </h1>

                    {description && variant !== "compact" && (
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-cyber-muted md:text-base">
                            {description}
                        </p>
                    )}
                </div>

                {stats.length > 0 && (
                    <div className="w-full xl:w-auto xl:max-w-[720px] xl:shrink-0">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
                            {stats.map((stat) => (
                                <HeaderStatCard
                                    key={stat.label}
                                    label={stat.label}
                                    value={stat.value}
                                    icon={stat.icon}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

function HeaderStatCard({ label, value, icon }) {
    return (
        <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.14)] backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className="truncate text-[11px] uppercase tracking-[0.14em] text-cyber-muted">
                    {label}
                </span>
                <div className="shrink-0">{icon}</div>
            </div>

            <p className="truncate text-xl font-bold text-cyber-text">
                {value}
            </p>
        </div>
    );
}