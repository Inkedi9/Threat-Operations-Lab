import Header from "../components/Header";
import { PhishLayout } from "@/components/ui/PhishLayout";
import { PhishHeader } from "@/components/ui/PhishHeader";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishBadge } from "@/components/ui/PhishBadge";

export default function About() {
    return (
        <>
            <Header />

            <PhishLayout>
                <PhishHeader
                    eyebrow="CyberOps Ecosystem"
                    title="About PhishScope"
                    description="Interactive phishing detection simulator designed to train human-layer defense and integrate with SOC and Purple Team workflows."
                >
                    <PhishBadge tone="teal">Training Platform</PhishBadge>
                    <PhishBadge tone="green">Human Layer</PhishBadge>
                    <PhishBadge tone="slate">Detection Ready</PhishBadge>
                </PhishHeader>

                <div className="mt-8 space-y-6">

                    {/* INTRO */}
                    <PhishPanel>
                        <p className="leading-8 text-slate-300">
                            PhishScope is a phishing detection training simulator built to
                            improve user awareness and analyst decision-making through
                            realistic email scenarios, scoring logic, and guided feedback.
                        </p>
                    </PhishPanel>

                    {/* GOALS */}
                    <PhishPanel variant="card">
                        <h2 className="text-2xl font-black text-white">Project Goals</h2>

                        <ul className="mt-4 space-y-3 text-slate-300">
                            <li>• Train users to identify phishing indicators and red flags</li>
                            <li>• Simulate real-world inbox investigation workflows</li>
                            <li>• Improve decision-making under uncertainty</li>
                            <li>• Bridge human detection with SOC alert pipelines</li>
                        </ul>
                    </PhishPanel>

                    {/* FEATURES */}
                    <PhishPanel variant="card">
                        <h2 className="text-2xl font-black text-white">Core Features</h2>

                        <ul className="mt-4 space-y-3 text-slate-300">
                            <li>• Interactive phishing scenarios with realistic email content</li>
                            <li>• Red flag analysis (domain, links, tone, intent)</li>
                            <li>• Scoring engine with accuracy and detection metrics</li>
                            <li>• Analyst-style decision workflow (Legitimate / Suspicious / Phishing)</li>
                            <li>• Results dashboard with performance breakdown</li>
                        </ul>
                    </PhishPanel>

                    {/* ECOSYSTEM */}
                    <PhishPanel variant="glow">
                        <h2 className="text-2xl font-black text-white">CyberOps Integration</h2>

                        <p className="mt-4 text-slate-300 leading-8">
                            PhishScope is part of a broader CyberOps ecosystem including:
                        </p>

                        <ul className="mt-4 space-y-3 text-slate-300">
                            <li>• SOC Simulator (alert triage & attack correlation)</li>
                            <li>• Purple Team Lab (offensive / defensive validation)</li>
                            <li>• Attack Story & MITRE mapping workflows</li>
                        </ul>

                        <p className="mt-4 text-sm text-slate-400">
                            → Confirmed phishing detections can be forwarded into the SOC to simulate real incident response pipelines.
                        </p>
                    </PhishPanel>

                    {/* VISION */}
                    <PhishPanel>
                        <h2 className="text-2xl font-black text-white">Vision</h2>

                        <p className="mt-4 leading-8 text-slate-300">
                            The goal of PhishScope is to connect human-layer detection with
                            technical security operations, creating a unified training
                            experience that mirrors real-world cyber defense environments.
                        </p>
                    </PhishPanel>

                </div>
            </PhishLayout>
        </>
    );
}