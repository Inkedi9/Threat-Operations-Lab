import { type, cx } from "./typography";
/* ========================================
   📊 UI Primitive — MetricCard
======================================== */

export default function MetricCard({
    label,
    value,
    icon = null,
    tone = "text-cyber-text",
    compact = false,
    className = "",
    variant = "default", // default | signal | threat | defense | intel
    accent = "none", // none | red | blue | violet | green | amber
}) {
    return (
        <div
            className={[
                "relative overflow-hidden border transition-all duration-200",
                getMetricRadius(compact, variant),
                getMetricVariantClass(variant),
                className,
            ].join(" ")}
        >
            {accent !== "none" && (
                <div
                    className={[
                        "absolute inset-y-0 left-0 w-[3px]",
                        getAccentRailClass(accent),
                    ].join(" ")}
                />
            )}

            <div className={accent !== "none" ? "pl-2" : ""}>
                <div className={compact ? "p-3" : "p-4"}>
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs uppercase tracking-wide text-cyber-muted">
                            {label}
                        </p>
                        {icon ? <div className="shrink-0">{icon}</div> : null}
                    </div>

                    <p
                        className={`mt-2 break-words font-bold ${compact ? "text-lg" : "text-xl"
                            } ${tone}`}
                    >
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ========================================
   🎨 Variant Styles
======================================== */

function getMetricVariantClass(variant) {
    if (variant === "signal") {
        return [
            "border-white/[0.08]",
            "bg-[linear-gradient(180deg,rgba(18,24,38,0.88),rgba(9,12,18,0.96))]",
            "shadow-[0_10px_24px_rgba(0,0,0,0.22)]",
        ].join(" ");
    }

    if (variant === "threat") {
        return [
            "border-cyber-red/30",
            "bg-[linear-gradient(180deg,rgba(56,10,14,0.30),rgba(12,8,10,0.92))]",
            "shadow-[0_0_18px_rgba(239,68,68,0.10),0_10px_24px_rgba(0,0,0,0.24)]",
        ].join(" ");
    }

    if (variant === "defense") {
        return [
            "border-cyber-blue/30",
            "bg-[linear-gradient(180deg,rgba(10,26,48,0.28),rgba(8,10,18,0.92))]",
            "shadow-[0_0_18px_rgba(59,130,246,0.08),0_10px_24px_rgba(0,0,0,0.24)]",
        ].join(" ");
    }

    if (variant === "intel") {
        return [
            "relative overflow-hidden",
            "border border-white/[0.06]",
            "bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(139,92,246,0.05))]",
            "shadow-[0_0_20px_rgba(139,92,246,0.10),0_10px_24px_rgba(0,0,0,0.22)]",
            "before:absolute before:inset-0 before:bg-violet-400/[0.02] before:pointer-events-none",
            "after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-white/[0.08] after:pointer-events-none",
        ].join(" ");
    }

    return [
        "border-cyber-border",
        "bg-cyber-panel2",
    ].join(" ");
}

function getMetricRadius(compact, variant) {
    if (variant === "threat") return compact ? "rounded-md" : "rounded-lg";
    if (variant === "signal" || variant === "defense" || variant === "intel") {
        return compact ? "rounded-xl" : "rounded-2xl";
    }

    return compact ? "rounded-xl" : "rounded-2xl";
}

function getAccentRailClass(accent) {
    if (accent === "red") {
        return "bg-cyber-red shadow-[0_0_14px_rgba(239,68,68,0.38)]";
    }

    if (accent === "blue") {
        return "bg-cyber-blue shadow-[0_0_14px_rgba(59,130,246,0.36)]";
    }

    if (accent === "violet") {
        return "bg-cyber-violet shadow-[0_0_14px_rgba(139,92,246,0.36)]";
    }

    if (accent === "green") {
        return "bg-cyber-green shadow-[0_0_14px_rgba(34,197,94,0.36)]";
    }

    if (accent === "amber") {
        return "bg-cyber-amber shadow-[0_0_14px_rgba(245,158,11,0.34)]";
    }

    return "bg-transparent";
}