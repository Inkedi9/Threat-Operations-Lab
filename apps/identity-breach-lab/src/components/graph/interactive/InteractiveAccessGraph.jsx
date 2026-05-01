import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
    Background,
    Controls,
} from "reactflow";
import "reactflow/dist/style.css";

import Panel from "../../ui/Panel";
import { graphLinks } from "../../../data/environment";
import { buildInteractiveGraph } from "./graphAdapters";
import {
    buildAttackFocusGraph,
    buildCrownJewelGraph,
    decorateCrownEdges,
    decorateEdges,
    decorateNodesWithPath,
    decorateNodesWithReplayStep,
    decoratePathEdges,
    filterEdgesToPath,
    filterNodesToPath,
} from "./graphDecorators";
import {
    buildAttackRouteIntelligence,
    buildRouteFromFoothold,
    getBestStartNodeId,
} from "./graphIntelligence";
import {
    findReplayStepNode,
    focusNodeInViewport,
    getCrownTargetIds,
    resolveReplayFootholdId,
} from "./graphUtils";
import UserGraphNode from "./UserGraphNode";
import GroupGraphNode from "./GroupGraphNode";
import SystemGraphNode from "./SystemGraphNode";
import { computeAttackPathScore } from "../../../lib/attackPathScoring";
import { findAttackPaths } from "../../../lib/pathFinder";


const nodeTypes = {
    userNode: UserGraphNode,
    groupNode: GroupGraphNode,
    systemNode: SystemGraphNode,
};

function DrawerBadge({ children, tone = "default" }) {
    const tones = {
        default: "border-line/70 bg-zinc-950/45 text-zinc-300",
        red: "border-danger/20 bg-danger/10 text-red-200",
        amber: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    };

    return (
        <span className={`rounded-full border px-2.5 py-1 text-xs ${tones[tone]}`}>
            {children}
        </span>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-line/80 py-2 text-sm">
            <span className="text-zinc-500">{label}</span>
            <span className="text-right text-zinc-200">{value}</span>
        </div>
    );
}

function NodeDetailsDrawer({ selectedNode, groups = [], users = [] }) {
    const groupNameMap = Object.fromEntries(groups.map((group) => [group.id, group.name]));
    const userNameMap = Object.fromEntries(
        users.map((user) => [user.id, user.username || user.name])
    );

    if (!selectedNode) {
        return (
            <div className="rounded-2xl border border-danger/10 bg-black/25 p-4 shadow-[0_0_18px_rgba(239,68,68,0.04)]">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                    Node Details
                </p>
                <p className="mt-4 text-sm text-zinc-400">
                    Click a graph node to inspect identity, group or asset details.
                </p>
            </div>
        );
    }

    const node = selectedNode.data;

    if (node.entityType === "user") {
        const user = node.raw;

        return (
            <div className="rounded-2xl border border-danger/10 bg-black/25 p-4 shadow-[0_0_18px_rgba(239,68,68,0.04)]">
                <p className="text-xs uppercase tracking-[0.24em] text-danger">User Identity</p>
                <h4 className="mt-2 text-lg font-semibold text-ink">{user.name}</h4>
                <p className="mt-1 text-sm text-zinc-400">@{user.username}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                    <DrawerBadge tone={node.compromised ? "red" : "default"}>
                        {user.status}
                    </DrawerBadge>
                    <DrawerBadge
                        tone={
                            user.privilege === "privileged"
                                ? "red"
                                : user.privilege === "elevated"
                                    ? "amber"
                                    : "default"
                        }
                    >
                        {user.privilege}
                    </DrawerBadge>
                </div>

                <div className="mt-5 space-y-1">
                    <InfoRow label="Role" value={user.role} />
                    <InfoRow label="Department" value={user.department} />
                    <InfoRow label="Primary Machine" value={user.machineId} />
                    <InfoRow label="Risk Score" value={`${user.riskScore}/100`} />
                </div>

                <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Groups</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {user.groups.map((groupId) => (
                            <DrawerBadge key={groupId}>
                                {groupNameMap[groupId] || groupId}
                            </DrawerBadge>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (node.entityType === "group") {
        const group = node.raw;

        return (
            <div className="rounded-2xl border border-danger/10 bg-black/25 p-4 shadow-[0_0_18px_rgba(239,68,68,0.04)]">
                <p className="text-xs uppercase tracking-[0.24em] text-danger">Access Group</p>
                <h4 className="mt-2 text-lg font-semibold text-ink">{group.name}</h4>
                <p className="mt-1 text-sm text-zinc-400">Privilege container</p>

                <div className="mt-4 flex flex-wrap gap-2">
                    <DrawerBadge
                        tone={
                            group.tier === "privileged"
                                ? "red"
                                : group.tier === "elevated"
                                    ? "amber"
                                    : "default"
                        }
                    >
                        {group.tier}
                    </DrawerBadge>
                </div>

                <div className="mt-5 space-y-1">
                    <InfoRow label="Group ID" value={group.id} />
                    <InfoRow label="Tier" value={group.tier} />
                </div>
            </div>
        );
    }

    const system = node.raw;

    return (
        <div className="rounded-2xl border border-danger/10 bg-black/25 p-4 shadow-[0_0_18px_rgba(239,68,68,0.04)]">
            <p className="text-xs uppercase tracking-[0.24em] text-danger">System Asset</p>
            <h4 className="mt-2 text-lg font-semibold text-ink">{system.name}</h4>
            <p className="mt-1 text-sm text-zinc-400">{system.type}</p>

            <div className="mt-4 flex flex-wrap gap-2">
                <DrawerBadge tone={system.status === "impacted" ? "red" : "default"}>
                    {system.status}
                </DrawerBadge>
                <DrawerBadge
                    tone={
                        system.criticality === "critical"
                            ? "red"
                            : system.criticality === "high"
                                ? "amber"
                                : "default"
                    }
                >
                    {system.criticality}
                </DrawerBadge>
            </div>

            <div className="mt-5 space-y-1">
                <InfoRow label="System ID" value={system.id} />
                <InfoRow label="Type" value={system.type} />
                <InfoRow label="Criticality" value={system.criticality} />
                <InfoRow label="Status" value={system.status} />
            </div>

            <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Linked Users
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {(system.linkedUsers || []).length ? (
                        system.linkedUsers.map((userId) => (
                            <DrawerBadge key={userId}>
                                {userNameMap[userId] || userId}
                            </DrawerBadge>
                        ))
                    ) : (
                        <p className="text-sm text-zinc-400">No directly linked users</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function getEntityLabelById(id, users = [], groups = [], systems = []) {
    const user = users.find((entry) => entry.id === id);
    if (user) return user.username || user.name;

    const group = groups.find((entry) => entry.id === id);
    if (group) return group.name;

    const system = systems.find((entry) => entry.id === id);
    if (system) return system.name;

    return id;
}

function EdgeDetailsCard({ edge, users = [], groups = [], systems = [] }) {
    if (!edge) {
        return (
            <div className="rounded-2xl border border-danger/10 bg-black/25 p-4 shadow-[0_0_18px_rgba(239,68,68,0.04)]">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                    Relation Details
                </p>
                <p className="mt-4 text-sm text-zinc-400">
                    Click an edge in the graph to inspect the relationship between two entities.
                </p>
            </div>
        );
    }

    const sourceLabel = getEntityLabelById(edge.source, users, groups, systems);
    const targetLabel = getEntityLabelById(edge.target, users, groups, systems);
    const relation = edge.data?.relation || edge.label || "relation";

    return (
        <div className="rounded-2xl border border-danger/10 bg-black/25 p-4 shadow-[0_0_18px_rgba(239,68,68,0.04)]">
            <p className="text-xs uppercase tracking-[0.24em] text-danger">
                Relation Details
            </p>

            <div className="mt-4 rounded-xl border border-danger/10 bg-danger/10 p-4">
                <p className="text-sm text-zinc-300">
                    <span className="font-semibold text-red-200">{sourceLabel}</span>
                    <span className="mx-2 text-zinc-500">→</span>
                    <span className="font-semibold text-zinc-100">{targetLabel}</span>
                </p>

                <div className="mt-3">
                    <DrawerBadge tone="amber">{relation}</DrawerBadge>
                </div>
            </div>

            <div className="mt-5 space-y-1">
                <InfoRow label="Source ID" value={edge.source} />
                <InfoRow label="Target ID" value={edge.target} />
                <InfoRow label="Relationship" value={relation} />
                <InfoRow
                    label="Animated"
                    value={edge.animated ? "true" : "false"}
                />
            </div>
        </div>
    );
}

function filterGraphToCompromisedContext(nodes = [], edges = []) {
    const compromisedIds = new Set(
        nodes
            .filter((node) => node.data?.compromised)
            .map((node) => node.id)
    );

    const privilegedOrCriticalIds = new Set(
        nodes
            .filter(
                (node) =>
                    node.data?.privileged ||
                    node.data?.raw?.criticality === "critical" ||
                    node.data?.raw?.tier === "privileged"
            )
            .map((node) => node.id)
    );

    const relevantEdges = edges.filter(
        (edge) =>
            compromisedIds.has(edge.source) ||
            compromisedIds.has(edge.target) ||
            privilegedOrCriticalIds.has(edge.source) ||
            privilegedOrCriticalIds.has(edge.target)
    );

    const visibleIds = new Set();

    relevantEdges.forEach((edge) => {
        visibleIds.add(edge.source);
        visibleIds.add(edge.target);
    });

    compromisedIds.forEach((id) => visibleIds.add(id));

    return {
        nodes: nodes.filter((node) => visibleIds.has(node.id)),
        edges: relevantEdges,
    };
}

function RouteSelectorCard({
    routes = [],
    nodesMap = {},
    selectedPath = [],
    onSelectRoute,
}) {
    if (!routes.length) {
        return (
            <div className="rounded-2xl border border-danger/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-danger">
                    Route Selector
                </p>
                <p className="mt-3 text-sm text-zinc-400">
                    No crown jewel route available from the current graph context.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-danger/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-danger">
                Route Selector
            </p>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
                Compare available multi-hop attack routes and focus the graph on one path.
            </p>

            <div className="mt-4 space-y-3">
                {routes.slice(0, 4).map((route, index) => {
                    const isActive =
                        selectedPath.join("->") === route.path.join("->");

                    const firstNode = nodesMap[route.path[0]];
                    const lastNode = nodesMap[route.path[route.path.length - 1]];

                    return (
                        <button
                            key={route.path.join("-")}
                            type="button"
                            onClick={() => onSelectRoute(route)}
                            className={`w-full rounded-xl border p-3 text-left transition ${isActive
                                ? "border-danger/40 bg-danger/15 shadow-[0_0_18px_rgba(239,68,68,0.12)]"
                                : "border-line/70 bg-black/25 hover:border-danger/20 hover:bg-danger/10"
                                }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-zinc-100">
                                    Route #{index + 1}
                                </p>

                                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-200">
                                    Score {route.score}
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-zinc-400">
                                {firstNode?.data?.label || route.path[0]} →{" "}
                                {lastNode?.data?.label || route.path[route.path.length - 1]}
                            </p>

                            <p className="mt-2 text-xs text-zinc-500">
                                {route.hops} hop{route.hops > 1 ? "s" : ""}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function GraphToolbar({
    onResetSelection,
    onFitView,
    onZoomIn,
    onZoomOut,
    showLabels,
    setShowLabels,
    animatedLinks,
    setAnimatedLinks,
    highlightBestRoute,
    setHighlightBestRoute,
    showOnlyBestRoute,
    setShowOnlyBestRoute,
    showOnlyCompromised,
    setShowOnlyCompromised,
}) {
    return (
        <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
                type="button"
                onClick={onFitView}
                className="rounded-xl border border-line/70 bg-black/30 px-3 py-2 text-xs text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10"
            >
                Fit View
            </button>

            <button
                type="button"
                onClick={onResetSelection}
                className="rounded-xl border border-line/70 bg-black/30 px-3 py-2 text-xs text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10"
            >
                Reset Selection
            </button>

            <button
                type="button"
                onClick={onZoomIn}
                className="rounded-xl border border-line/70 bg-black/30 px-3 py-2 text-xs text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10"
            >
                Zoom In
            </button>

            <button
                type="button"
                onClick={onZoomOut}
                className="rounded-xl border border-line/70 bg-black/30 px-3 py-2 text-xs text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10"
            >
                Zoom Out
            </button>

            <button
                type="button"
                onClick={() => setShowLabels((current) => !current)}
                className={`rounded-xl border px-3 py-2 text-xs transition ${showLabels
                    ? "border-danger/30 bg-danger/10 text-red-200"
                    : "border-line/70 bg-black/30 text-zinc-200 hover:border-danger/20 hover:bg-danger/10"
                    }`}
            >
                {showLabels ? "Labels: ON" : "Labels: OFF"}
            </button>

            <button
                type="button"
                onClick={() => setAnimatedLinks((current) => !current)}
                className={`rounded-xl border px-3 py-2 text-xs transition ${animatedLinks
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                    : "border-line/70 bg-black/30 text-zinc-200 hover:border-amber-500/20 hover:bg-amber-500/10"
                    }`}
            >
                {animatedLinks ? "Animated Links: ON" : "Animated Links: OFF"}
            </button>

            <button
                type="button"
                onClick={() => setHighlightBestRoute((current) => !current)}
                className={`rounded-xl border px-3 py-2 text-xs transition ${highlightBestRoute
                    ? "border-danger/30 bg-danger/10 text-red-200"
                    : "border-line/70 bg-black/30 text-zinc-200 hover:border-danger/20 hover:bg-danger/10"
                    }`}
            >
                {highlightBestRoute ? "Best Route: ON" : "Best Route: OFF"}
            </button>

            <button
                type="button"
                onClick={() => setShowOnlyBestRoute((current) => !current)}
                className={`rounded-xl border px-3 py-2 text-xs transition ${showOnlyBestRoute
                    ? "border-red-400/30 bg-red-500/12 text-red-100"
                    : "border-line/70 bg-black/30 text-zinc-200 hover:border-red-400/20 hover:bg-red-500/10"
                    }`}
            >
                {showOnlyBestRoute ? "Only Route: ON" : "Only Route: OFF"}
            </button>

            <button
                type="button"
                onClick={() => setShowOnlyCompromised((current) => !current)}
                className={`rounded-xl border px-3 py-2 text-xs transition ${showOnlyCompromised
                    ? "border-danger/30 bg-danger/10 text-red-200"
                    : "border-line/70 bg-black/30 text-zinc-200 hover:border-danger/20 hover:bg-danger/10"
                    }`}
            >
                {showOnlyCompromised ? "Compromised Only: ON" : "Compromised Only"}
            </button>
        </div>
    );
}

function isEdgeInPath(edge, path = []) {
    if (!path.length) return false;

    return path.some((nodeId, index) => {
        const nextNodeId = path[index + 1];
        if (!nextNodeId) return false;

        return edge.source === nodeId && edge.target === nextNodeId;
    });
}

function decorateReplayPathEdges(edges = [], path = [], currentReplayStep) {
    if (!currentReplayStep || !path.length) return edges;

    return edges.map((edge) => {
        if (!isEdgeInPath(edge, path)) return edge;

        return {
            ...edge,
            animated: true,
            className: `${edge.className || ""} replay-active-edge`,
            style: {
                ...(edge.style || {}),
                strokeWidth: 3,
            },
        };
    });
}

{/* INTELLIGENT PANEL */ }
function AttackRouteIntelligenceCard({
    intelligence,
    nodes = [],
    onSelectPivot,
    footholdRoute,
}) {
    const labelFromId = (id) => {
        const node = nodes.find((entry) => entry.id === id);
        return node?.data?.label || id;
    };

    const activeRoute =
        footholdRoute?.path?.length ? footholdRoute : intelligence.bestRoute;

    return (
        <div className="rounded-2xl border border-danger/20 p-4 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
            <p className="text-xs uppercase tracking-[0.24em] text-danger">
                Attack Route Intelligence
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-line/70 bg-black/25 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        Compromised Footholds
                    </p>
                    <p className="mt-2 text-2xl font-bold text-red-200">
                        {intelligence.compromisedCount}
                    </p>
                </div>

                <div className="rounded-xl border border-line/70 bg-black/25 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        Privileged Pivots
                    </p>
                    <p className="mt-2 text-2xl font-bold text-amber-200">
                        {intelligence.privilegedCount}
                    </p>
                </div>
            </div>

            <div className="mt-4 rounded-xl border border-line/70 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Best Route To Crown Jewel
                </p>

                {activeRoute ? (
                    <>
                        <p className="mt-3 text-sm text-zinc-300">
                            Shortest offensive route starts from{" "}
                            <button
                                type="button"
                                onClick={() => onSelectPivot(activeRoute.sourceId)}
                                className="font-semibold text-red-200 transition hover:text-red-100"
                            >
                                {activeRoute.sourceLabel}
                            </button>{" "}
                            and reaches a crown jewel in{" "}
                            <span className="font-semibold text-amber-200">
                                {activeRoute.hopCount} hops
                            </span>.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {activeRoute.path.map((id) => (
                                <button
                                    type="button"
                                    key={id}
                                    onClick={() => onSelectPivot(id)}
                                    className="rounded-full border border-danger/20 bg-black/20 px-3 py-1 text-xs text-zinc-200 transition hover:border-danger/30 hover:bg-danger/10"
                                >
                                    {labelFromId(id)}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="mt-3 text-sm text-zinc-400">
                        No direct crown jewel route is currently reachable from compromised footholds.
                    </p>
                )}
            </div>

            <div className="mt-4 rounded-xl border border-line/70 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Offensive Pivot Opportunities
                </p>

                {intelligence.offensivePivots.length ? (
                    <div className="mt-3 space-y-3">
                        {intelligence.offensivePivots.map((pivot) => (
                            <button
                                type="button"
                                key={pivot.id}
                                onClick={() => onSelectPivot(pivot.id)}
                                className="w-full rounded-xl border border-line/70 bg-zinc-950/45 px-3 py-2 text-left transition hover:border-danger/20 hover:bg-danger/10"
                            >
                                <p className="text-sm font-medium text-zinc-100">
                                    {pivot.label}
                                </p>
                                <p className="mt-1 text-xs text-zinc-400">
                                    {pivot.type} • {pivot.subtitle}
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-zinc-400">
                        No privileged pivots identified yet.
                    </p>
                )}
            </div>
        </div>
    );
}

function FootholdSelectorCard({
    footholds = [],
    selectedFootholdId,
    setSelectedFootholdId,
}) {
    return (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
            <p className="text-xs uppercase tracking-[0.24em] text-danger">
                Route From Foothold
            </p>

            <p className="mt-3 text-sm leading-6 text-zinc-300">
                Select a compromised entry identity to calculate a dedicated offensive route
                toward crown jewels.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setSelectedFootholdId(null)}
                    className={`rounded-xl border px-3 py-2 text-xs transition ${selectedFootholdId === null
                        ? "border-danger/25 bg-danger/10 text-red-100 shadow-[0_0_14px_rgba(239,68,68,0.08)]"
                        : "border-line/70 bg-black/25 text-zinc-300 hover:border-danger/20 hover:bg-danger/10"
                        }`}
                >
                    Auto Best Route
                </button>

                {footholds.map((foothold) => (
                    <button
                        type="button"
                        key={foothold.id}
                        onClick={() => setSelectedFootholdId(foothold.id)}
                        className={`rounded-xl border px-3 py-2 text-xs transition ${selectedFootholdId === foothold.id
                            ? "border-danger/30 bg-danger/10 text-red-200"
                            : "border-line/70 bg-black/25 text-zinc-300 hover:border-danger/20 hover:bg-danger/10"
                            }`}
                    >
                        {foothold.data?.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

{/* INTERACTIV ACCESS GRAPH */ }
export default function InteractiveAccessGraph({
    users = [],
    groups = [],
    systems = [],
    currentReplayStep,
    linkedUser,
}) {
    const { nodes, edges, graphHeight } = useMemo(
        () => buildInteractiveGraph(users, groups, systems, graphLinks),
        [users, groups, systems]
    );

    const [selectedNode, setSelectedNode] = useState(null);
    const [attackFocus, setAttackFocus] = useState(false);
    const [showCrownPaths, setShowCrownPaths] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [showLabels, setShowLabels] = useState(true);
    const [animatedLinks, setAnimatedLinks] = useState(true);
    const [flowInstance, setFlowInstance] = useState(null);
    const [highlightBestRoute, setHighlightBestRoute] = useState(true);
    const [showOnlyBestRoute, setShowOnlyBestRoute] = useState(false);
    const [selectedFootholdId, setSelectedFootholdId] = useState(null);
    const [showOnlyCompromised, setShowOnlyCompromised] = useState(false);
    const [manualRoutePath, setManualRoutePath] = useState([]);

    const handleResetSelection = () => {
        setSelectedNode(null);
        setSelectedEdge(null);
        setManualRoutePath([]);
    };

    const handleFitView = () => {
        flowInstance?.fitView({ padding: 0.18, duration: 500 });
    };

    const handleZoomIn = () => {
        flowInstance?.zoomIn({ duration: 250 });
    };

    const handleZoomOut = () => {
        flowInstance?.zoomOut({ duration: 250 });
    };

    useEffect(() => {
        if (!currentReplayStep || !flowInstance) return;

        const targetNode =
            findReplayStepNode(nodes, currentReplayStep, "target") ||
            findReplayStepNode(nodes, currentReplayStep, "source");

        if (!targetNode) return;

        focusNodeInViewport(flowInstance, targetNode);
    }, [currentReplayStep, flowInstance, nodes]);

    const handleSelectPivot = (nodeId) => {
        const targetNode = nodes.find((node) => node.id === nodeId);

        if (!targetNode) return;

        setSelectedFootholdId(null);
        setSelectedEdge(null);
        setSelectedNode(targetNode);

        if (showCrownPaths) {
            setShowCrownPaths(false);
        }

        focusNodeInViewport(flowInstance, targetNode);
    };

    const { focusedNodes, focusedEdges } = useMemo(
        () => buildAttackFocusGraph(nodes, edges),
        [nodes, edges]
    );

    const { focusedNodes: crownNodes, focusedEdges: crownEdges, crownIds } = useMemo(
        () => buildCrownJewelGraph(nodes, edges),
        [nodes, edges]
    );

    const baseGraphView = useMemo(() => {
        const baseNodes = showCrownPaths
            ? crownNodes
            : attackFocus
                ? focusedNodes
                : nodes;

        const baseEdges = showCrownPaths
            ? crownEdges
            : attackFocus
                ? focusedEdges
                : edges;

        if (!showOnlyCompromised) {
            return {
                nodes: baseNodes,
                edges: baseEdges,
            };
        }

        return filterGraphToCompromisedContext(baseNodes, baseEdges);
    }, [
        showCrownPaths,
        crownNodes,
        crownEdges,
        attackFocus,
        focusedNodes,
        focusedEdges,
        nodes,
        edges,
        showOnlyCompromised,
    ]);

    const visibleNodes = baseGraphView.nodes;
    const visibleEdgesBase = baseGraphView.edges;

    const compromisedFootholds = useMemo(
        () =>
            visibleNodes.filter(
                (node) =>
                    node.data?.entityType === "user" && node.data?.compromised
            ),
        [visibleNodes]
    );

    const attackIntelligence = useMemo(
        () => buildAttackRouteIntelligence(visibleNodes, visibleEdgesBase),
        [visibleNodes, visibleEdgesBase]
    );

    const footholdRoute = useMemo(
        () => buildRouteFromFoothold(visibleNodes, visibleEdgesBase, selectedFootholdId),
        [visibleNodes, visibleEdgesBase, selectedFootholdId]
    );

    const replayFootholdId = useMemo(
        () => resolveReplayFootholdId(visibleNodes, currentReplayStep),
        [visibleNodes, currentReplayStep]
    );

    const replayDrivenRoute = useMemo(
        () => buildRouteFromFoothold(visibleNodes, visibleEdgesBase, replayFootholdId),
        [visibleNodes, visibleEdgesBase, replayFootholdId]
    );

    const nodesMap = useMemo(() => {
        return Object.fromEntries(nodes.map((n) => [n.id, n]));
    }, [nodes]);

    const crownTargetIds = useMemo(
        () => getCrownTargetIds(visibleNodes),
        [visibleNodes]
    );

    const multiHopStartId = useMemo(
        () =>
            getBestStartNodeId({
                selectedFootholdId,
                replayFootholdId,
                attackIntelligence,
                visibleNodes,
            }),
        [selectedFootholdId, replayFootholdId, attackIntelligence, visibleNodes]
    );

    const multiHopPaths = useMemo(() => {
        if (!multiHopStartId) return [];
        return findAttackPaths(multiHopStartId, crownTargetIds, visibleEdgesBase, 8);
    }, [multiHopStartId, crownTargetIds, visibleEdgesBase]);

    const rankedMultiHopPaths = useMemo(() => {
        return multiHopPaths
            .map((path) => ({
                path,
                score: computeAttackPathScore(path, nodesMap),
                hops: Math.max(path.length - 1, 0),
            }))
            .sort((a, b) => b.score - a.score);
    }, [multiHopPaths, nodesMap]);

    const bestMultiHopPath = rankedMultiHopPaths[0] || null;

    const activeRoute = useMemo(() => {
        if (bestMultiHopPath?.path?.length) {
            return {
                sourceId: multiHopStartId,
                sourceLabel: nodesMap[multiHopStartId]?.data?.label || "auto",
                path: bestMultiHopPath.path,
                hopCount: bestMultiHopPath.hops,
                score: bestMultiHopPath.score,
            };
        }

        if (replayDrivenRoute?.path?.length) return replayDrivenRoute;
        if (footholdRoute?.path?.length) return footholdRoute;

        return attackIntelligence.bestRoute || null;
    }, [
        bestMultiHopPath,
        multiHopStartId,
        nodesMap,
        replayDrivenRoute,
        footholdRoute,
        attackIntelligence.bestRoute,
    ]);

    const highlightedPath = useMemo(() => {
        if (manualRoutePath.length) return manualRoutePath;
        return activeRoute?.path || [];
    }, [manualRoutePath, activeRoute]);

    const activePathScore = useMemo(() => {
        if (!highlightedPath?.length) return 0;

        return computeAttackPathScore(highlightedPath, nodesMap);
    }, [highlightedPath, nodesMap]);

    useEffect(() => {
        if (!currentReplayStep || !flowInstance) return;

        const preferredNodeId =
            activeRoute?.path?.length ? activeRoute.path[0] : null;

        const preferredNode =
            preferredNodeId
                ? nodes.find((node) => node.id === preferredNodeId)
                : null;

        const fallbackNode =
            findReplayStepNode(nodes, currentReplayStep, "target") ||
            findReplayStepNode(nodes, currentReplayStep, "source");

        const targetNode = preferredNode || fallbackNode;

        if (!targetNode) return;

        focusNodeInViewport(flowInstance, targetNode);
    }, [currentReplayStep, flowInstance, nodes, activeRoute]);

    const effectivePath = useMemo(
        () => (highlightBestRoute && highlightedPath.length ? highlightedPath : []),
        [highlightBestRoute, highlightedPath]
    );

    const decoratedNodes = useMemo(() => {
        const nodesToDecorate = showOnlyBestRoute
            ? filterNodesToPath(visibleNodes, effectivePath)
            : visibleNodes;

        const pathDecorated = decorateNodesWithPath(nodesToDecorate, effectivePath);
        return decorateNodesWithReplayStep(pathDecorated, currentReplayStep);
    }, [visibleNodes, effectivePath, showOnlyBestRoute, currentReplayStep]);

    const decoratedEdges = useMemo(() => {
        let nextEdges = showOnlyBestRoute
            ? filterEdgesToPath(visibleEdgesBase, effectivePath)
            : visibleEdgesBase;

        nextEdges = decorateEdges(
            nextEdges,
            selectedNode,
            selectedEdge,
            showLabels,
            animatedLinks
        );

        if (showCrownPaths) {
            nextEdges = decorateCrownEdges(nextEdges, crownIds);
        }

        nextEdges = decoratePathEdges(nextEdges, effectivePath);
        nextEdges = decorateReplayPathEdges(nextEdges, effectivePath, currentReplayStep);

        return nextEdges;
    }, [
        visibleEdgesBase,
        selectedNode,
        selectedEdge,
        showLabels,
        animatedLinks,
        showCrownPaths,
        crownIds,
        effectivePath,
        showOnlyBestRoute,
        currentReplayStep,
    ]
    );

    useEffect(() => {
        if (!linkedUser || !nodes.length) return;

        const linkedNode =
            nodes.find((node) => node.data?.label === linkedUser) ||
            nodes.find((node) => node.data?.raw?.username === linkedUser);

        if (!linkedNode) return;

        const timeoutId = window.setTimeout(() => {
            setSelectedNode(linkedNode);
            setSelectedEdge(null);
            setSelectedFootholdId(linkedNode.id);
        }, 0);

        if (flowInstance) {
            focusNodeInViewport(flowInstance, linkedNode);
        }

        return () => window.clearTimeout(timeoutId);
    }, [linkedUser, nodes, flowInstance]);

    const scoreColor =
        activePathScore > 120
            ? "text-red-400"
            : activePathScore > 80
                ? "text-amber-300"
                : "text-emerald-300";

    return (
        <Panel
            title="Interactive Identity Graph"
            subtitle="Pan, zoom and inspect enterprise access relationships across identities, groups and systems."
            actions={
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setAttackFocus((current) => {
                                const next = !current;
                                if (next) setShowCrownPaths(false);
                                return next;
                            });
                        }}
                        className={`rounded-xl border px-3 py-2 text-sm transition ${attackFocus
                            ? "border-danger/30 bg-danger/10 text-red-200"
                            : "border-line/70 bg-black/30 text-zinc-200 hover:border-danger/20 hover:bg-danger/10"
                            }`}
                    >
                        {attackFocus ? "Attack Focus: ON" : "Attack Focus"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowCrownPaths((current) => {
                                const next = !current;
                                if (next) setAttackFocus(false);
                                return next;
                            });
                        }}
                        className={`rounded-xl border px-3 py-2 text-sm transition ${showCrownPaths
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                            : "border-line/70 bg-black/30 text-zinc-200 hover:border-amber-500/20 hover:bg-amber-500/10"
                            }`}
                    >
                        {showCrownPaths ? "Crown Jewel Paths: ON" : "Crown Jewel Paths"}
                    </button>
                </div>

            }
        >
            <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-2xl border border-line/70 bg-black/25 p-3">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-line/70 bg-zinc-950/45 px-3 py-1 text-xs text-zinc-300">
                            Users
                        </span>
                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                            Privileged
                        </span>
                        <span className="rounded-full border border-danger/20 bg-danger/10 px-3 py-1 text-xs text-red-200">
                            Compromised
                        </span>
                    </div>

                    <GraphToolbar
                        onResetSelection={handleResetSelection}
                        onFitView={handleFitView}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        showLabels={showLabels}
                        setShowLabels={setShowLabels}
                        animatedLinks={animatedLinks}
                        setAnimatedLinks={setAnimatedLinks}
                        highlightBestRoute={highlightBestRoute}
                        setHighlightBestRoute={setHighlightBestRoute}
                        showOnlyBestRoute={showOnlyBestRoute}
                        setShowOnlyBestRoute={setShowOnlyBestRoute}
                        showOnlyCompromised={showOnlyCompromised}
                        setShowOnlyCompromised={setShowOnlyCompromised}
                    />

                    <div
                        className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-line/70 bg-[#070709] 2xl:h-[600px]"
                    >
                        {currentReplayStep && (
                            <div className="pointer-events-none absolute left-4 top-4 z-20 max-w-md rounded-2xl border border-danger/20 bg-black/75 p-4 shadow-[0_0_24px_rgba(239,68,68,0.12)] backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.24em] text-danger">
                                    Replay Step Active
                                </p>
                                <p className="mt-2 text-sm font-medium text-zinc-100">
                                    {currentReplayStep.technique}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-zinc-300">
                                    {currentReplayStep.sourceIdentity} → {currentReplayStep.targetSystem}
                                </p>
                                <p className="mt-2 text-xs text-zinc-500">
                                    {currentReplayStep.timestamp} · {currentReplayStep.severity}
                                </p>
                            </div>

                        )}
                        <ReactFlow
                            nodes={decoratedNodes}
                            edges={decoratedEdges}
                            nodeTypes={nodeTypes}
                            fitView
                            fitViewOptions={{ padding: 0.18 }}
                            nodesDraggable={false}
                            nodesConnectable={false}
                            elementsSelectable
                            onInit={setFlowInstance}
                            onNodeClick={(_, node) => {
                                setSelectedNode(node);
                                setSelectedEdge(null);
                                focusNodeInViewport(flowInstance, node);
                            }}
                            onEdgeClick={(_, edge) => {
                                setSelectedEdge(edge);
                                setSelectedNode(null);

                                const targetNode = nodes.find((node) => node.id === edge.target);
                                if (targetNode) {
                                    focusNodeInViewport(flowInstance, targetNode);
                                }
                            }}
                            proOptions={{ hideAttribution: true }}
                        >
                            <Controls className="!bg-slate-950/90 !border !border-slate-800 !rounded-xl !overflow-hidden" />
                            <Background
                                gap={24}
                                size={1}
                                color="rgba(255,255,255,0.06)"
                            />
                        </ReactFlow>

                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        {currentReplayStep && (
                            <div className="rounded-2xl border border-danger/10 bg-black/25 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-danger">
                                    Replay Sync
                                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500 opacity-80 animate-[pulse_1.6s_ease-in-out_infinite]" />
                                </p>

                                <p className="mt-3 text-sm leading-6 text-zinc-300">
                                    <span className="font-semibold text-red-200">
                                        {currentReplayStep.sourceIdentity}
                                    </span>{" "}
                                    →
                                    <span className="mx-1 font-semibold text-zinc-100">
                                        {currentReplayStep.targetSystem}
                                    </span>
                                </p>

                                <p className="mt-2 text-xs text-zinc-500">
                                    {currentReplayStep.technique}
                                </p>
                            </div>
                        )}

                        {currentReplayStep && activeRoute?.path?.length > 0 && (
                            <div className="rounded-2xl border border-danger/10 bg-black/25 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-danger">
                                    Replay Route Focus
                                </p>

                                <p className="mt-3 text-sm leading-6 text-zinc-300">
                                    Route recalculated from{" "}
                                    <span className="font-semibold text-red-200">
                                        {activeRoute.sourceLabel}
                                    </span>
                                </p>

                                <p className="mt-2 text-xs text-zinc-500">
                                    {Math.max(activeRoute.path.length - 1, 0)} hops toward crown jewel.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">

                        {currentReplayStep && (
                            <div className="rounded-2xl border border-danger/10 bg-black/25 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-danger">
                                    Current Replay Marker
                                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500 opacity-80 animate-[pulse_1.6s_ease-in-out_infinite]" />
                                </p>

                                <p className="mt-3 text-sm leading-6 text-zinc-300">
                                    <span className="font-semibold text-red-200">
                                        {currentReplayStep.technique}
                                    </span>{" "}
                                    targeting{" "}
                                    <span className="font-semibold text-zinc-100">
                                        {currentReplayStep.targetSystem}
                                    </span>
                                </p>

                                <p className="mt-2 text-xs text-zinc-500">
                                    {currentReplayStep.timestamp} · {currentReplayStep.severity}
                                </p>
                            </div>
                        )}

                        <div className="rounded-2xl border border-danger/10 bg-black/25 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-danger">
                                Attack Focus
                            </p>

                            <p className="mt-3 text-sm leading-6 text-zinc-300">
                                {attackFocus
                                    ? "Graph is highlighting compromised and attack-relevant paths."
                                    : "Full access graph is displayed without attack filtering."}
                            </p>

                            <div className="mt-3">
                                <span
                                    className={`rounded-full border px-3 py-1 text-xs ${attackFocus
                                        ? "border-danger/30 bg-danger/10 text-red-200"
                                        : "border-line/70 bg-black/30 text-zinc-400"
                                        }`}
                                >
                                    {attackFocus ? "Enabled" : "Disabled"}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="space-y-4">
                    {selectedNode ? (
                        <NodeDetailsDrawer
                            selectedNode={selectedNode}
                            groups={groups}
                            users={users}
                        />
                    ) : (
                        <EdgeDetailsCard
                            edge={selectedEdge}
                            users={users}
                            groups={groups}
                            systems={systems}
                        />
                    )}

                    <FootholdSelectorCard
                        footholds={compromisedFootholds}
                        selectedFootholdId={selectedFootholdId}
                        setSelectedFootholdId={setSelectedFootholdId}
                    />

                    <AttackRouteIntelligenceCard
                        intelligence={attackIntelligence}
                        nodes={visibleNodes}
                        onSelectPivot={handleSelectPivot}
                        footholdRoute={activeRoute}
                    />

                    {highlightedPath.length > 0 && (
                        <div className="rounded-2xl border border-danger/10 bg-danger/10 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-danger">
                                Live Attack Path
                                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500 opacity-80 animate-[pulse_1.6s_ease-in-out_infinite]" />
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-300">
                                Active offensive route highlighted across the graph.
                            </p>
                        </div>
                    )}


                    <div className="rounded-2xl border border-line/70 bg-black/25 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-muted">
                            Operational Context
                        </p>

                        <div className="mt-4 space-y-3 text-sm text-zinc-300">
                            {selectedNode && (
                                <p>
                                    Selected node:{" "}
                                    <span className="font-semibold text-red-200">
                                        {selectedNode.data?.label}
                                    </span>
                                </p>
                            )}

                            {selectedEdge && (
                                <p>
                                    Selected relation:{" "}
                                    <span className="font-semibold text-amber-200">
                                        {selectedEdge.data?.relation || selectedEdge.label || "relation"}
                                    </span>
                                </p>
                            )}

                            {currentReplayStep && (
                                <p>
                                    Replay sync:{" "}
                                    <span className="font-semibold text-red-200">
                                        {currentReplayStep.technique}
                                    </span>{" "}
                                    →{" "}
                                    <span className="font-semibold text-zinc-100">
                                        {currentReplayStep.targetSystem}
                                    </span>
                                </p>
                            )}

                            {activeRoute?.path?.length > 0 && (
                                <p>
                                    Active route:{" "}
                                    <span className="font-semibold text-red-200">
                                        {Math.max(activeRoute.path.length - 1, 0)} hops
                                    </span>
                                </p>
                            )}

                            {attackFocus && (
                                <p className="text-red-200">
                                    Attack focus enabled.
                                </p>
                            )}

                            {showCrownPaths && (
                                <p className="text-amber-200">
                                    Crown jewel pathing enabled.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 grid gap-6 2xl:grid-cols-2">
                <RouteSelectorCard
                    routes={rankedMultiHopPaths}
                    nodesMap={nodesMap}
                    selectedPath={highlightedPath}
                    onSelectRoute={(route) => {
                        setManualRoutePath(route.path);
                        setHighlightBestRoute(true);
                        setShowOnlyBestRoute(true);
                    }}
                />

                <div className="rounded-2xl border border-danger/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-danger">
                        Multi-Hop Route Analysis
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-danger/20 bg-danger/10 p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Paths
                            </p>
                            <p className="mt-2 text-2xl font-bold text-red-200">
                                {rankedMultiHopPaths.length}
                            </p>
                        </div>

                        <div className="rounded-xl border border-danger/20 bg-danger/10 p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Best Score
                            </p>
                            <p className="mt-2 text-2xl font-bold text-amber-200">
                                {bestMultiHopPath?.score || 0}
                            </p>
                        </div>

                        <div className="rounded-xl border border-danger/20 bg-danger/10 p-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                                Hops
                            </p>
                            <p className="mt-2 text-2xl font-bold text-zinc-100">
                                {bestMultiHopPath?.hops || 0}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-zinc-300">
                        The graph evaluates multiple routes toward crown jewels and highlights
                        the highest-scoring offensive path.
                    </p>
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-line/70 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                    Graph Summary
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-line/70 bg-black/25 p-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            Nodes
                        </p>
                        <p className="mt-2 text-xl font-bold text-white">
                            {visibleNodes.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-line/70 bg-black/25 p-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            Edges
                        </p>
                        <p className="mt-2 text-xl font-bold text-white">
                            {decoratedEdges.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-danger/20 bg-danger/10 p-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            Attack Path Score
                        </p>
                        <p className={`mt-2 text-xl font-bold ${scoreColor}`}>
                            {activePathScore}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <DrawerBadge tone={attackFocus ? "red" : "default"}>
                        attack focus {attackFocus ? "enabled" : "disabled"}
                    </DrawerBadge>

                    <DrawerBadge tone={showCrownPaths ? "amber" : "default"}>
                        crown paths {showCrownPaths ? "enabled" : "disabled"}
                    </DrawerBadge>
                    <DrawerBadge tone={highlightBestRoute ? "red" : "default"}>
                        best route {highlightBestRoute ? "enabled" : "hidden"}
                    </DrawerBadge>

                    <DrawerBadge tone={showOnlyBestRoute ? "red" : "default"}>
                        route-only {showOnlyBestRoute ? "enabled" : "disabled"}
                    </DrawerBadge>

                    <DrawerBadge tone={showLabels ? "red" : "default"}>
                        labels {showLabels ? "enabled" : "hidden"}
                    </DrawerBadge>

                    <DrawerBadge tone={animatedLinks ? "amber" : "default"}>
                        links {animatedLinks ? "animated" : "static"}
                    </DrawerBadge>
                </div>

            </div>

        </Panel>
    );
}
