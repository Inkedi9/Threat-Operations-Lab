import { phishingFlags } from "../data/scenarios";

export default function AnalysisPanel({
    verdict,
    setVerdict,
    selectedFlags,
    setSelectedFlags,
    onSubmit,
    disabled,
}) {
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

            <div className="mb-6 space-y-3">
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

            <div>
                <h4 className="mb-3 font-semibold text-slate-200">Red Flags</h4>
                <div className="space-y-2">
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
            </div>

            <button
                onClick={onSubmit}
                disabled={disabled}
                className="mt-6 w-full rounded-xl bg-accent px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
            >
                Submit Analysis
            </button>
        </div>
    );
}