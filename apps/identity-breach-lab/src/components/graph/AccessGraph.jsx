import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Panel from "../ui/Panel";
import StatusBadge from "../ui/StatusBadge";
import { graphLinks } from "../../data/environment";

function buildGraphData(users = [], groups = [], systems = []) {
    const userNodes = users.map((user) => ({
        id: user.id,
        label: user.username,
        title: user.name,
        type: "user",
        compromised: ["compromised", "privileged-compromised"].includes(user.status),
        privileged: ["elevated", "privileged"].includes(user.privilege),
        meta: user.role,
        raw: user,
    }));

    const groupNodes = groups.map((group) => ({
        id: group.id,
        label: group.name,
        title: group.name,
        type: "group",
        compromised: false,
        privileged: group.tier === "privileged",
        meta: group.tier,
        raw: group,
    }));

    const systemNodes = systems.map((system) => ({
        id: system.id,
        label: system.name,
        title: system.name,
        type: "system",
        compromised: system.status === "impacted",
        privileged: system.criticality === "critical",
        meta: system.type,
        raw: system,
    }));

    return {
        userNodes,
        groupNodes,
        systemNodes,
    };
}

function nodeTone(node) {
    if (node.compromised) {
        return "border-danger/30 bg-danger/10 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.16)] animate-pulse";
    }

    if (node.privileged) {
        return "border-amber-500/22 bg-amber-500/10 text-amber-200";
    }

    return "border-lineSoft bg-zinc-900/45 text-zinc-200";
}

function GraphNode({ node, isSelected, onClick }) {
    return (
        <button
            type="button"
            onClick={() => onClick(node)}
            className={`w-full rounded-2xl border p-3 text-left transition duration-300 hover:-translate-y-0.5 ${isSelected ? "ring-1 ring-danger/40" : ""
                } ${nodeTone(node)}`}
        >
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-70">
                {node.type}
            </p>
            <p className="mt-2 font-semibold">{node.label}</p>
            <p className="mt-1 text-xs text-zinc-400">{node.meta}</p>
        </button>
    );
}

function RelationItem({ link, nodeLabelMap, onSelectNode }) {
    const fromLabel = nodeLabelMap[link.from] || link.from;
    const toLabel = nodeLabelMap[link.to] || link.to;

    return (
        <button
            type="button"
            onClick={() => onSelectNode(link)}
            className="flex w-full items-center gap-2 rounded-xl border border-line/80 bg-zinc-900/45 px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-danger/20 hover:bg-danger/10"
        >
            <span className="font-medium text-red-200">{fromLabel}</span>
            <span className="text-muted">→</span>
            <span className="font-medium">{toLabel}</span>
            <span className="ml-auto text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                {link.relation}
            </span>
        </button>
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

function DrawerBadge({ children, tone = "default" }) {
    const tones = {
        default: "border-lineSoft bg-zinc-900/45 text-zinc-300",
        red: "border-danger/20 bg-danger/10 text-red-200",
        amber: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    };

    return (
        <span className={`rounded-full border px-2.5 py-1 text-xs ${tones[tone]}`}>
            {children}
        </span>
    );
}

function DrawerHeader({ eyebrow, title, subtitle, onClose }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-xs uppercase tracking-[0.24em] text-danger">
                    {eyebrow}
                </p>
                <h4 className="mt-2 text-lg font-semibold text-ink">{title}</h4>
                <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-lineSoft bg-zinc-900/45 px-3 py-2 text-xs text-zinc-300 transition hover:border-danger/20 hover:bg-danger/10"
            >
                Close
            </button>
        </div>
    );
}

function EmptyDrawerState() {
    return (
        <Motion.div
            key="empty-drawer"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.22 }}
            className="rounded-2xl border border-line/80 bg-black/20 p-4"
        >
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
                Node Details
            </p>
            <p className="mt-4 text-sm text-zinc-400">
                Select a node from the graph to inspect identity, group or asset details.
            </p>
        </Motion.div>
    );
}

function NodeDrawer({ node, onClose, groupNameMap, userNameMap }) {
    if (!node) {
        return (
            <AnimatePresence mode="wait">
                <EmptyDrawerState />
            </AnimatePresence>
        );
    }

    if (node.type === "user") {
        const user = node.raw;

        return (
            <AnimatePresence mode="wait">
                <Motion.div
                    key={`drawer-${node.id}`}
                    initial={{ opacity: 0, x: 24, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 16, scale: 0.98 }}
                    transition={{ duration: 0.24 }}
                    className="rounded-2xl border border-line/80 bg-black/20 p-4"
                >
                    <DrawerHeader
                        eyebrow="User Identity"
                        title={user.name}
                        subtitle={`@${user.username}`}
                        onClose={onClose}
                    />

                    <div className="mt-4 flex flex-wrap gap-2">
                        <StatusBadge status={user.status} />
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
                        <DrawerBadge>{user.department}</DrawerBadge>
                    </div>

                    <div className="mt-5 space-y-1">
                        <InfoRow label="Role" value={user.role} />
                        <InfoRow label="Primary Machine" value={user.machineId} />
                        <InfoRow label="Risk Score" value={`${user.riskScore}/100`} />
                    </div>

                    <div className="mt-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                            Groups
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {user.groups.map((groupId) => (
                                <DrawerBadge key={groupId}>
                                    {groupNameMap[groupId] || groupId}
                                </DrawerBadge>
                            ))}
                        </div>
                    </div>
                </Motion.div>
            </AnimatePresence>
        );
    }

    if (node.type === "group") {
        const group = node.raw;

        return (
            <AnimatePresence mode="wait">
                <Motion.div
                    key={`drawer-${node.id}`}
                    initial={{ opacity: 0, x: 24, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 16, scale: 0.98 }}
                    transition={{ duration: 0.24 }}
                    className="rounded-2xl border border-line/80 bg-black/20 p-4"
                >
                    <DrawerHeader
                        eyebrow="Access Group"
                        title={group.name}
                        subtitle="Privilege container"
                        onClose={onClose}
                    />

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
                </Motion.div>
            </AnimatePresence>
        );
    }

    const system = node.raw;

    return (
        <AnimatePresence mode="wait">
            <Motion.div
                key={`drawer-${node.id}`}
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 16, scale: 0.98 }}
                transition={{ duration: 0.24 }}
                className="rounded-2xl border border-line/80 bg-black/20 p-4"
            >
                <DrawerHeader
                    eyebrow="System Asset"
                    title={system.name}
                    subtitle={system.type}
                    onClose={onClose}
                />

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
            </Motion.div>
        </AnimatePresence>
    );
}

function filterNodes(
    nodes,
    query,
    typeFilter,
    showOnlyCompromised,
    showOnlyPrivileged
) {
    return nodes.filter((node) => {
        const matchesType = typeFilter === "all" || node.type === typeFilter;
        const haystack = `${node.label} ${node.title || ""} ${node.meta || ""}`.toLowerCase();
        const matchesQuery = haystack.includes(query.toLowerCase());
        const matchesCompromised = !showOnlyCompromised || node.compromised;
        const matchesPrivileged = !showOnlyPrivileged || node.privileged;

        return (
            matchesType &&
            matchesQuery &&
            matchesCompromised &&
            matchesPrivileged
        );
    });
}

function filterLinks(
    links,
    query,
    typeFilter,
    nodeTypeMap,
    nodeLabelMap,
    nodeLookup,
    showOnlyCompromised,
    showOnlyPrivileged
) {
    return links.filter((link) => {
        const fromType = nodeTypeMap[link.from];
        const toType = nodeTypeMap[link.to];

        const matchesType =
            typeFilter === "all" || fromType === typeFilter || toType === typeFilter;

        const fromLabel = nodeLabelMap[link.from] || link.from;
        const toLabel = nodeLabelMap[link.to] || link.to;

        const haystack = `${fromLabel} ${toLabel} ${link.relation}`.toLowerCase();
        const matchesQuery = haystack.includes(query.toLowerCase());

        const fromNode = nodeLookup[link.from];
        const toNode = nodeLookup[link.to];

        const matchesCompromised =
            !showOnlyCompromised || fromNode?.compromised || toNode?.compromised;

        const matchesPrivileged =
            !showOnlyPrivileged || fromNode?.privileged || toNode?.privileged;

        return (
            matchesType &&
            matchesQuery &&
            matchesCompromised &&
            matchesPrivileged
        );
    });
}

function CounterCard({ label, value, tone = "default" }) {
    const tones = {
        default: "border-lineSoft/60 bg-black/20 text-white",
        red: "border-danger/20 bg-danger/10 text-red-200",
        amber: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    };

    return (
        <div className={`rounded-xl border p-3 ${tones[tone]}`}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {label}
            </p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
    );
}

function ActiveFilterBadge({ children }) {
    return (
        <span className="rounded-full border border-danger/20 bg-danger/10 px-3 py-1 text-xs text-red-200">
            {children}
        </span>
    );
}

export default function AccessGraph({ users = [], groups = [], systems = [] }) {
    const { userNodes, groupNodes, systemNodes } = useMemo(
        () => buildGraphData(users, groups, systems),
        [users, groups, systems]
    );

    const allNodes = useMemo(
        () => [...userNodes, ...groupNodes, ...systemNodes],
        [userNodes, groupNodes, systemNodes]
    );

    const [selectedNode, setSelectedNode] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [showOnlyCompromised, setShowOnlyCompromised] = useState(false);
    const [showOnlyPrivileged, setShowOnlyPrivileged] = useState(false);

    const groupNameMap = useMemo(
        () => Object.fromEntries(groups.map((group) => [group.id, group.name])),
        [groups]
    );

    const userNameMap = useMemo(
        () =>
            Object.fromEntries(
                users.map((user) => [user.id, user.username || user.name])
            ),
        [users]
    );

    const nodeLabelMap = useMemo(() => {
        const userEntries = users.map((user) => [user.id, user.username || user.name]);
        const groupEntries = groups.map((group) => [group.id, group.name]);
        const systemEntries = systems.map((system) => [system.id, system.name]);

        return Object.fromEntries([...userEntries, ...groupEntries, ...systemEntries]);
    }, [users, groups, systems]);

    const nodeTypeMap = useMemo(() => {
        const userEntries = users.map((user) => [user.id, "user"]);
        const groupEntries = groups.map((group) => [group.id, "group"]);
        const systemEntries = systems.map((system) => [system.id, "system"]);

        return Object.fromEntries([...userEntries, ...groupEntries, ...systemEntries]);
    }, [users, groups, systems]);

    const nodeLookup = useMemo(() => {
        return Object.fromEntries(allNodes.map((node) => [node.id, node]));
    }, [allNodes]);

    const filteredUserNodes = useMemo(
        () =>
            filterNodes(
                userNodes,
                searchQuery,
                typeFilter,
                showOnlyCompromised,
                showOnlyPrivileged
            ),
        [userNodes, searchQuery, typeFilter, showOnlyCompromised, showOnlyPrivileged]
    );

    const filteredGroupNodes = useMemo(
        () =>
            filterNodes(
                groupNodes,
                searchQuery,
                typeFilter,
                showOnlyCompromised,
                showOnlyPrivileged
            ),
        [groupNodes, searchQuery, typeFilter, showOnlyCompromised, showOnlyPrivileged]
    );

    const filteredSystemNodes = useMemo(
        () =>
            filterNodes(
                systemNodes,
                searchQuery,
                typeFilter,
                showOnlyCompromised,
                showOnlyPrivileged
            ),
        [systemNodes, searchQuery, typeFilter, showOnlyCompromised, showOnlyPrivileged]
    );

    const filteredLinks = useMemo(
        () =>
            filterLinks(
                graphLinks,
                searchQuery,
                typeFilter,
                nodeTypeMap,
                nodeLabelMap,
                nodeLookup,
                showOnlyCompromised,
                showOnlyPrivileged
            ),
        [
            searchQuery,
            typeFilter,
            nodeTypeMap,
            nodeLabelMap,
            nodeLookup,
            showOnlyCompromised,
            showOnlyPrivileged,
        ]
    );

    const visibleNodeIds = useMemo(
        () =>
            new Set([
                ...filteredUserNodes.map((node) => node.id),
                ...filteredGroupNodes.map((node) => node.id),
                ...filteredSystemNodes.map((node) => node.id),
            ]),
        [filteredUserNodes, filteredGroupNodes, filteredSystemNodes]
    );

    useEffect(() => {
        if (selectedNode && !visibleNodeIds.has(selectedNode.id)) {
            const timeoutId = window.setTimeout(() => setSelectedNode(null), 0);
            return () => window.clearTimeout(timeoutId);
        }
    }, [selectedNode, visibleNodeIds]);

    const criticalSystems = filteredSystemNodes.filter(
        (node) => node.label === "DC-01" || node.label === "DB-SRV-01"
    );

    const hasActiveFilters =
        searchQuery.trim() !== "" ||
        typeFilter !== "all" ||
        showOnlyCompromised ||
        showOnlyPrivileged;

    const activeFilters = [
        searchQuery.trim() !== "" ? `Search: ${searchQuery}` : null,
        typeFilter !== "all" ? `Type: ${typeFilter}` : null,
        showOnlyCompromised ? "Compromised only" : null,
        showOnlyPrivileged ? "Privileged only" : null,
    ].filter(Boolean);

    const visibleNodes = [
        ...filteredUserNodes,
        ...filteredGroupNodes,
        ...filteredSystemNodes,
    ];

    const visibleCompromisedCount = visibleNodes.filter((node) => node.compromised).length;
    const visiblePrivilegedCount = visibleNodes.filter((node) => node.privileged).length;

    const handleClearFilters = () => {
        setSearchQuery("");
        setTypeFilter("all");
        setShowOnlyCompromised(false);
        setShowOnlyPrivileged(false);
    };

    const handleSelectFromRelationship = (link) => {
        const targetNode =
            allNodes.find((node) => node.id === link.to) ||
            allNodes.find((node) => node.id === link.from);

        if (!targetNode) return;

        setSelectedNode(targetNode);
        setTypeFilter(targetNode.type);
        setSearchQuery(targetNode.label || targetNode.title || "");
    };

    return (
        <Panel
            title="Identity Graph / Access Map"
            subtitle="Visual enterprise access relationships across identities, groups and critical systems."
            actions={
                <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
                    <div className="relative">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search identities, groups, systems..."
                            className="w-full rounded-xl border border-lineSoft bg-black/30 py-2 pl-9 pr-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-500 focus:border-danger/25 lg:w-72"
                        />
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-xl border border-lineSoft bg-black/30 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-danger/25"
                    >
                        <option value="all">All types</option>
                        <option value="user">Users</option>
                        <option value="group">Groups</option>
                        <option value="system">Systems</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => setShowOnlyCompromised((current) => !current)}
                        className={`rounded-xl border px-3 py-2 text-sm transition ${showOnlyCompromised
                            ? "border-danger/30 bg-danger/10 text-red-200"
                            : "border-lineSoft bg-black/30 text-zinc-200 hover:border-danger/20 hover:bg-danger/10"
                            }`}
                    >
                        {showOnlyCompromised ? "Compromised: ON" : "Show Compromised"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowOnlyPrivileged((current) => !current)}
                        className={`rounded-xl border px-3 py-2 text-sm transition ${showOnlyPrivileged
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                            : "border-lineSoft bg-black/30 text-zinc-200 hover:border-amber-500/20 hover:bg-amber-500/10"
                            }`}
                    >
                        {showOnlyPrivileged ? "Privileged Only: ON" : "Show Privileged"}
                    </button>

                    <button
                        type="button"
                        onClick={handleClearFilters}
                        disabled={!hasActiveFilters}
                        className="inline-flex items-center gap-2 rounded-xl border border-lineSoft bg-black/30 px-3 py-2 text-sm text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <X size={14} />
                        Clear Filters
                    </button>
                </div>
            }
        >
            <div className="mb-6 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                <CounterCard label="Visible Nodes" value={visibleNodes.length} />
                <CounterCard
                    label="Compromised Visible"
                    value={visibleCompromisedCount}
                    tone="red"
                />
                <CounterCard
                    label="Privileged Visible"
                    value={visiblePrivilegedCount}
                    tone="amber"
                />
                <CounterCard
                    label="Visible Relationships"
                    value={filteredLinks.length}
                />
                {activeFilters.length > 0 && (
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                            Active Filters
                        </span>
                        {activeFilters.map((filter) => (
                            <ActiveFilterBadge key={filter}>{filter}</ActiveFilterBadge>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-2xl border border-line/80 bg-black/20 p-4">
                    <div className="grid gap-6 xl:grid-cols-3">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                                    Identities
                                </p>
                                <span className="rounded-full border border-lineSoft bg-zinc-900/45 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                                    Users
                                </span>
                            </div>

                            {filteredUserNodes.length ? (
                                filteredUserNodes.map((node) => (
                                    <GraphNode
                                        key={node.id}
                                        node={node}
                                        isSelected={selectedNode?.id === node.id}
                                        onClick={setSelectedNode}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-zinc-500">No matching users</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                                    Access Control
                                </p>
                                <span className="rounded-full border border-lineSoft bg-zinc-900/45 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                                    Groups
                                </span>
                            </div>

                            {filteredGroupNodes.length ? (
                                filteredGroupNodes.map((node) => (
                                    <GraphNode
                                        key={node.id}
                                        node={node}
                                        isSelected={selectedNode?.id === node.id}
                                        onClick={setSelectedNode}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-zinc-500">No matching groups</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                                    Systems
                                </p>
                                <span className="rounded-full border border-lineSoft bg-zinc-900/45 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                                    Assets
                                </span>
                            </div>

                            {filteredSystemNodes.length ? (
                                filteredSystemNodes.map((node) => (
                                    <GraphNode
                                        key={node.id}
                                        node={node}
                                        isSelected={selectedNode?.id === node.id}
                                        onClick={setSelectedNode}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-zinc-500">No matching systems</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-danger/15 bg-gradient-to-r from-danger/10 via-transparent to-transparent p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-danger shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
                            <p className="text-sm font-medium text-red-100">
                                Compromised nodes glow red when impacted by a scenario.
                            </p>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {criticalSystems.length ? (
                                criticalSystems.map((node) => (
                                    <button
                                        type="button"
                                        key={node.id}
                                        onClick={() => setSelectedNode(node)}
                                        className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${nodeTone(node)}`}
                                    >
                                        <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                                            Crown Jewel
                                        </p>
                                        <p className="mt-2 font-semibold">{node.label}</p>
                                        <p className="mt-1 text-xs text-zinc-400">{node.meta}</p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-zinc-400">
                                    No critical systems match the current filter.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <NodeDrawer
                        node={selectedNode}
                        onClose={() => setSelectedNode(null)}
                        groupNameMap={groupNameMap}
                        userNameMap={userNameMap}
                    />

                    <div className="rounded-2xl border border-line/80 bg-black/20 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs uppercase tracking-[0.24em] text-muted">
                                Relationships
                            </p>
                            <span className="rounded-full border border-lineSoft bg-zinc-900/45 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                                {filteredLinks.length} visible
                            </span>
                        </div>

                        <div className="mt-4 max-h-[260px] space-y-3 overflow-auto pr-1 sm:max-h-[280px]">
                            {filteredLinks.length ? (
                                filteredLinks.map((link, index) => (
                                    <RelationItem
                                        key={`${link.from}-${link.to}-${index}`}
                                        link={link}
                                        nodeLabelMap={nodeLabelMap}
                                        onSelectNode={handleSelectFromRelationship}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-zinc-500">
                                    No relationships match the current search or filter.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-line/80 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-muted">
                            Legend
                        </p>

                        <div className="mt-4 space-y-3 text-sm text-zinc-300">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 rounded-full bg-white/40" />
                                <span>Standard identity or asset</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                                <span>Privileged or critical node</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.75)]" />
                                <span>Compromised node</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Panel>
    );
}
