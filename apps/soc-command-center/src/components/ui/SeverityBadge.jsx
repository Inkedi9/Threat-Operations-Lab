export function SeverityBadge({ severity }) {
    const styles = {
        critical: "bg-red-500/15 text-red-300 border-red-500/30",
        high: "bg-orange-500/15 text-orange-300 border-orange-500/30",
        medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
        low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    };

    return (
        <span className={`rounded-lg border px-2 py-1 text-xs font-bold uppercase ${styles[severity] || styles.low}`}>
            {severity}
        </span>
    );
}