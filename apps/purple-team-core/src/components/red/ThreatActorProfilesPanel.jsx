import { useMemo, useState } from "react";
import {
    Globe,
    ShieldAlert,
    Radar,
    BriefcaseBusiness,
    Sparkles,
    Crosshair,
    FolderKanban,
    BookOpenText,
} from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";

/* ========================================
   🎭 Threat Actor Profiles Panel
======================================== */

const threatActors = [
    {
        id: "apt28",
        name: "APT28",
        alias: "Fancy Bear",
        emblem: "A28",
        tone: "violet",
        origin: "Russia",
        sponsor: "GRU / Russian military intelligence",
        summary:
            "APT28 is widely reported as a highly capable threat group associated with Russian military intelligence interests, frequently linked to espionage-driven campaigns.",
        sectors: ["Government", "Defense", "Think Tanks", "NATO-aligned organizations"],
        sophistication: "High",
        objectives: ["Espionage", "Credential access", "Strategic intelligence collection"],
        ttps: [
            { id: "T1110", name: "Brute Force" },
            { id: "T1003", name: "OS Credential Dumping" },
            { id: "T1071", name: "Application Layer Protocol" },
            { id: "T1041", name: "Exfiltration Over C2 Channel" },
        ],
        campaigns: [
            {
                title: "Credential Access and Espionage Operations",
                description:
                    "Known for targeting high-value accounts and internal systems to collect strategic intelligence and maintain persistence.",
            },
            {
                title: "Government and Policy Intrusions",
                description:
                    "Frequently associated with campaigns focused on institutions, diplomacy, and policy-related targets.",
            },
        ],
        scenarios: ["bruteforce", "mimikatz", "exfiltration"],
    },
    {
        id: "lazarus",
        name: "Lazarus Group",
        alias: "Hidden Cobra",
        emblem: "LZR",
        tone: "amber",
        origin: "North Korea",
        sponsor: "North Korean state interests",
        summary:
            "Lazarus Group is commonly attributed to North Korean state interests and is frequently discussed in relation to both espionage and financially motivated cyber operations.",
        sectors: ["Finance", "Crypto", "Government", "Critical Infrastructure"],
        sophistication: "High",
        objectives: ["Financial gain", "Espionage", "Disruption"],
        ttps: [
            { id: "T1566", name: "Phishing" },
            { id: "T1003", name: "OS Credential Dumping" },
            { id: "T1027", name: "Obfuscated Files or Information" },
            { id: "T1048", name: "Exfiltration Over Alternative Protocol" },
        ],
        campaigns: [
            {
                title: "Financially Motivated Intrusions",
                description:
                    "Associated with operations targeting financial institutions and digital asset ecosystems for monetary gain.",
            },
            {
                title: "Multi-Stage Intrusion Chains",
                description:
                    "Often linked to campaigns combining initial access, credential theft, lateral movement, and exfiltration.",
            },
        ],
        scenarios: ["mimikatz", "exfiltration"],
    },
    {
        id: "apt41",
        name: "APT41",
        alias: "Barium / Winnti-linked reporting",
        emblem: "A41",
        tone: "red",
        origin: "China",
        sponsor: "Widely reported as China-linked",
        summary:
            "APT41 is widely reported as a China-linked threat group notable for blending espionage objectives with financially motivated activity in some reporting.",
        sectors: ["Healthcare", "Telecom", "Software", "Gaming", "Government"],
        sophistication: "High",
        objectives: ["Espionage", "Intellectual property theft", "Mixed financial activity"],
        ttps: [
            { id: "T1190", name: "Exploit Public-Facing Application" },
            { id: "T1003", name: "OS Credential Dumping" },
            { id: "T1078", name: "Valid Accounts" },
            { id: "T1041", name: "Exfiltration Over C2 Channel" },
        ],
        campaigns: [
            {
                title: "Enterprise Intrusion and Persistence",
                description:
                    "Known for long-running intrusions where persistence and credential access are central to the operation.",
            },
            {
                title: "Hybrid Espionage / Financial Activity",
                description:
                    "Frequently discussed as a group whose activity spans both strategic objectives and financially motivated outcomes.",
            },
        ],
        scenarios: ["scan", "mimikatz", "exfiltration"],
    },
];

/* ========================================
   🎨 Tone System
======================================== */

function actorToneClasses(tone) {
    if (tone === "red") {
        return {
            panelVariant: "threat",
            accentText: "text-cyber-red",
            accentBorder: "border-cyber-red/30",
            accentSoftBorder: "border-cyber-red/20",
            accentBg: "bg-cyber-red/10",
            accentSoftBg: "bg-cyber-red/8",
            accentButton: "border-cyber-red/30 bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/15",
            accentBadge: "border-cyber-red/30 bg-cyber-red/10 text-cyber-red",
            accentGhost: "border-cyber-red/15 bg-[linear-gradient(180deg,rgba(56,10,14,0.20),rgba(12,8,10,0.72))]",
            accentGlow: "shadow-[0_0_24px_rgba(239,68,68,0.12)]",
        };
    }

    if (tone === "amber") {
        return {
            panelVariant: "signal",
            accentText: "text-cyber-amber",
            accentBorder: "border-cyber-amber/30",
            accentSoftBorder: "border-cyber-amber/20",
            accentBg: "bg-cyber-amber/10",
            accentSoftBg: "bg-cyber-amber/8",
            accentButton: "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber hover:bg-cyber-amber/15",
            accentBadge: "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber",
            accentGhost: "border-cyber-amber/15 bg-[linear-gradient(180deg,rgba(82,52,8,0.18),rgba(18,12,8,0.72))]",
            accentGlow: "shadow-[0_0_24px_rgba(245,158,11,0.10)]",
        };
    }

    return {
        panelVariant: "intel",
        accentText: "text-cyber-violet",
        accentBorder: "border-cyber-violet/30",
        accentSoftBorder: "border-cyber-violet/20",
        accentBg: "bg-cyber-violet/10",
        accentSoftBg: "bg-cyber-violet/8",
        accentButton: "border-cyber-violet/30 bg-cyber-violet/10 text-cyber-violet hover:bg-cyber-violet/15",
        accentBadge: "border-cyber-violet/30 bg-cyber-violet/10 text-cyber-violet",
        accentGhost: "border-cyber-violet/15 bg-[linear-gradient(180deg,rgba(40,18,72,0.20),rgba(12,10,20,0.72))]",
        accentGlow: "shadow-[0_0_24px_rgba(139,92,246,0.12)]",
    };
}

/* ========================================
   🧠 Component
======================================== */

export default function ThreatActorProfilesPanel({
    scenarios = [],
    mode,
    setMode,
    setSelectedScenarioId,
    campaignScenarioIds = [],
    toggleCampaignScenarioId,
}) {
    const [selectedActorId, setSelectedActorId] = useState(threatActors[0].id);
    const [activeTab, setActiveTab] = useState("overview");

    const actor = useMemo(() => {
        return threatActors.find((item) => item.id === selectedActorId) ?? threatActors[0];
    }, [selectedActorId]);

    const tone = actorToneClasses(actor.tone);

    const mappedScenarios = useMemo(() => {
        return scenarios.filter((scenario) => actor.scenarios.includes(scenario.id));
    }, [actor, scenarios]);

    const applyThreatProfile = () => {
        if (!mappedScenarios.length) return;

        if (mode === "single") {
            setSelectedScenarioId(mappedScenarios[0].id);
            return;
        }

        const actorScenarioIds = mappedScenarios.map((scenario) => scenario.id);

        actorScenarioIds.forEach((scenarioId) => {
            if (!campaignScenarioIds.includes(scenarioId)) {
                toggleCampaignScenarioId(scenarioId);
            }
        });
    };

    return (
        <PanelCard variant="elevated">
            <PanelHeader
                icon={<ShieldAlert className="h-5 w-5 text-cyber-violet" />}
                title="Threat Actor Profiles"
                subtitle="Adversary context for red emulation and purple validation"
            />

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
                {/* ========================================
                   🎭 Actor Selector
                ======================================== */}
                <div className="space-y-3">
                    {threatActors.map((item) => {
                        const active = item.id === selectedActorId;
                        const itemTone = actorToneClasses(item.tone);

                        return (
                            <button
                                key={item.id}
                                onClick={() => setSelectedActorId(item.id)}
                                className={[
                                    "w-full rounded-xl border p-3 text-left transition-all duration-200",
                                    active
                                        ? `${itemTone.accentBorder} ${itemTone.accentBg} ${itemTone.accentGlow}`
                                        : "border-cyber-border bg-cyber-panel2 hover:border-cyber-violet/20 hover:bg-cyber-panel",
                                ].join(" ")}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={[
                                            "flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold",
                                            active
                                                ? `${itemTone.accentBorder} ${itemTone.accentBg} ${itemTone.accentText}`
                                                : "border-cyber-border bg-cyber-bgSoft text-cyber-muted",
                                        ].join(" ")}
                                    >
                                        {item.emblem}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-cyber-text">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-cyber-muted">
                                            {item.alias}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ========================================
                   🧠 Actor Detail
                ======================================== */}
                <div className="space-y-4">
                    <PanelCard
                        variant={tone.panelVariant}
                        glow
                        hotLevel="low"
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div className="flex min-w-0 gap-4">
                                <div
                                    className={[
                                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border text-base font-bold",
                                        `${tone.accentBorder} ${tone.accentBg} ${tone.accentText}`,
                                    ].join(" ")}
                                >
                                    {actor.emblem}
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-lg font-semibold text-cyber-text">
                                            {actor.name}
                                        </p>
                                        <span className="rounded-lg border border-cyber-border bg-black/10 px-2 py-1 text-[11px] text-cyber-muted">
                                            {actor.alias}
                                        </span>
                                        <span
                                            className={`rounded-lg border px-2 py-1 text-[11px] font-medium ${tone.accentBadge}`}
                                        >
                                            {actor.sophistication}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm leading-7 text-cyber-text/95">
                                        {actor.summary}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={applyThreatProfile}
                                disabled={!mappedScenarios.length}
                                className={[
                                    "rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
                                    tone.accentButton,
                                ].join(" ")}
                            >
                                Use Profile
                            </button>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <MiniToneCard
                                icon={<Globe className="h-4 w-4 text-cyber-blue" />}
                                label="Origin"
                                value={actor.origin}
                                tone={tone}
                            />
                            <MiniToneCard
                                icon={<BriefcaseBusiness className="h-4 w-4 text-cyber-amber" />}
                                label="Sponsor"
                                value={actor.sponsor}
                                tone={tone}
                            />
                        </div>
                    </PanelCard>

                    {/* ========================================
                       🗂️ Tabs
                    ======================================== */}
                    <div className="flex items-center gap-2 rounded-xl border border-cyber-border bg-cyber-panel2 p-1">
                        {[
                            { id: "overview", label: "overview" },
                            { id: "ttps", label: "ttps" },
                            { id: "campaigns", label: "campaigns" },
                        ].map((tab) => {
                            const active = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={[
                                        "rounded-lg px-3 py-2 text-xs font-medium capitalize transition",
                                        active
                                            ? `${tone.accentBg} ${tone.accentText}`
                                            : "text-cyber-muted hover:text-white",
                                    ].join(" ")}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* ========================================
                       📄 Content
                    ======================================== */}
                    {activeTab === "overview" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <MiniToneCard
                                    icon={<Sparkles className={`h-4 w-4 ${tone.accentText}`} />}
                                    label="Sophistication"
                                    value={actor.sophistication}
                                    tone={tone}
                                />
                                <MiniToneCard
                                    icon={<Crosshair className={`h-4 w-4 ${tone.accentText}`} />}
                                    label="Primary Objectives"
                                    value={actor.objectives.join(", ")}
                                    tone={tone}
                                />
                                <MiniToneCard
                                    icon={<Globe className={`h-4 w-4 ${tone.accentText}`} />}
                                    label="Target Sectors"
                                    value={actor.sectors.join(", ")}
                                    tone={tone}
                                />
                            </div>

                            <PanelCard variant={tone.panelVariant} dense>
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className={`h-4 w-4 ${tone.accentText}`} />
                                    <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">
                                        Related Lab Scenarios
                                    </p>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {mappedScenarios.length > 0 ? (
                                        mappedScenarios.map((scenario) => (
                                            <span
                                                key={scenario.id}
                                                className={`rounded-lg border px-3 py-1 text-xs font-medium ${tone.accentBadge}`}
                                            >
                                                {scenario.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-cyber-muted">
                                            No related lab scenarios mapped yet.
                                        </span>
                                    )}
                                </div>
                            </PanelCard>

                            <PanelCard variant="signal">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <FolderKanban className={`h-4 w-4 ${tone.accentText}`} />
                                            <p className="text-[11px] uppercase tracking-[0.22em] text-cyber-muted">
                                                Suggested Scenario Mapping
                                            </p>
                                        </div>

                                        <p className="mt-2 text-sm text-cyber-muted">
                                            Apply this actor profile to the current lab setup.
                                        </p>
                                        <p className="mt-1 text-xs text-cyber-muted">
                                            Current apply mode: {mode === "campaign" ? "Campaign selection" : "Single scenario selection"}
                                        </p>
                                    </div>

                                    <button
                                        onClick={applyThreatProfile}
                                        disabled={!mappedScenarios.length}
                                        className={[
                                            "rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
                                            tone.accentButton,
                                        ].join(" ")}
                                    >
                                        Use Profile
                                    </button>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {mappedScenarios.map((scenario) => (
                                        <div
                                            key={scenario.id}
                                            className={[
                                                "flex items-center justify-between gap-3 rounded-xl border px-3 py-3",
                                                `${tone.accentSoftBorder} ${tone.accentSoftBg}`,
                                            ].join(" ")}
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-cyber-text">
                                                    {scenario.name}
                                                </p>
                                                <p className="text-xs text-cyber-muted">
                                                    {scenario.technique}
                                                </p>
                                            </div>

                                            <span className={`rounded-lg border px-2 py-1 text-[11px] font-medium ${tone.accentBadge}`}>
                                                suggested
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </PanelCard>
                        </div>
                    )}

                    {activeTab === "ttps" && (
                        <div className="space-y-3">
                            {actor.ttps.map((ttp) => (
                                <PanelCard
                                    key={ttp.id}
                                    variant={tone.panelVariant}
                                    dense
                                    hotLevel="low"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-cyber-text">
                                                {ttp.name}
                                            </p>
                                            <p className="mt-1 text-xs text-cyber-muted">
                                                MITRE ATT&CK {ttp.id}
                                            </p>
                                        </div>

                                        <Radar className={`h-4 w-4 ${tone.accentText}`} />
                                    </div>
                                </PanelCard>
                            ))}
                        </div>
                    )}

                    {activeTab === "campaigns" && (
                        <div className="space-y-3">
                            {actor.campaigns.map((campaign, index) => (
                                <PanelCard
                                    key={index}
                                    variant={tone.panelVariant}
                                    dense
                                >
                                    <div className="flex items-center gap-2">
                                        <BookOpenText className={`h-4 w-4 ${tone.accentText}`} />
                                        <p className="text-sm font-semibold text-cyber-text">
                                            {campaign.title}
                                        </p>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-cyber-muted">
                                        {campaign.description}
                                    </p>
                                </PanelCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PanelCard>
    );
}

/* ========================================
   🧩 UI Helpers
======================================== */

function MiniToneCard({ icon, label, value, tone }) {
    return (
        <div
            className={[
                "rounded-xl border px-4 py-3",
                `${tone.accentSoftBorder} ${tone.accentSoftBg}`,
            ].join(" ")}
        >
            <div className="mb-2 flex items-center gap-2">
                {icon}
                <span className="text-[11px] uppercase tracking-[0.2em] text-cyber-muted">
                    {label}
                </span>
            </div>

            <p className="text-sm font-semibold leading-6 text-cyber-text break-words">
                {value}
            </p>
        </div>
    );
}