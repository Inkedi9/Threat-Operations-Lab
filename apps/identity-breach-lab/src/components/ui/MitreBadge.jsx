export default function MitreBadge({ tactic, techniqueId, technique }) {
    return (
        <div className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-danger/10 bg-danger/10 px-3 py-2 text-xs">
            <span className="rounded-full border border-danger/20 bg-danger/10 px-2 py-1 font-medium text-red-200">
                {techniqueId}
            </span>
            <span className="text-zinc-300">{tactic}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-200">{technique}</span>
        </div>
    );
}