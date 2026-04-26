/* ========================================
   📊 UI Primitive — MetricBar
======================================== */

export default function MetricBar({
    value = 0,
    max = 100,
    size = "md", // sm | md | lg
    tone = "auto", // auto | green | amber | red | violet | blue
    showValue = false,
    valueSuffix = "%",
    className = "",
    trackClassName = "",
    fillClassName = "",
}) {
    const safeMax = Math.max(1, max);
    const rawPercent = (Number(value) / safeMax) * 100;
    const percent = Math.max(0, Math.min(100, rawPercent));

    const heightClass =
        size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

    const fillTone =
        tone === "green"
            ? "bg-cyber-green"
            : tone === "amber"
                ? "bg-cyber-amber"
                : tone === "red"
                    ? "bg-cyber-red"
                    : tone === "violet"
                        ? "bg-cyber-violet"
                        : tone === "blue"
                            ? "bg-cyber-blue"
                            : percent >= 70
                                ? "bg-cyber-green"
                                : percent >= 40
                                    ? "bg-cyber-amber"
                                    : "bg-cyber-red";

    const valueTone =
        tone === "green"
            ? "text-cyber-green"
            : tone === "amber"
                ? "text-cyber-amber"
                : tone === "red"
                    ? "text-cyber-red"
                    : tone === "violet"
                        ? "text-cyber-violet"
                        : tone === "blue"
                            ? "text-cyber-blue"
                            : percent >= 70
                                ? "text-cyber-green"
                                : percent >= 40
                                    ? "text-cyber-amber"
                                    : "text-cyber-red";

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div
                className={`flex-1 overflow-hidden rounded-full bg-cyber-bgSoft ${heightClass} ${trackClassName}`}
            >
                <div
                    className={`h-full rounded-full transition-all duration-700 ${fillTone} ${fillClassName}`}
                    style={{ width: `${percent}%` }}
                />
            </div>

            {showValue && (
                <span className={`text-[10px] font-medium ${valueTone}`}>
                    {Math.round(Number(value))}{valueSuffix}
                </span>
            )}
        </div>
    );
}