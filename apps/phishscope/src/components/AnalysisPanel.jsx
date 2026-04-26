import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { phishingFlags } from "../data/scenarios";

export default function AnalysisPanel({
    verdict,
    setVerdict,
    selectedFlags,
    setSelectedFlags,
    onSubmit,
    disabled,
}) {
    const [flagsOpen, setFlagsOpen] = useState(false);

    const toggleFlag = (flag) => {
        if (selectedFlags.includes(flag)) {
            setSelectedFlags(selectedFlags.filter((item) => item !== flag));
        } else {
            setSelectedFlags([...selectedFlags, flag]);
        }
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-bold">Analysis Panel</h3>

            <div className="mb-5 space-y-3">
                <button
                    onClick={() => setVerdict("legitimate")}
                    className={`w-full rounded-xl border px-4 py-3 ${verdict === "legitimate"
                        ? "border-success bg-success/10 text-success"
                        : "border-border bg-slate-900 text-white"
                        }`}
                >
                    Legitimate
                </button>

                <button
                    onClick={() => setVerdict("suspicious")}
                    className={`w-full rounded-xl border px-4 py-3 ${verdict === "suspicious"
                        ? "border-warning bg-warning/10 text-warning"
                        : "border-border bg-slate-900 text-white"
                        }`}
                >
                    Suspicious
                </button>

                <button
                    onClick={() => setVerdict("phishing")}
                    className={`w-full rounded-xl border px-4 py-3 ${verdict === "phishing"
                        ? "border-danger bg-danger/10 text-danger"
                        : "border-border bg-slate-900 text-white"
                        }`}
                >
                    Phishing
                </button>
            </div>

            <div className="rounded-2xl border border-border bg-slate-950/40 p-3">
                <button
                    type="button"
                    onClick={() => setFlagsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                >
                    <div>
                        <h4 className="font-semibold text-slate-200">Red Flags</h4>
                        <p className="mt-1 text-xs text-slate-400">
                            {selectedFlags.length} selected
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        {flagsOpen ? "Hide" : "Show"}
                        {flagsOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </div>
                </button>

                {flagsOpen && (
                    <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                        {phishingFlags.map((flag) => (
                            <label
                                key={flag}
                                className="flex items-center gap-3 rounded-lg border border-border bg-slate-900 p-3 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedFlags.includes(flag)}
                                    onChange={() => toggleFlag(flag)}
                                />
                                <span>{flag}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={onSubmit}
                disabled={disabled}
                className="mt-5 w-full rounded-xl bg-accent px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Submit Analysis
            </button>
        </div>
    );
}