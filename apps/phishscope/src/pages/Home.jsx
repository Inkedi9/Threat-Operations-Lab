import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, MailWarning, ShieldCheck } from "lucide-react";
import Header from "../components/Header";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishHeader } from "@/components/ui/PhishHeader";
import { PhishBadge } from "@/components/ui/PhishBadge";
import { PhishButton } from "@/components/ui/PhishButton";

export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const incidentId = params.get("incident");

        if (incidentId) {
            navigate(`/simulator${location.search}`, { replace: true });
        }
    }, [location.search, navigate]);

    return (
        <>
            <Header />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <PhishHeader
                            eyebrow="CyberOps Ecosystem"
                            title="PhishScope"
                            description="Interactive phishing detection and analyst decision training platform. Analyze realistic emails, identify red flags and connect human-layer attacks to SOC workflows."
                        >
                            <PhishBadge tone="cyan">Human Layer</PhishBadge>
                            <PhishBadge tone="slate">Training Mode</PhishBadge>
                            <PhishBadge tone="green">Detection Ready</PhishBadge>
                        </PhishHeader>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link to="/simulator">
                                <PhishButton tone="cyan">
                                    Start Simulation
                                    <ArrowRight className="h-4 w-4" />
                                </PhishButton>
                            </Link>

                            <Link to="/about">
                                <PhishButton tone="slate">Learn More</PhishButton>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        <PhishPanel className="p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                                        Email Threat Lab
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black text-white">
                                        Classify. Investigate. Learn.
                                    </h2>
                                </div>

                                <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-3 text-cyan-300">
                                    <MailWarning className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <ScenarioCard
                                    icon={MailWarning}
                                    label="High-Risk Email"
                                    title="Unusual sign-in attempt detected"
                                    tone="red"
                                />

                                <ScenarioCard
                                    icon={ShieldCheck}
                                    label="Legitimate Email"
                                    title="Reminder: onboarding meeting tomorrow"
                                    tone="green"
                                />

                                <ScenarioCard
                                    icon={Brain}
                                    label="Analyst Decision"
                                    title="Spot red flags, classify intent and validate risk."
                                    tone="amber"
                                />
                            </div>
                        </PhishPanel>
                    </motion.div>
                </section>
            </main>
        </>
    );
}

function ScenarioCard({ icon: Icon, label, title, tone = "cyan" }) {
    const tones = {
        red: "border-red-500/30 bg-red-500/10 text-red-300",
        green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="mt-2 text-sm font-bold text-white">{title}</p>
                </div>

                <Icon className="h-5 w-5" />
            </div>
        </div>
    );
}