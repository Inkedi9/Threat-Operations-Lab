import { useEffect, useMemo, useState } from "react";
import {
    Shield,
    Server,
    Database,
    UserCog,
    Laptop,
    Wifi,
    Crosshair,
    AlertTriangle,
    Eye,
} from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";

/* ========================================
   🌐 Network Topology Map
======================================== */

export default function NetworkMap({
    events = [],
    selectedScenario = null,
    selectedCampaignScenarios = [],
    mode = "single",
    activeKillChainStepId = "recon",
    selectedKillChainStepId = "recon",
}) {
    const latest = events[events.length - 1] ?? null;

    const nodes = useMemo(
        () => [
            {
                id: "attacker",
                label: "Attacker",
                short: "EXT",
                x: 54,
                y: 140,
                icon: <Crosshair className="h-4 w-4" />,
                role: "External hostile source",
                details:
                    "Represents the adversary entry point used to start scanning, exploitation or staged activity.",
            },
            {
                id: "firewall",
                label: "Firewall",
                short: "FW",
                x: 208,
                y: 140,
                icon: <Shield className="h-4 w-4" />,
                role: "Traffic control boundary",
                details:
                    "Ingress and egress checkpoint used to inspect, allow or block suspicious flows.",
            },
            {
                id: "server",
                label: "App Server",
                short: "APP",
                x: 410,
                y: 84,
                icon: <Server className="h-4 w-4" />,
                role: "Primary exposed workload",
                details:
                    "Main application service where telemetry, login attempts and suspicious process activity may surface.",
            },
            {
                id: "db",
                label: "Database",
                short: "DB",
                x: 410,
                y: 206,
                icon: <Database className="h-4 w-4" />,
                role: "Sensitive data store",
                details:
                    "Backend persistence layer where access, staging or exfiltration paths may become high-risk.",
            },
            {
                id: "admin",
                label: "Admin Account",
                short: "ADM",
                x: 300,
                y: 44,
                icon: <UserCog className="h-4 w-4" />,
                role: "Privileged identity",
                details:
                    "High-value identity target often associated with brute force, privilege abuse or credential dumping.",
            },
            {
                id: "workstation",
                label: "User Workstation",
                short: "WS",
                x: 300,
                y: 236,
                icon: <Laptop className="h-4 w-4" />,
                role: "Internal endpoint",
                details:
                    "User endpoint used for lateral movement, staging, memory access or archive generation activity.",
            },
        ],
        []
    );

    const edges = [
        { from: "attacker", to: "firewall" },
        { from: "firewall", to: "server" },
        { from: "firewall", to: "workstation" },
        { from: "server", to: "db" },
        { from: "admin", to: "server" },
        { from: "workstation", to: "server" },
    ];

    const activeScenarios = useMemo(() => {
        if (
            mode === "campaign" &&
            Array.isArray(selectedCampaignScenarios) &&
            selectedCampaignScenarios.length > 0
        ) {
            return selectedCampaignScenarios.filter(Boolean);
        }

        return selectedScenario ? [selectedScenario] : [];
    }, [mode, selectedCampaignScenarios, selectedScenario]);

    const scenarioProfile = useMemo(() => {
        return buildScenarioTopologyProfile(activeScenarios, mode);
    }, [activeScenarios, mode]);

    const syncedFocusNodes = useMemo(() => {
        const killChainNodes = getKillChainFocusNodes(activeKillChainStepId);
        return Array.from(new Set([...(scenarioProfile.focusNodes ?? []), ...killChainNodes]));
    }, [scenarioProfile.focusNodes, activeKillChainStepId]);

    const preferredNodeId = useMemo(() => {
        const explicitStepNode = getKillChainPrimaryNode(selectedKillChainStepId);
        const activeStepNode = getKillChainPrimaryNode(activeKillChainStepId);

        return (
            explicitStepNode ||
            activeStepNode ||
            scenarioProfile.primaryNodeId ||
            "server"
        );
    }, [
        selectedKillChainStepId,
        activeKillChainStepId,
        scenarioProfile.primaryNodeId,
    ]);

    const [selectedNodeId, setSelectedNodeId] = useState(preferredNodeId);

    useEffect(() => {
        setSelectedNodeId(preferredNodeId);
    }, [preferredNodeId]);

    const selectedNode =
        nodes.find((node) => node.id === selectedNodeId) ?? nodes[0];

    const nodeStates = useMemo(() => {
        return nodes.reduce((acc, node) => {
            acc[node.id] = getNodeState(node.id, latest, syncedFocusNodes);
            return acc;
        }, {});
    }, [latest, nodes, syncedFocusNodes]);

    const selectedNodeState = nodeStates[selectedNode.id];

    const relatedSignals = buildNodeSignals(
        selectedNode,
        latest,
        events,
        activeScenarios,
        syncedFocusNodes,
        mode,
        activeKillChainStepId
    );

    return (
        <PanelCard variant="signal">
            <PanelHeader
                icon={<Wifi className="h-5 w-5 text-cyber-blue" />}
                title="Network Topology"
                subtitle="Visual attack propagation across infrastructure"
            />

            <div className="mt-4">
                <PanelCard
                    variant="signal"
                    padded={false}
                    className="relative overflow-hidden"
                    live={Boolean(latest)}
                    hotLevel={latest ? "low" : "none"}
                >
                    <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(139,92,246,0.14) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)
                                `,
                                backgroundSize: "28px 28px",
                            }}
                        />
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_55%)]" />

                    {latest?.type === "attack" && (
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(239,68,68,0.14),transparent)] animate-[topologyScan_2.4s_linear_infinite]" />
                        </div>
                    )}

                    <div className="relative h-[360px]">
                        <svg className="absolute inset-0 h-full w-full">
                            {edges.map((edge, index) => {
                                const from = nodes.find((node) => node.id === edge.from);
                                const to = nodes.find((node) => node.id === edge.to);

                                const isScenarioPath =
                                    syncedFocusNodes.includes(edge.from) &&
                                    syncedFocusNodes.includes(edge.to);

                                const isActive =
                                    nodeStates[edge.from] === "attack" ||
                                    nodeStates[edge.to] === "attack";

                                const isDetected =
                                    nodeStates[edge.from] === "detected" ||
                                    nodeStates[edge.to] === "detected";

                                return (
                                    <line
                                        key={`${edge.from}-${edge.to}-${index}`}
                                        x1={from.x}
                                        y1={from.y}
                                        x2={to.x}
                                        y2={to.y}
                                        stroke={
                                            isActive
                                                ? "#ef4444"
                                                : isDetected
                                                    ? "#22c55e"
                                                    : isScenarioPath
                                                        ? "#8b5cf6"
                                                        : "#334155"
                                        }
                                        strokeOpacity={
                                            isActive || isDetected || isScenarioPath ? 0.9 : 0.5
                                        }
                                        strokeWidth={isScenarioPath ? 2.5 : 2}
                                        strokeDasharray={isActive ? "5 5" : "0"}
                                        className={isActive ? "animate-pulse" : ""}
                                    />
                                );
                            })}
                        </svg>

                        {nodes.map((node) => {
                            const state = nodeStates[node.id];
                            const isSelected = selectedNodeId === node.id;
                            const isFocused = syncedFocusNodes.includes(node.id);
                            const isPrimaryFocus = preferredNodeId === node.id;

                            return (
                                <button
                                    key={node.id}
                                    type="button"
                                    onClick={() => setSelectedNodeId(node.id)}
                                    style={{ left: node.x, top: node.y }}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                                >
                                    <div
                                        className={[
                                            "min-w-[112px] rounded-md border px-3 py-3 transition-all duration-200 backdrop-blur-[2px]",
                                            getNodeClasses(state, isSelected, isFocused, isPrimaryFocus),
                                        ].join(" ")}
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <span className="text-[10px] uppercase tracking-[0.22em] text-cyber-muted">
                                                {node.short}
                                            </span>

                                            <div
                                                className={[
                                                    "rounded-md border p-1.5",
                                                    state === "attack"
                                                        ? "border-cyber-red/30 bg-cyber-red/10 text-cyber-red"
                                                        : state === "detected"
                                                            ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
                                                            : isFocused
                                                                ? "border-cyber-violet/30 bg-cyber-violet/10 text-cyber-violet"
                                                                : "border-cyber-border bg-cyber-panel2 text-cyber-muted",
                                                ].join(" ")}
                                            >
                                                {node.icon}
                                            </div>
                                        </div>

                                        <p className="text-sm font-semibold text-cyber-text">
                                            {node.label}
                                        </p>
                                        <p className="mt-1 text-xs text-cyber-muted">
                                            {getNodeStatusLabel(state, isFocused, isPrimaryFocus)}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </PanelCard>
            </div>

            <div className="mt-4">
                <PanelCard
                    variant={getDetailPanelVariant(selectedNodeState)}
                    className="p-5"
                    live={selectedNodeState === "attack" || selectedNodeState === "detected"}
                    stress={selectedNodeState === "attack" || activeKillChainStepId === selectedKillChainStepId}
                    scan={selectedNodeState === "attack"}
                    hotLevel={
                        selectedNodeState === "attack"
                            ? "high"
                            : selectedNodeState === "detected" || activeKillChainStepId === selectedKillChainStepId
                                ? "medium"
                                : "low"
                    }
                >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-[0.24em] text-cyber-muted">
                                Selected Node
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-cyber-text">
                                {selectedNode.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-cyber-muted">
                                {selectedNode.role}
                            </p>
                        </div>

                        <NodeStatusBadge state={selectedNodeState} />
                    </div>

                    <div className="mt-5">
                        <PanelCard
                            variant="signal"
                            dense
                            live={selectedNodeState !== "idle"}
                            hotLevel={selectedNodeState === "idle" ? "none" : "low"}
                        >
                            <p className="text-sm leading-7 text-cyber-text">
                                {buildNodeNarrative(selectedNode, activeScenarios, syncedFocusNodes, mode)}
                            </p>
                        </PanelCard>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <DetailBlock
                            variant="threat"
                            title="Observed Signal"
                            items={relatedSignals.observed}
                        />

                        <DetailBlock
                            variant="defense"
                            title="Detection / Visibility"
                            items={relatedSignals.visibility}
                        />

                        <DetailBlock
                            variant="intel"
                            title="Operational Notes"
                            items={relatedSignals.notes}
                        />

                        <DetailBlock
                            variant="signal"
                            title="Scenario Context"
                            items={relatedSignals.lastEvent}
                        />
                    </div>
                </PanelCard>
            </div>

            <style>{`
                @keyframes topologyScan {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(520%); }
                }
            `}</style>
        </PanelCard>
    );
}

/* ========================================
   🧩 Node UI
======================================== */

function getNodeClasses(state, isSelected, isFocused, isPrimaryFocus) {
    const ring = isSelected
        ? "ring-1 ring-white/10 scale-[1.02] shadow-[0_0_18px_rgba(255,255,255,0.04)]"
        : "";

    const focus = isFocused
        ? "shadow-[0_0_18px_rgba(139,92,246,0.10)]"
        : "";

    const primaryFocus = isPrimaryFocus
        ? "ring-1 ring-cyber-violet/20 shadow-[0_0_24px_rgba(139,92,246,0.14)]"
        : "";

    if (state === "attack") {
        return `border-cyber-red/40 bg-[linear-gradient(180deg,rgba(56,10,14,0.30),rgba(12,8,10,0.92))] text-cyber-red shadow-[0_0_26px_rgba(239,68,68,0.18)] ${ring} ${primaryFocus}`;
    }

    if (state === "detected") {
        return `border-cyber-green/40 bg-[linear-gradient(180deg,rgba(8,40,24,0.26),rgba(8,12,10,0.92))] text-cyber-green shadow-[0_0_24px_rgba(34,197,94,0.16)] ${ring} ${primaryFocus}`;
    }

    if (isFocused) {
        return `border-cyber-violet/30 bg-[linear-gradient(180deg,rgba(28,16,54,0.24),rgba(10,8,18,0.92))] hover:bg-cyber-violet/15 ${ring} ${focus} ${primaryFocus}`;
    }

    return `border-cyber-border bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(10,14,24,0.96))] hover:border-cyber-blue/20 ${ring}`;
}

function getNodeStatusLabel(state, isFocused, isPrimaryFocus) {
    if (state === "attack") return "Under pressure";
    if (state === "detected") return "Observed";
    if (isPrimaryFocus) return "Stage focal node";
    if (isFocused) return "Scenario focus";
    return "Idle";
}

function NodeStatusBadge({ state }) {
    const classes =
        state === "attack"
            ? "border-cyber-red/30 bg-cyber-red/10 text-cyber-red"
            : state === "detected"
                ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
                : "border-cyber-border bg-cyber-bgSoft text-cyber-muted";

    const label =
        state === "attack"
            ? "Active Attack Path"
            : state === "detected"
                ? "Detection Visible"
                : "Idle Node";

    const Icon =
        state === "attack"
            ? AlertTriangle
            : state === "detected"
                ? Eye
                : Shield;

    return (
        <span className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium ${classes}`}>
            <Icon className="h-4 w-4" />
            {label}
        </span>
    );
}

function DetailBlock({ variant, title, items = [] }) {
    return (
        <PanelCard
            variant={variant}
            dense
            hotLevel={variant === "threat" ? "medium" : variant === "defense" ? "low" : "none"}
        >
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyber-muted">
                {title}
            </p>

            <div className="mt-3 space-y-2">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div
                            key={item}
                            className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2 text-sm text-cyber-text"
                        >
                            {item}
                        </div>
                    ))
                ) : (
                    <div className="rounded-md border border-white/[0.06] bg-black/10 px-3 py-2 text-sm text-cyber-muted">
                        No related signal yet
                    </div>
                )}
            </div>
        </PanelCard>
    );
}

function getDetailPanelVariant(state) {
    if (state === "attack") return "hot";
    if (state === "detected") return "defense";
    return "signal";
}

/* ========================================
   🧠 Scenario-driven mapping
======================================== */

function buildScenarioTopologyProfile(activeScenarios, mode) {
    const base = {
        primaryNodeId: "server",
        focusNodes: ["firewall", "server"],
    };

    if (!Array.isArray(activeScenarios) || activeScenarios.length === 0) {
        return base;
    }

    if (mode !== "campaign" || activeScenarios.length === 1) {
        return buildSingleScenarioProfile(activeScenarios[0]);
    }

    const mergedNodes = new Set();
    let primaryNodeId = "server";

    activeScenarios.forEach((scenario, index) => {
        const profile = buildSingleScenarioProfile(scenario);
        profile.focusNodes.forEach((nodeId) => mergedNodes.add(nodeId));

        if (index === 0 && profile.primaryNodeId) {
            primaryNodeId = profile.primaryNodeId;
        }
    });

    return {
        primaryNodeId,
        focusNodes: Array.from(mergedNodes),
    };
}

function buildSingleScenarioProfile(selectedScenario) {
    const scenarioId = selectedScenario?.id;

    const base = {
        primaryNodeId: "server",
        focusNodes: ["firewall", "server"],
    };

    if (!scenarioId) return base;

    if (scenarioId === "bruteforce") {
        return {
            primaryNodeId: "admin",
            focusNodes: ["attacker", "firewall", "admin", "server"],
        };
    }

    if (scenarioId === "scan") {
        return {
            primaryNodeId: "firewall",
            focusNodes: ["attacker", "firewall", "server", "workstation"],
        };
    }

    if (scenarioId === "mimikatz") {
        return {
            primaryNodeId: "workstation",
            focusNodes: ["workstation", "admin", "server"],
        };
    }

    if (scenarioId === "exfiltration") {
        return {
            primaryNodeId: "db",
            focusNodes: ["server", "db", "firewall", "attacker"],
        };
    }

    return base;
}

function getNodeState(nodeId, latestEvent, focusNodes) {
    if (!latestEvent) {
        return "idle";
    }

    if (latestEvent.type === "attack") {
        if (focusNodes.includes(nodeId)) {
            return "attack";
        }
    }

    if (latestEvent.type === "alert") {
        if (["firewall", "server", "admin", "workstation"].includes(nodeId)) {
            return "detected";
        }
    }

    if (latestEvent.type === "purple") {
        if (focusNodes.includes(nodeId)) {
            return "detected";
        }
    }

    return "idle";
}

function buildNodeNarrative(selectedNode, activeScenarios, focusNodes, mode) {
    if (!activeScenarios.length) {
        return selectedNode.details;
    }

    const isFocusNode = focusNodes.includes(selectedNode.id);

    if (mode === "campaign" && activeScenarios.length > 1) {
        const names = activeScenarios.map((scenario) => scenario.name).join(", ");

        if (isFocusNode) {
            return `${selectedNode.label} is part of the multi-stage campaign path. Current campaign focus spans: ${names}. This node helps visualize how offensive pressure and defensive visibility expand across chained scenarios.`;
        }

        return `${selectedNode.details} This node is currently peripheral to the active campaign chain (${names}).`;
    }

    const selectedScenario = activeScenarios[0];

    if (isFocusNode) {
        return `${selectedNode.label} is part of the active path for ${selectedScenario.name}. ${selectedScenario.summary}`;
    }

    return `${selectedNode.details} This node is currently peripheral to the selected scenario (${selectedScenario.name}).`;
}

function buildNodeSignals(selectedNode, latestEvent, events, activeScenarios, focusNodes, mode, activeKillChainStepId) {
    const recentEvents = events.slice(-4);
    const isFocusNode = focusNodes.includes(selectedNode.id);

    const observed = buildObservedSignals(
        selectedNode,
        activeScenarios,
        recentEvents,
        isFocusNode,
        mode,
        activeKillChainStepId
    );

    const visibility = buildVisibilitySignals(
        selectedNode,
        latestEvent,
        activeScenarios,
        isFocusNode,
        mode,
        activeKillChainStepId
    );

    const notes = buildOperationalNotes(
        selectedNode,
        activeScenarios,
        isFocusNode,
        mode,
        activeKillChainStepId
    );

    const scenarioNames =
        activeScenarios.length > 0
            ? activeScenarios.map((scenario) => scenario.name).join(", ")
            : "Unknown";

    const techniques =
        activeScenarios.length > 0
            ? activeScenarios.map((scenario) => scenario.technique).filter(Boolean).join(", ")
            : "N/A";

    const stageLabel = getKillChainStepLabel(activeKillChainStepId);

    const lastEvent = latestEvent
        ? [
            `Scope — ${mode === "campaign" ? "Campaign" : "Single scenario"}`,
            `Active Stage — ${stageLabel}`,
            `Scenarios — ${scenarioNames}`,
            `Latest Event — ${latestEvent.title}`,
            `Techniques — ${techniques}`,
        ]
        : [
            `Scope — ${mode === "campaign" ? "Campaign" : "Single scenario"}`,
            `Active Stage — ${stageLabel}`,
            `Scenarios — ${scenarioNames}`,
            `Techniques — ${techniques}`,
            "No event has been streamed yet.",
        ];

    return {
        observed,
        visibility,
        notes,
        lastEvent,
    };
}

function buildObservedSignals(
    selectedNode,
    activeScenarios,
    recentEvents,
    isFocusNode,
    mode,
    activeKillChainStepId
) {
    if (!activeScenarios.length) return [];

    const eventSignals = recentEvents.map((event) => `${event.title} — ${event.message}`);
    const stepSignals = getKillChainStageObservations(selectedNode.id, activeKillChainStepId);

    if (mode === "campaign" && activeScenarios.length > 1) {
        const scenarioHints = activeScenarios.map(
            (scenario) => `${scenario.name} — ${scenario.technique}`
        );

        if (isFocusNode) {
            return [...stepSignals, ...scenarioHints.slice(0, 2), ...eventSignals.slice(0, 1)].slice(0, 4);
        }

        return ["Node currently has limited direct signal in the active campaign path."];
    }

    if (stepSignals.length > 0) {
        return [...stepSignals, ...eventSignals.slice(0, 2)].slice(0, 4);
    }

    const selectedScenario = activeScenarios[0];
    const scenarioId = selectedScenario.id;

    if (scenarioId === "bruteforce") {
        if (selectedNode.id === "admin") {
            return [
                "Repeated privileged login failures observed.",
                "Authentication threshold pressure against admin identity.",
                ...eventSignals.slice(0, 1),
            ];
        }

        if (selectedNode.id === "firewall") {
            return [
                "Inbound auth traffic concentration from repeated source attempts.",
                "Public-facing login path under pressure.",
            ];
        }
    }

    if (scenarioId === "scan") {
        if (selectedNode.id === "firewall") {
            return [
                "Reconnaissance SYN bursts crossing boundary controls.",
                "Horizontal scan visibility depends on correlation depth.",
            ];
        }

        if (selectedNode.id === "workstation") {
            return [
                "Internal subnet visibility is relevant for east-west scan coverage.",
                "Potential target host in discovery sweep.",
            ];
        }
    }

    if (scenarioId === "mimikatz") {
        if (selectedNode.id === "workstation") {
            return [
                "Suspicious memory access behavior originates from endpoint activity.",
                "Post-exploitation telemetry is concentrated on the workstation.",
            ];
        }

        if (selectedNode.id === "admin") {
            return [
                "Privileged identity exposure increases risk during credential dumping.",
                "Admin-linked access paths become high-value targets.",
            ];
        }
    }

    if (scenarioId === "exfiltration") {
        if (selectedNode.id === "db") {
            return [
                "Sensitive data store becomes relevant to staging and extraction.",
                "Data handling visibility is critical before outbound movement.",
            ];
        }

        if (selectedNode.id === "firewall") {
            return [
                "Outbound flow inspection is critical for transfer detection.",
                "Rare destination monitoring is relevant to exfiltration visibility.",
            ];
        }
    }

    if (isFocusNode) {
        return eventSignals.slice(0, 3);
    }

    return ["Node currently has limited direct signal in this scenario."];
}

function buildVisibilitySignals(
    selectedNode,
    latestEvent,
    activeScenarios,
    isFocusNode,
    mode,
    activeKillChainStepId
) {
    if (!activeScenarios.length) {
        return ["Awaiting scenario selection."];
    }

    const statuses = activeScenarios.map((scenario) => scenario.status).join(", ");
    const avgCoverage = Math.round(
        activeScenarios.reduce((sum, scenario) => sum + (scenario.coverage ?? 0), 0) /
        activeScenarios.length
    );

    const stageVisibility = getKillChainStageVisibility(selectedNode.id, activeKillChainStepId);

    if (stageVisibility.length > 0) {
        return stageVisibility;
    }

    if (latestEvent?.type === "alert" || latestEvent?.type === "purple") {
        return [
            "Detection signal is present in the current timeline.",
            `Scenario status trend: ${statuses}.`,
            isFocusNode
                ? "This node is part of the active validation path."
                : "This node is not central to the current validation path.",
        ];
    }

    if (latestEvent?.type === "attack") {
        return [
            "Attack pressure is active but visibility may still be forming.",
            isFocusNode
                ? "This node is exposed to the current scenario path."
                : "This node remains peripheral for now.",
            mode === "campaign"
                ? "Campaign path may shift visibility across multiple nodes."
                : "Single-scenario focus remains localized.",
        ];
    }

    return [
        `Average scenario coverage is ${avgCoverage}%.`,
        "No recent alert has updated node visibility yet.",
    ];
}

function buildOperationalNotes(
    selectedNode,
    activeScenarios,
    isFocusNode,
    mode,
    activeKillChainStepId
) {
    if (!activeScenarios.length) {
        return [selectedNode.details];
    }

    const recommendations = activeScenarios.flatMap((scenario) =>
        Array.isArray(scenario.recommendations) ? scenario.recommendations.slice(0, 1) : []
    );

    const gaps = activeScenarios.flatMap((scenario) =>
        Array.isArray(scenario.gaps) ? scenario.gaps.slice(0, 1) : []
    );

    const stageNotes = getKillChainStageNotes(selectedNode.id, activeKillChainStepId);

    return [
        `${selectedNode.label} is modeled as ${selectedNode.role.toLowerCase()}.`,
        ...stageNotes,
        isFocusNode
            ? mode === "campaign"
                ? "This node is part of the active multi-stage topology focus."
                : `This node is part of the active topology focus for ${activeScenarios[0].name}.`
            : mode === "campaign"
                ? "This node is secondary to the current campaign chain."
                : `This node is secondary to the selected scenario (${activeScenarios[0].name}).`,
        ...gaps,
        ...recommendations,
    ].slice(0, 4);
}

function getKillChainFocusNodes(stepId) {
    if (stepId === "recon") {
        return ["attacker", "firewall"];
    }

    if (stepId === "weaponize") {
        return ["attacker", "firewall"];
    }

    if (stepId === "deliver") {
        return ["attacker", "firewall", "server"];
    }

    if (stepId === "exploit") {
        return ["server", "workstation"];
    }

    if (stepId === "install") {
        return ["server", "workstation", "admin"];
    }

    if (stepId === "c2") {
        return ["server", "firewall", "attacker"];
    }

    if (stepId === "actions") {
        return ["server", "db", "admin", "workstation"];
    }

    return [];
}

function getKillChainPrimaryNode(stepId) {
    if (stepId === "recon") return "attacker";
    if (stepId === "weaponize") return "attacker";
    if (stepId === "deliver") return "server";
    if (stepId === "exploit") return "workstation";
    if (stepId === "install") return "admin";
    if (stepId === "c2") return "firewall";
    if (stepId === "actions") return "db";
    return "server";
}

function getKillChainStepLabel(stepId) {
    if (stepId === "recon") return "Recon";
    if (stepId === "weaponize") return "Weaponize";
    if (stepId === "deliver") return "Deliver";
    if (stepId === "exploit") return "Exploit";
    if (stepId === "install") return "Install";
    if (stepId === "c2") return "C2";
    if (stepId === "actions") return "Actions";
    return "Unknown";
}

function getKillChainStageObservations(nodeId, stepId) {
    const map = {
        recon: {
            attacker: [
                "External hostile reconnaissance activity is being staged.",
                "Target discovery and timing behavior are concentrated at the adversary edge.",
            ],
            firewall: [
                "Boundary traffic becomes the first observation surface during recon.",
            ],
        },
        weaponize: {
            attacker: [
                "Capability preparation remains external before target delivery.",
            ],
            firewall: [
                "Boundary rules will influence whether prepared traffic becomes visible downstream.",
            ],
        },
        deliver: {
            attacker: [
                "Delivery path is active from the adversary entry point.",
            ],
            firewall: [
                "Ingress filtering is critical during payload delivery.",
            ],
            server: [
                "Application surface is now receiving hostile interaction.",
            ],
        },
        exploit: {
            server: [
                "Execution pressure is shifting into the core workload.",
            ],
            workstation: [
                "Endpoint-side exploitation visibility becomes critical.",
            ],
        },
        install: {
            server: [
                "Persistence or foothold logic may now bind to the application path.",
            ],
            workstation: [
                "Endpoint foothold and follow-on execution become relevant.",
            ],
            admin: [
                "Privileged identity exposure increases during persistent access establishment.",
            ],
        },
        c2: {
            server: [
                "Outbound signaling may originate from the compromised workload.",
            ],
            firewall: [
                "Egress control becomes central for C2 visibility.",
            ],
            attacker: [
                "Remote coordination and beacon reception remain attacker-driven.",
            ],
        },
        actions: {
            db: [
                "Sensitive data handling becomes central to final attacker objectives.",
            ],
            admin: [
                "Privileged access can amplify final-stage impact.",
            ],
            workstation: [
                "Endpoint execution may support staging or lateral operational actions.",
            ],
            server: [
                "Application tier remains a transit and execution surface.",
            ],
        },
    };

    return map[stepId]?.[nodeId] ?? [];
}

function getKillChainStageVisibility(nodeId, stepId) {
    const map = {
        recon: {
            firewall: [
                "Boundary telemetry should be the first validation layer during reconnaissance.",
                "Early visibility depends on ingress inspection and correlation depth.",
            ],
        },
        deliver: {
            server: [
                "Delivery-stage visibility depends on whether the application surface records hostile interaction.",
                "Correlation between edge traffic and application telemetry becomes important here.",
            ],
        },
        exploit: {
            workstation: [
                "Exploit-stage detection often depends on endpoint visibility and execution telemetry.",
            ],
            server: [
                "Server-side exploit traces may appear in process, app or auth telemetry.",
            ],
        },
        install: {
            admin: [
                "Persistent access near privileged identity paths should trigger stronger validation scrutiny.",
            ],
            workstation: [
                "Install-stage persistence often requires endpoint or task-creation telemetry.",
            ],
        },
        c2: {
            firewall: [
                "Egress monitoring and rare destination visibility are key to command-and-control detection.",
            ],
        },
        actions: {
            db: [
                "Final-stage objectives require strong coverage around sensitive assets and data paths.",
            ],
        },
    };

    return map[stepId]?.[nodeId] ?? [];
}

function getKillChainStageNotes(nodeId, stepId) {
    const map = {
        recon: {
            attacker: [
                "This node is the current offensive origin for reconnaissance activity.",
            ],
        },
        deliver: {
            firewall: [
                "Prioritize ingress controls and path validation for delivery-stage review.",
            ],
            server: [
                "Delivery-stage telemetry should be correlated quickly with downstream alerts.",
            ],
        },
        exploit: {
            workstation: [
                "Endpoint tooling and host telemetry become decisive at this stage.",
            ],
        },
        install: {
            admin: [
                "Privilege-linked persistence should be reviewed as a high-risk condition.",
            ],
            workstation: [
                "Persistence artifacts on endpoints should be treated as strong operator signals.",
            ],
        },
        c2: {
            firewall: [
                "Egress inspection is strategically important while the chain is in C2.",
            ],
        },
        actions: {
            db: [
                "Sensitive store access should be treated as the current operational focal point.",
            ],
        },
    };

    return map[stepId]?.[nodeId] ?? [];
}