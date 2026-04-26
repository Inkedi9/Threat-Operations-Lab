import { type, cx } from "./typography";
/* ========================================
   🏷️ UI Primitive — PanelHeader
======================================== */

export default function PanelHeader({
    icon,
    title,
    subtitle,
    action = null,
    compact = false,
}) {
    return (
        <div className={compact ? "" : ""}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        {icon}
                        <h2 className={compact ? "text-base font-semibold" : "text-lg font-semibold"}>
                            {title}
                        </h2>
                    </div>

                    {subtitle && (
                        <p className={compact ? "mt-1 text-xs text-cyber-muted" : "mt-1 text-sm text-cyber-muted"}>
                            {subtitle}
                        </p>
                    )}
                </div>

                {action ? <div className="shrink-0">{action}</div> : null}
            </div>
        </div>
    );
}