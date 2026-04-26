/* ========================================
   🧱 Shared Page Shell
======================================== */

export default function PageShell({
    header,
    left,
    center,
    right,
    rightWidth = "360px",
    leftWidth = "320px",
    fullscreen = false,
    variant = "default", // default | dense
}) {
    const gapClass = variant === "dense" ? "gap-3" : "gap-5";

    if (fullscreen) {
        return (
            <div className="flex h-screen flex-col bg-cyber-bg">
                {header && <div className="shrink-0">{header}</div>}

                <div
                    className={`grid min-h-0 flex-1 ${gapClass} px-4 pb-4 pt-4`}
                    style={{ gridTemplateColumns: `${leftWidth} minmax(0,1fr) ${rightWidth}` }}
                >
                    <div className="min-h-0 space-y-5 overflow-y-auto pr-1">{left}</div>
                    <div className="min-h-0 space-y-5 overflow-y-auto pr-1">{center}</div>
                    <div className="min-h-0 space-y-5 overflow-y-auto pr-1">{right}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="cyber-grid min-h-[calc(100vh-2rem)] rounded-[28px] border border-cyber-border bg-cyber-bg/70 p-4 shadow-cyber glass-panel md:p-6">
            {header && <div className={variant === "dense" ? "mb-4" : "mb-6"}>{header}</div>}

            <div
                className={`grid grid-cols-1 ${gapClass} xl:grid-cols-[var(--left)_minmax(0,1fr)_var(--right)]`}
                style={{
                    "--left": leftWidth,
                    "--right": rightWidth,
                }}
            >
                <div className="space-y-5">{left}</div>
                <div className="space-y-5">{center}</div>
                <div className="space-y-5">{right}</div>
            </div>
        </div>
    );
}