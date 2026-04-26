export default function StatCard({ title, value, color = "text-white" }) {
    return (
        <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:-translate-y-1 hover:border-accent/30 hover:shadow-cyan-500/10">
            <p className="text-sm uppercase tracking-wide text-muted">{title}</p>
            <p className={`mt-3 text-3xl font-black ${color}`}>{value}</p>
        </div>
    );
}