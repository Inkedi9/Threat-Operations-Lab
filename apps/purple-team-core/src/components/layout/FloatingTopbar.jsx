import { type, cx } from "../ui/typography";

/* ========================================
   🧭 Floating Topbar
======================================== */

export default function FloatingTopbar({
    activeView,
    setActiveView,
    mode,
    setMode,
    onRun,
}) {
    const tabs = [
        { id: "overview", label: "Dashboard" },
        { id: "red", label: "Red Side" },
        { id: "purple", label: "Purple Side" },
        { id: "blue", label: "Blue Side" },
        { id: "rules", label: "Rules Lab" },
        { id: "warroom", label: "War Room" },
        { id: "analytics", label: "Analytics" },
        { id: "output", label: "Output" },
    ];

    return (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
            <div className="max-w-[96vw] overflow-x-auto">
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(10,14,24,0.78))] px-3 py-2 shadow-[0_0_28px_rgba(139,92,246,0.10),0_12px_28px_rgba(0,0,0,0.26)] backdrop-blur-xl">
                    {/* ========================================
                       🧭 Tabs
                    ======================================== */}
                    <div className="flex items-center gap-1 rounded-2xl border border-white/[0.05] bg-black/10 p-1">
                        {tabs.map((tab) => {
                            const active = activeView === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveView(tab.id)}
                                    className={[
                                        "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
                                        active
                                            ? "border border-cyber-violet/30 bg-[linear-gradient(180deg,rgba(139,92,246,0.18),rgba(139,92,246,0.08))] text-white shadow-[0_0_14px_rgba(139,92,246,0.14)]"
                                            : "border border-transparent text-cyber-muted hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-white",
                                    ].join(" ")}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-8 w-px bg-white/[0.08]" />

                    {/* ========================================
                       ⚙️ Mode Switch
                    ======================================== */}
                    <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-black/10 p-1">
                        {["single", "campaign"].map((item) => {
                            const active = mode === item;

                            return (
                                <button
                                    key={item}
                                    onClick={() => setMode(item)}
                                    className={[
                                        "rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200",
                                        active
                                            ? "border border-cyber-blue/25 bg-[linear-gradient(180deg,rgba(59,130,246,0.16),rgba(59,130,246,0.06))] text-white shadow-[0_0_12px_rgba(59,130,246,0.10)]"
                                            : "border border-transparent text-cyber-muted hover:text-white",
                                    ].join(" ")}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>

                    {/* ========================================
                       ▶️ Run Button
                    ======================================== */}
                    <button
                        onClick={onRun}
                        className="inline-flex items-center gap-2 rounded-2xl border border-cyber-red/25 bg-[linear-gradient(180deg,rgba(239,68,68,0.16),rgba(239,68,68,0.07))] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(239,68,68,0.12)] transition-all duration-200 hover:scale-[1.01] hover:bg-[linear-gradient(180deg,rgba(239,68,68,0.20),rgba(239,68,68,0.10))]"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                        </span>
                        <span>Run</span>
                    </button>
                </div>
            </div>
        </div>
    );
}