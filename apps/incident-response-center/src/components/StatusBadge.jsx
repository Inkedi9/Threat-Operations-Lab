export default function StatusBadge({ status }) {
    const normalized = String(status).toLowerCase();

    const styles = {
        critical: "border-red-500/40 bg-red-500/10 text-red-300 shadow-[0_0_18px_rgba(239,68,68,0.14)]",
        high: "border-orange-500/40 bg-orange-500/10 text-orange-300",
        active: "border-orange-500/40 bg-orange-500/10 text-orange-300",
        pending: "border-stone-500/40 bg-stone-500/10 text-stone-300",
        running: "border-amber-500/40 bg-amber-500/10 text-amber-300",
        completed: "border-green-500/40 bg-green-500/10 text-green-300 shadow-[0_0_18px_rgba(34,197,94,0.12)]",
        contained: "border-green-500/40 bg-green-500/10 text-green-300",
        watchlist: "border-amber-500/40 bg-amber-500/10 text-amber-300",
        blocked: "border-green-500/40 bg-green-500/10 text-green-300",
    };

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${styles[normalized] || styles.pending
                }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}