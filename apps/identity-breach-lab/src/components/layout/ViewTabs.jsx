const views = [
    { id: "overview", label: "Overview" },
    { id: "graph", label: "Identity Graph" },
    { id: "replay", label: "Replay" },
    { id: "intelligence", label: "Intelligence" },
];

export default function ViewTabs({ activeView, onChange }) {
    return (
        <div className="sticky top-4 z-30 rounded-2xl border border-line/80 bg-black/50 p-2 backdrop-blur">
            <div className="flex flex-wrap gap-2">
                {views.map((view) => (
                    <button
                        key={view.id}
                        type="button"
                        onClick={() => onChange(view.id)}
                        className={`rounded-xl border px-4 py-2 text-sm transition ${activeView === view.id
                                ? "border-danger/30 bg-danger/10 text-red-200"
                                : "border-lineSoft bg-black/30 text-zinc-300 hover:border-danger/20 hover:bg-danger/10"
                            }`}
                    >
                        {view.label}
                    </button>
                ))}
            </div>
        </div>
    );
}