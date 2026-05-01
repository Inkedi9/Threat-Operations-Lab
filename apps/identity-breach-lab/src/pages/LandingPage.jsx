import { ShieldAlert, Network, Play, Brain, Radar } from "lucide-react";

function Feature({ icon: Icon, title, desc }) {
    return (
        <div className="rounded-2xl border border-line/70 bg-black/30 p-5 hover:border-danger/20 transition">
            <Icon className="text-danger" size={22} />
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-6">{desc}</p>
        </div>
    );
}

export default function LandingPage({ onEnter }) {
    return (
        <div className="min-h-screen bg-[#050507] text-white px-6 py-12">
            {/* HERO */}
            <div className="max-w-6xl mx-auto text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-danger">
                    Identity Breach Lab
                </p>

                <h1 className="mt-6 text-5xl font-bold leading-tight">
                    Visualize Identity Attacks <br /> Like an Attacker
                </h1>

                <p className="mt-6 text-zinc-400 max-w-2xl mx-auto leading-7">
                    Simulate credential abuse, privilege escalation and lateral movement
                    across enterprise environments with a real-time interactive graph engine.
                </p>

                <button
                    onClick={onEnter}
                    className="mt-10 px-6 py-3 rounded-xl bg-danger text-white font-semibold hover:bg-red-600 transition shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                    Launch Simulator
                </button>
            </div>

            {/* FEATURES */}
            <div className="max-w-6xl mx-auto mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <Feature
                    icon={Network}
                    title="Interactive Graph"
                    desc="Explore identity relationships, attack paths and crown jewels in real time."
                />
                <Feature
                    icon={Play}
                    title="Attack Replay"
                    desc="Replay attack chains step-by-step with synchronized graph focus."
                />
                <Feature
                    icon={ShieldAlert}
                    title="Scenario Engine"
                    desc="Launch chained attack scenarios aligned with MITRE ATT&CK."
                />
                <Feature
                    icon={Brain}
                    title="Attack Intelligence"
                    desc="Analyze risk evolution and offensive path scoring."
                />
                <Feature
                    icon={Radar}
                    title="Story Mode"
                    desc="Understand attacks through narrative storytelling and debrief."
                />
            </div>

            {/* CTA */}
            <div className="max-w-4xl mx-auto mt-24 text-center">
                <h2 className="text-3xl font-bold">
                    Built for Security Engineers & Builders
                </h2>

                <p className="mt-4 text-zinc-400">
                    This project demonstrates modern identity attack modeling,
                    graph-based security analysis and advanced frontend architecture.
                </p>
            </div>
        </div>
    );
}