/* ========================================
   🎨 Status Badge Helpers + Component
======================================== */

export function severityClasses(severity) {
    const value = String(severity ?? "").toLowerCase();

    const base =
        "rounded-lg border px-3 py-1 text-[11px] font-semibold tracking-[0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

    if (value === "critical") {
        return `${base} border-cyber-red/40 bg-[linear-gradient(180deg,rgba(80,12,18,0.30),rgba(18,8,10,0.92))] text-cyber-red`;
    }

    if (value === "high") {
        return `${base} border-cyber-red/30 bg-[linear-gradient(180deg,rgba(56,10,14,0.24),rgba(12,8,10,0.90))] text-cyber-red`;
    }

    if (value === "medium") {
        return `${base} border-cyber-amber/30 bg-[linear-gradient(180deg,rgba(82,52,8,0.18),rgba(18,12,8,0.90))] text-cyber-amber`;
    }

    if (value === "low") {
        return `${base} border-cyber-blue/30 bg-[linear-gradient(180deg,rgba(16,34,72,0.18),rgba(10,14,24,0.92))] text-cyber-blue`;
    }

    return `${base} border-cyber-border bg-cyber-panel2 text-cyber-muted`;
}

export function statusClasses(status) {
    const value = String(status ?? "").toLowerCase();

    const base =
        "rounded-lg border px-3 py-1 text-[11px] font-semibold tracking-[0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

    if (value === "detected") {
        return `${base} border-cyber-green/30 bg-[linear-gradient(180deg,rgba(8,40,24,0.24),rgba(8,12,10,0.92))] text-cyber-green`;
    }

    if (value === "partially detected") {
        return `${base} border-cyber-amber/30 bg-[linear-gradient(180deg,rgba(82,52,8,0.18),rgba(18,12,8,0.90))] text-cyber-amber`;
    }

    if (value === "missed") {
        return `${base} border-cyber-red/30 bg-[linear-gradient(180deg,rgba(56,10,14,0.24),rgba(12,8,10,0.90))] text-cyber-red`;
    }

    if (value === "in progress") {
        return `${base} border-cyber-violet/30 bg-[linear-gradient(180deg,rgba(40,18,72,0.20),rgba(12,10,20,0.90))] text-cyber-violet`;
    }

    if (value === "active") {
        return `${base} border-cyber-green/30 bg-[linear-gradient(180deg,rgba(8,40,24,0.24),rgba(8,12,10,0.92))] text-cyber-green`;
    }

    if (value === "draft") {
        return `${base} border-cyber-amber/30 bg-[linear-gradient(180deg,rgba(82,52,8,0.18),rgba(18,12,8,0.90))] text-cyber-amber`;
    }

    if (value === "disabled") {
        return `${base} border-cyber-border bg-cyber-panel2 text-cyber-muted`;
    }

    return `${base} border-cyber-border bg-cyber-panel2 text-cyber-muted`;
}

export function ruleTypeClasses(type) {
    const value = String(type ?? "").toLowerCase();
    const base =
        "rounded-lg border px-3 py-1 text-[11px] font-semibold tracking-[0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

    if (value === "sigma") {
        return `${base} border-cyber-violet/30 bg-[linear-gradient(180deg,rgba(40,18,72,0.20),rgba(12,10,20,0.90))] text-cyber-violet`;
    }

    if (value === "yara") {
        return `${base} border-cyber-blue/30 bg-[linear-gradient(180deg,rgba(16,34,72,0.18),rgba(10,14,24,0.92))] text-cyber-blue`;
    }

    return `${base} border-cyber-border bg-cyber-panel2 text-cyber-muted`;
}

export default function StatusBadge({
    kind = "status", // status | severity | ruleType
    value,
    className = "",
}) {
    const classes =
        kind === "severity"
            ? severityClasses(value)
            : kind === "ruleType"
                ? ruleTypeClasses(value)
                : statusClasses(value);

    return (
        <span className={`${classes} ${className}`}>
            {value}
        </span>
    );
}