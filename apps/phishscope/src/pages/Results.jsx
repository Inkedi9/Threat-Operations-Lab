import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getFinalStats } from "../utils/scoring";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { PhishLayout } from "@/components/ui/PhishLayout";
import { PhishHeader } from "@/components/ui/PhishHeader";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishBadge } from "@/components/ui/PhishBadge";
import { PhishButton } from "@/components/ui/PhishButton";
import { PhishMetric } from "@/components/ui/PhishMetric";

function getUserLevel(accuracy) {
    if (accuracy >= 90) return "SOC Ready";
    if (accuracy >= 75) return "Advanced";
    if (accuracy >= 50) return "Intermediate";
    return "Beginner";
}

export default function Results() {
    const storedResults =
        JSON.parse(localStorage.getItem("phishscope-results")) || [];

    const stats = getFinalStats(storedResults);
    const chartData = [
        { name: "Phishing Caught", value: stats.phishingCaught },
        { name: "False Positives", value: stats.falsePositives },
        { name: "False Negatives", value: stats.falseNegatives },
    ];

    const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];
    const userLevel = getUserLevel(stats.accuracy);

    const handleReset = () => {
        localStorage.removeItem("phishscope-results");
        window.location.reload();
    };

    return (
        <>
            <Header />

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
            >
                <PhishLayout>
                    <PhishHeader
                        eyebrow="Performance Review"
                        title="Results Dashboard"
                        description="Review phishing detection performance, scoring quality and analyst readiness across the simulation."
                    >
                        <PhishBadge tone="teal">{storedResults.length} analyzed</PhishBadge>
                        <PhishBadge tone="green">{stats.accuracy}% accuracy</PhishBadge>
                        <PhishBadge tone="slate">{userLevel}</PhishBadge>
                    </PhishHeader>

                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                        <Link to="/simulator">
                            <PhishButton tone="slate">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Simulator
                            </PhishButton>
                        </Link>

                        <PhishButton tone="red" onClick={handleReset}>
                            <RotateCcw className="h-4 w-4" />
                            Reset Session
                        </PhishButton>
                    </div>

                    {storedResults.length === 0 ? (
                        <PhishPanel className="mt-6">
                            <p className="text-sm text-slate-300">
                                No simulation results found yet. Complete at least one email analysis
                                in the simulator to generate your dashboard.
                            </p>
                        </PhishPanel>
                    ) : (
                        <div className="mt-6 space-y-6">
                            <PhishPanel variant="glow">
                                <p className="text-xs uppercase tracking-[0.25em] text-teal-300">
                                    Performance Level
                                </p>
                                <h2 className="mt-3 text-4xl font-black text-white">
                                    {userLevel}
                                </h2>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                                    You analyzed {storedResults.length} email
                                    {storedResults.length > 1 ? "s" : ""} with an overall accuracy of{" "}
                                    <span className="font-bold text-teal-300">{stats.accuracy}%</span>.
                                </p>
                            </PhishPanel>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <PhishMetric label="Total Score" value={stats.totalScore} tone="teal" />
                                <PhishMetric label="Accuracy" value={`${stats.accuracy}%`} tone="green" />
                                <PhishMetric label="Emails Analyzed" value={storedResults.length} tone="slate" />
                                <PhishMetric label="Phishing Caught" value={stats.phishingCaught} tone="red" />
                                <PhishMetric label="False Positives" value={stats.falsePositives} tone="amber" />
                                <PhishMetric label="False Negatives" value={stats.falseNegatives} tone="red" />
                            </div>

                            <div className="grid gap-6 xl:grid-cols-2">
                                <PhishPanel variant="card">
                                    <h3 className="mb-4 text-xl font-black text-white">
                                        Detection Breakdown
                                    </h3>

                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid stroke="#2a3038" strokeDasharray="3 3" />
                                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                                            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                                            <Tooltip
                                                contentStyle={{
                                                    background: "#101418",
                                                    border: "1px solid #2a3038",
                                                    borderRadius: "14px",
                                                    color: "#e2e8f0",
                                                    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[10, 10, 4, 4]}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={entry.name} fill={COLORS[index]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </PhishPanel>

                                <PhishPanel variant="card">
                                    <h3 className="mb-4 text-xl font-black text-white">
                                        Error Distribution
                                    </h3>

                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={entry.name} fill={COLORS[index]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    background: "#101418",
                                                    border: "1px solid #2a3038",
                                                    borderRadius: "14px",
                                                    color: "#e2e8f0",
                                                    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </PhishPanel>
                            </div>

                            <PhishPanel>
                                <p className="text-xs uppercase tracking-[0.22em] text-teal-300">
                                    Quick Assessment
                                </p>
                                <h3 className="mt-2 text-2xl font-black text-white">
                                    Analyst Feedback
                                </h3>
                                <p className="mt-4 leading-8 text-slate-300">
                                    {stats.accuracy >= 90 &&
                                        "Excellent performance. You consistently identified suspicious patterns and made strong classification decisions."}
                                    {stats.accuracy >= 75 &&
                                        stats.accuracy < 90 &&
                                        "Strong performance overall. You are catching most phishing attempts, but there is still room to improve precision on more subtle emails."}
                                    {stats.accuracy >= 50 &&
                                        stats.accuracy < 75 &&
                                        "Good foundation. You can identify many obvious phishing attempts, but some legitimate and borderline scenarios still need closer analysis."}
                                    {stats.accuracy < 50 &&
                                        "You are at the beginning of the learning curve. Focus on sender domains, urgent language, suspicious links, and credential requests."}
                                </p>
                            </PhishPanel>
                        </div>
                    )}
                </PhishLayout>
            </motion.div>
        </>
    );
}