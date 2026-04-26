export default function RiskBadge({ level }) {
    const styles = {
        Low: "bg-success/15 text-success border-success/30",
        Medium: "bg-warning/15 text-warning border-warning/30",
        High: "bg-danger/15 text-danger border-danger/30",
        Critical: "bg-red-900/30 text-red-400 border-red-500/30",
    };

    return (
        <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[level] || "bg-slate-800 text-slate-200 border-slate-700"
                }`}
        >
            {level} Risk
        </span>
    );
}