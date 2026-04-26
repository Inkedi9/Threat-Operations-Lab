import { getHotStateClasses } from "./hotSystem";

/* ========================================
   🧱 UI Primitive — PanelCard
======================================== */

export default function PanelCard({
    children,
    className = "",
    padded = true,
    glow = false,
    dense = false,
    variant = "default",
    hotLevel = "none", // none | low | medium | high
    live = false,
    stress = false,
    scan = false,
}) {
    const radius = getPanelRadius({ variant, dense });
    const padding = padded ? (dense ? "p-3" : "p-4") : "";

    const variantClass = getVariantClass(variant);
    const glowClass = glow ? getGlowClass(variant) : "";
    const hotClass = getHotStateClasses({
        hotLevel,
        live,
        stress,
        scan,
    });

    return (
        <>
            <div
                className={[
                    "relative transition-all duration-300",
                    radius,
                    padding,
                    variantClass,
                    glowClass,
                    hotClass,
                    className,
                ].join(" ")}
            >
                {children}
            </div>

            <style>{`
                @keyframes panelStressPulse {
                    0%, 100% {
                        transform: translateZ(0);
                        box-shadow: 0 0 0 rgba(255,255,255,0);
                    }
                    50% {
                        transform: translateZ(0);
                        box-shadow:
                            0 0 0 rgba(255,255,255,0),
                            0 0 24px rgba(255,255,255,0.03);
                    }
                }

                @keyframes panelScanSweep {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(520%);
                    }
                }
            `}

            </style>
        </>
    );
}

/* ========================================
   🧠 Variant Styles
======================================== */

function getVariantClass(variant) {
    const base = [
        "relative overflow-hidden",
        "rounded-xl",
        "transition-all duration-300",
        "backdrop-blur-xl",
        "before:absolute before:inset-0 before:pointer-events-none",
        "before:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)]",
        "after:absolute after:inset-0 after:pointer-events-none",
        "after:rounded-xl",
    ].join(" ");

    // ✅ TON GLASS (inchangé)
    if (variant === "glass") {
        return [
            base,
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))]",
            "border border-white/[0.07]",
            "shadow-[0_10px_28px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.05)]",
        ].join(" ");
    }

    if (variant === "elevated") {
        return [
            base,

            // 🫥 fond ultra léger (presque rien)
            "bg-[linear-gradient(135deg,rgba(15,23,42,0.06),rgba(15,23,42,0.02))]",
            "backdrop-blur-3xl",
            "border border-transparent",
            "before:bg-transparent",
            "after:shadow-none",
            "shadow-none",
        ].join(" ");
    }

    // ⚪ Signal / neutre (panels secondaires)
    if (variant === "signal") {
        return [
            base,
            "bg-[radial-gradient(circle_at_50%_0%,rgba(148,163,184,0.12),transparent_40%),linear-gradient(135deg,#020617,#0f172a)]",
            "border border-slate-500/30",
            "shadow-[0_0_22px_rgba(148,163,184,0.08),0_18px_40px_rgba(0,0,0,0.5)]",
            "after:shadow-[inset_0_0_22px_rgba(148,163,184,0.08)]",
        ].join(" ");
    }

    // 🔵 Défense (blue team)
    if (variant === "defense") {
        return [
            base,
            "bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.22),transparent_40%),linear-gradient(135deg,#020617,#0f172a)]",
            "border border-blue-500/50",
            "shadow-[0_0_32px_rgba(59,130,246,0.18),0_18px_45px_rgba(0,0,0,0.55)]",
            "after:shadow-[inset_0_0_28px_rgba(59,130,246,0.12)]",
        ].join(" ");
    }

    // 🔴 Threat (alert / red team)
    if (variant === "threat") {
        return [
            base,
            "bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.25),transparent_40%),linear-gradient(135deg,#0b0a10,#2a0f14)]",
            "border border-red-500/60",
            "shadow-[0_0_36px_rgba(239,68,68,0.22),0_20px_50px_rgba(0,0,0,0.6)]",
            "after:shadow-[inset_0_0_30px_rgba(239,68,68,0.14)]",
        ].join(" ");
    }

    // 🟣 Intel / purple layer
    if (variant === "intel") {
        return [
            base,
            "bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.22),transparent_40%),linear-gradient(135deg,#060512,#1a1030)]",
            "border border-violet-500/40",
            "shadow-[0_0_34px_rgba(139,92,246,0.20),0_18px_45px_rgba(0,0,0,0.55)]",
            "after:shadow-[inset_0_0_30px_rgba(139,92,246,0.14)]",
        ].join(" ");
    }

    // 🔥 Hot (état actif)
    if (variant === "hot") {
        return [
            base,

            // ⚫ fond presque totalement noir (obsidian)
            "bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.10),transparent_30%),linear-gradient(135deg,#01020a,#02040c)]",
            // 🟣 border très fine et sombre (beaucoup moins flashy)
            "border border-violet-500/25",
            // 🌌 glow externe très discret (juste un hint)
            "shadow-[0_0_18px_rgba(139,92,246,0.12),0_14px_40px_rgba(0,0,0,0.85)]",
            // ✨ glow interne ultra soft
            "after:shadow-[inset_0_0_18px_rgba(139,92,246,0.08)]",
            // 🧊 texte neutre (pas teinté violet)
            "text-slate-200",
        ].join(" ");
    }

    // ⚫ Default (dashboard)
    return [
        base,
        "bg-[linear-gradient(135deg,#020617,#0f172a)]",
        "border border-cyan-500/20",
        "shadow-[0_18px_40px_rgba(0,0,0,0.55)]",
        "after:shadow-[inset_0_0_24px_rgba(34,211,238,0.06)]",
    ].join(" ");
}

/* ========================================
   🎨 Glow by Variant
======================================== */

function getGlowClass(variant) {
    if (variant === "threat") {
        return "hover:shadow-[0_0_46px_rgba(239,68,68,0.35)]";
    }

    if (variant === "defense") {
        return "hover:shadow-[0_0_42px_rgba(59,130,246,0.30)]";
    }

    if (variant === "intel") {
        return "hover:shadow-[0_0_42px_rgba(139,92,246,0.30)]";
    }

    if (variant === "hot") {
        return "shadow-[0_0_60px_rgba(239,68,68,0.45)]";
    }

    if (variant === "signal") {
        return "hover:shadow-[0_0_26px_rgba(255,255,255,0.10)]";
    }

    return "hover:shadow-[0_0_28px_rgba(34,211,238,0.18)]";
}

/* ========================================
   📐 Radius Logic
======================================== */

function getPanelRadius({ variant, dense }) {
    if (variant === "hot" || variant === "threat") {
        return "rounded-md";
    }

    if (variant === "defense" || variant === "intel" || variant === "signal") {
        return "rounded-xl";
    }

    return dense ? "rounded-2xl" : "rounded-3xl";
}