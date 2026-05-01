import Sidebar from "./Sidebar";

const mobileViews = [
    { id: "overview", label: "Overview" },
    { id: "scenarios", label: "Scenarios" },
    { id: "graph", label: "Graph" },
    { id: "replay", label: "Replay" },
    { id: "story", label: "Story" },
    { id: "intelligence", label: "Intel" },
    { id: "entities", label: "Entities" },
];

export default function AppShell({
    children,
    activeView = "overview",
    onViewChange = () => { },
    onReset = () => { },
    metrics,
    state,
}) {
    return (
        <div className="min-h-screen bg-void text-ink">
            <div className="flex min-h-screen w-full">
                <Sidebar
                    activeView={activeView}
                    onViewChange={onViewChange}
                    onReset={onReset}
                    metrics={metrics}
                    state={state}
                />

                <main className="min-w-0 flex-1 p-4 md:p-5 xl:p-8">
                    <div className="sticky top-3 z-40 mb-5 rounded-2xl border border-danger/20 bg-black/80 p-2 shadow-dangerSoft backdrop-blur xl:hidden">
                        <div className="flex gap-2 overflow-x-auto">
                            {mobileViews.map((view) => (
                                <button
                                    key={view.id}
                                    type="button"
                                    onClick={() => onViewChange(view.id)}
                                    className={`shrink-0 rounded-xl border px-3 py-2 text-sm transition ${activeView === view.id
                                        ? "border-danger/30 bg-danger/10 text-red-200"
                                        : "border-line/70 bg-black/30 text-zinc-300"
                                        }`}
                                >
                                    {view.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {children}
                </main>
            </div>
        </div>
    );
}