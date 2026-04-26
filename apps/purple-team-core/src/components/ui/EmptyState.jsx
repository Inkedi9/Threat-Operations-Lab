/* ========================================
   📭 UI Primitive — EmptyState
======================================== */

export default function EmptyState({
    icon = null,
    title = "Nothing here",
    description = "",
    action = null,
    compact = false,
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center ${compact ? "py-6" : "py-10"
                }`}
        >
            {icon && (
                <div className="mb-3 text-cyber-muted opacity-80">
                    {icon}
                </div>
            )}

            <p className="text-sm font-semibold text-cyber-text">
                {title}
            </p>

            {description && (
                <p className="mt-1 max-w-xs text-sm text-cyber-muted">
                    {description}
                </p>
            )}

            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}