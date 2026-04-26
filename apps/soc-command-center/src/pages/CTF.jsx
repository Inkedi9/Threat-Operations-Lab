import { useState } from "react";
import { Target, Trophy, ShieldCheck } from "lucide-react";
import { CyberPanel } from "@/components/ui/CyberPanel";
import { HeaderCard } from "@/components/ui/HeaderCard";
import { Badge } from "@/components/ui/Badge";

export default function CTF({ alerts = [] }) {
    const [selected, setSelected] = useState(null);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState(null);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState("Junior Analyst");

    function updateLevel(newScore) {
        if (newScore >= 100) return "Senior Analyst";
        if (newScore >= 50) return "SOC Analyst";
        return "Junior Analyst";
    }

    function validate() {
        if (!selected) return;

        const successLog = selected.logs.find((l) =>
            l.toLowerCase().includes("success")
        );

        if (successLog && answer.toLowerCase().includes("root")) {
            const newScore = score + 25;
            setScore(newScore);
            setLevel(updateLevel(newScore));
            setResult("success");
        } else {
            setResult("fail");
        }
    }

    return (
        <div className="space-y-6">

            <HeaderCard
                eyebrow="SOC Training"
                title="CTF Investigation Lab"
                description="Hands-on analyst challenges based on real SOC scenarios. Identify compromised accounts and analyze attack traces."
            >
                <Badge tone="blue">{alerts.length} Challenges</Badge>
                <Badge tone="green">{level}</Badge>
                <Badge tone="cyan">{score} pts</Badge>
            </HeaderCard>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">

                {/* LEFT PANEL */}
                <div className="space-y-4">

                    <CyberPanel>
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="text-blue-400 w-5 h-5" />
                            <h3 className="font-semibold text-white">Progression</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                            <div>
                                <p className="text-soc-muted">Score</p>
                                <p className="text-xl font-bold text-blue-400">{score}</p>
                            </div>
                            <div>
                                <p className="text-soc-muted">Level</p>
                                <p className="text-xl font-bold text-green-400">{level}</p>
                            </div>
                        </div>

                        <div className="w-full bg-slate-700 h-2 rounded">
                            <div
                                className="h-2 bg-blue-500 rounded transition-all"
                                style={{ width: `${Math.min(score, 100)}%` }}
                            />
                        </div>

                        <p className="text-xs text-soc-muted mt-2">
                            {score}/100 → Senior Analyst
                        </p>
                    </CyberPanel>

                    <CyberPanel>
                        <h3 className="font-semibold text-white mb-3">
                            🎯 Select Incident
                        </h3>

                        {alerts.slice(0, 6).map((a) => (
                            <div
                                key={a.id}
                                onClick={() => {
                                    setSelected(a);
                                    setResult(null);
                                    setAnswer("");
                                }}
                                className={`p-3 mb-2 rounded-xl cursor-pointer border transition-all ${selected?.id === a.id
                                    ? "bg-blue-500/10 border-blue-500/30"
                                    : "bg-slate-900 border-slate-700 hover:bg-slate-800"
                                    }`}
                            >
                                <p className="text-sm text-white font-medium">{a.name}</p>
                                <p className="text-xs text-soc-muted">{a.ip}</p>
                            </div>
                        ))}
                    </CyberPanel>

                </div>

                {/* RIGHT PANEL */}
                <CyberPanel>

                    {!selected && (
                        <div className="text-soc-muted">
                            Select an incident to begin investigation.
                        </div>
                    )}

                    {selected && (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck className="text-green-400 w-5 h-5" />
                                <h3 className="text-lg font-semibold text-white">
                                    {selected.name}
                                </h3>
                            </div>

                            {/* LOGS → SOC TERMINAL STYLE */}
                            <div className="mt-4">
                                <h4 className="text-slate-300 mb-2">📜 Security Logs</h4>

                                <div className="bg-black p-3 rounded text-xs space-y-1">
                                    {selected.logs.map((log, i) => {
                                        const msg = log.toLowerCase();

                                        let color = "text-slate-300";
                                        if (msg.includes("success")) color = "text-red-400";
                                        else if (msg.includes("failed")) color = "text-orange-300";
                                        else if (msg.includes("scan") || msg.includes("nmap")) color = "text-yellow-300";
                                        else if (msg.includes("flag")) color = "text-green-400";

                                        return (
                                            <div key={i} className={`font-mono ${color}`}>
                                                {">"} {log}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* QUESTION */}
                            <div className="mb-3">
                                <p className="text-sm text-white font-medium mb-1">
                                    ❓ Which account was compromised?
                                </p>
                                <p className="text-xs text-soc-muted">
                                    Analyze logs carefully to identify attacker success.
                                </p>
                            </div>

                            <input
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="w-full bg-slate-900 border border-soc-border rounded p-2 text-sm mb-3"
                                placeholder="Enter username..."
                            />

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={validate}
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition"
                                >
                                    Submit
                                </button>

                                {result === "success" && (
                                    <span className="text-green-400 text-sm flex items-center gap-1">
                                        <Trophy className="w-4 h-4" />
                                        Correct
                                    </span>
                                )}

                                {result === "fail" && (
                                    <span className="text-red-400 text-sm">
                                        ❌ Wrong answer
                                    </span>
                                )}
                            </div>
                        </>
                    )}

                </CyberPanel>

            </div>
        </div>
    );
}