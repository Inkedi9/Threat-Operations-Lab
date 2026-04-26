import { useMemo, useState, useEffect } from "react";
import {
    Search,
    ShieldCheck,
    ShieldOff,
    SlidersHorizontal,
    ArrowUpDown,
    Star,
    Pin,
    CheckSquare,
    Square,
    Power,
    PowerOff,
    Trash2,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";
import StatusBadge, { severityClasses, statusClasses } from "../ui/StatusBadge";
import MetricBar from "../ui/MetricBar";

/* ========================================
   📚 Rules Library Panel
======================================== */

export default function RulesLibraryPanel({
    rules,
    selectedRuleId,
    onSelectRule,
    onToggleRule,
    onToggleFavorite,
    onTogglePinned,
    onBulkEnable,
    onBulkDisable,
    onBulkDelete,
    focus = null,
    onClearFocus,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [severityFilter, setSeverityFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [selectedRuleIds, setSelectedRuleIds] = useState([]);
    const [toolbarExpanded, setToolbarExpanded] = useState(false);
    const [compactMode, setCompactMode] = useState(true);

    const [sectionsOpen, setSectionsOpen] = useState({
        pinned: true,
        favorites: true,
        others: true,
    });

    useEffect(() => {
        if (!focus) return;

        if (focus.technique) {
            setSearchTerm(focus.technique);
        } else if (focus.scenarioId) {
            setSearchTerm(focus.scenarioId);
        }

        setToolbarExpanded(true);
        setSectionsOpen({
            pinned: true,
            favorites: true,
            others: true,
        });
    }, [focus]);

    const avgScore = computeAverageScore(rules);

    const filteredRules = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        const result = rules.filter((rule) => {
            const matchesSearch =
                !normalizedSearch ||
                rule.name.toLowerCase().includes(normalizedSearch) ||
                rule.description.toLowerCase().includes(normalizedSearch) ||
                rule.type.toLowerCase().includes(normalizedSearch) ||
                rule.status.toLowerCase().includes(normalizedSearch) ||
                rule.severity.toLowerCase().includes(normalizedSearch) ||
                rule.techniques.some((technique) => technique.toLowerCase().includes(normalizedSearch));

            const matchesType = typeFilter === "all" || rule.type === typeFilter;
            const matchesStatus = statusFilter === "all" || rule.status === statusFilter;
            const matchesSeverity = severityFilter === "all" || rule.severity === severityFilter;

            return matchesSearch && matchesType && matchesStatus && matchesSeverity;
        });

        return [...result].sort((a, b) => {
            switch (sortBy) {
                case "score":
                    return (b.matchScore ?? 0) - (a.matchScore ?? 0);
                case "severity":
                    return severityRank(b.severity) - severityRank(a.severity);
                case "status":
                    return a.status.localeCompare(b.status);
                case "type":
                    return a.type.localeCompare(b.type);
                case "name":
                default:
                    return a.name.localeCompare(b.name);
            }
        });
    }, [rules, searchTerm, typeFilter, statusFilter, severityFilter, sortBy]);

    const groupedRules = useMemo(() => {
        const pinnedRules = filteredRules.filter((rule) => rule.pinned);
        const favoriteRules = filteredRules.filter((rule) => !rule.pinned && rule.favorite);
        const otherRules = filteredRules.filter((rule) => !rule.pinned && !rule.favorite);

        return { pinnedRules, favoriteRules, otherRules };
    }, [filteredRules]);

    const allVisibleSelected =
        filteredRules.length > 0 &&
        filteredRules.every((rule) => selectedRuleIds.includes(rule.id));

    const selectedCount = selectedRuleIds.length;

    const toggleBulkSelection = (ruleId) => {
        setSelectedRuleIds((prev) =>
            prev.includes(ruleId) ? prev.filter((id) => id !== ruleId) : [...prev, ruleId]
        );
    };

    const toggleSelectAllVisible = () => {
        if (allVisibleSelected) {
            setSelectedRuleIds((prev) =>
                prev.filter((id) => !filteredRules.some((rule) => rule.id === id))
            );
            return;
        }

        setSelectedRuleIds((prev) => {
            const merged = new Set(prev);
            filteredRules.forEach((rule) => merged.add(rule.id));
            return [...merged];
        });
    };

    const handleBulkEnableClick = () => {
        if (!selectedRuleIds.length) return;
        onBulkEnable(selectedRuleIds);
    };

    const handleBulkDisableClick = () => {
        if (!selectedRuleIds.length) return;
        onBulkDisable(selectedRuleIds);
    };

    const handleBulkDeleteClick = () => {
        if (!selectedRuleIds.length) return;
        onBulkDelete(selectedRuleIds);
        setSelectedRuleIds([]);
    };

    const toggleSection = (key) => {
        setSectionsOpen((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <PanelCard className="flex h-[calc(100vh-13rem)] min-h-[720px] flex-col" variant="default">
            {/* ========================================
         🏷️ Header
      ======================================== */}
            <div className="mb-4">
                <PanelHeader
                    title="Rules Library"
                    subtitle="Sigma / YARA catalog for detection engineering"
                    compact
                />
            </div>

            {/* ========================================
         📊 Stats
      ======================================== */}
            <div className="mb-4 grid grid-cols-2 gap-2">
                <MiniStat label="Total Rules" value={rules.length} tone="text-cyber-violet" />
                <MiniStat
                    label="Active"
                    value={rules.filter((rule) => rule.status === "active").length}
                    tone="text-cyber-green"
                />
                <MiniStat
                    label="Draft"
                    value={rules.filter((rule) => rule.status === "draft").length}
                    tone="text-cyber-amber"
                />
                <MiniStat label="Avg Score" value={avgScore} tone="text-cyan-400" />
            </div>

            {/* ========================================
         📌 Sticky Toolbar
      ======================================== */}
            <div className="sticky top-20 z-10 mb-4 rounded-2xl border border-cyber-border bg-cyber-panel/95 p-3 backdrop-blur-xl">
                {/* Search toujours visible */}
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-muted" />
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search rules, MITRE IDs, type..."
                        className="w-full rounded-xl border border-cyber-border bg-cyber-panel px-10 py-2.5 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                    />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="text-xs uppercase tracking-wide text-cyber-muted">
                        {filteredRules.length} visible • {selectedCount} selected
                    </div>

                    <button
                        onClick={() => setToolbarExpanded((prev) => !prev)}
                        className="rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-1.5 text-[11px] font-medium text-cyber-text transition hover:border-cyber-violet/30"
                    >
                        {toolbarExpanded ? "Hide tools" : "Show tools"}
                    </button>
                </div>

                {toolbarExpanded && (
                    <div className="mt-3 space-y-3">
                        <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-3">
                            <div className="mb-3 flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-cyber-violet" />
                                <p className="text-xs uppercase tracking-wide text-cyber-muted">Filters</p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <select
                                    value={typeFilter}
                                    onChange={(event) => setTypeFilter(event.target.value)}
                                    className="w-full rounded-xl border border-cyber-border bg-cyber-panel px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                                >
                                    <option value="all">All types</option>
                                    <option value="sigma">Sigma</option>
                                    <option value="yara">YARA</option>
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    className="w-full rounded-xl border border-cyber-border bg-cyber-panel px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                                >
                                    <option value="all">All status</option>
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="disabled">Disabled</option>
                                </select>

                                <select
                                    value={severityFilter}
                                    onChange={(event) => setSeverityFilter(event.target.value)}
                                    className="w-full rounded-xl border border-cyber-border bg-cyber-panel px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                                >
                                    <option value="all">All severity</option>
                                    <option value="critical">Critical</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-3">
                            <div className="mb-3 flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4 text-cyber-blue" />
                                <p className="text-xs uppercase tracking-wide text-cyber-muted">Sort</p>
                            </div>

                            <select
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                                className="w-full rounded-xl border border-cyber-border bg-cyber-panel px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                            >
                                <option value="name">Name</option>
                                <option value="score">Match Score</option>
                                <option value="severity">Severity</option>
                                <option value="status">Status</option>
                                <option value="type">Type</option>
                            </select>
                        </div>

                        <div className="rounded-2xl border border-cyber-border bg-cyber-panel2 p-3">
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    {allVisibleSelected ? (
                                        <CheckSquare className="h-4 w-4 text-cyber-green" />
                                    ) : (
                                        <Square className="h-4 w-4 text-cyber-muted" />
                                    )}
                                    <p className="text-xs uppercase tracking-wide text-cyber-muted">Bulk Actions</p>
                                </div>

                                <button
                                    onClick={toggleSelectAllVisible}
                                    className="text-[11px] font-medium text-cyber-blue transition hover:text-white"
                                >
                                    {allVisibleSelected ? "Unselect visible" : "Select visible"}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={handleBulkEnableClick}
                                    disabled={!selectedCount}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyber-green/30 bg-cyber-green/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyber-green/20 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Power className="h-4 w-4" />
                                    Enable Selected
                                </button>

                                <button
                                    onClick={handleBulkDisableClick}
                                    disabled={!selectedCount}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyber-amber/30 bg-cyber-amber/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyber-amber/20 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <PowerOff className="h-4 w-4" />
                                    Disable Selected
                                </button>

                                <button
                                    onClick={handleBulkDeleteClick}
                                    disabled={!selectedCount}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyber-red/30 bg-cyber-red/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyber-red/20 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Selected
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {focus && (
                <PanelCard variant="intel" dense className="mb-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-cyber-muted">
                                MITRE Focus
                            </p>
                            <p className="mt-1 text-sm font-semibold text-cyber-text">
                                {focus.technique ?? focus.scenarioId}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setSearchTerm("");
                                onClearFocus?.();
                            }}
                            className="rounded-xl border border-cyber-border bg-cyber-panel px-3 py-1.5 text-[11px] font-semibold text-cyber-text transition hover:border-cyber-violet/30"
                        >
                            Clear
                        </button>
                    </div>
                </PanelCard>
            )}

            {/* ========================================
         📌 Results Summary
      ======================================== */}
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <PanelCard className="mb-4" variant="glass" dense>
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-cyber-muted">Visible Rules</p>
                            <p className="mt-1 text-sm font-semibold text-cyber-text">
                                {filteredRules.length} / {rules.length}
                            </p>
                        </div>

                        <button
                            onClick={() => setCompactMode((prev) => !prev)}
                            className="rounded-xl border border-cyber-border bg-cyber-panel px-3 py-1.5 text-[11px] font-medium text-cyber-text transition hover:border-cyber-violet/30"
                        >
                            {compactMode ? "Comfort cards" : "Compact cards"}
                        </button>
                    </div>
                </PanelCard>

                {/* ========================================
         📚 Grouped Sections
      ======================================== */}
                <div className="space-y-5">
                    <RulesGroup
                        sectionKey="pinned"
                        title="Pinned"
                        subtitle="Priority rules pinned to the top of the library"
                        rules={groupedRules.pinnedRules}
                        isOpen={sectionsOpen.pinned}
                        onToggleSection={toggleSection}
                        selectedRuleId={selectedRuleId}
                        selectedRuleIds={selectedRuleIds}
                        onSelectRule={onSelectRule}
                        onToggleRule={onToggleRule}
                        onToggleFavorite={onToggleFavorite}
                        onTogglePinned={onTogglePinned}
                        onToggleBulkSelection={toggleBulkSelection}
                        compactMode={compactMode}
                    />

                    <RulesGroup
                        sectionKey="favorites"
                        title="Favorites"
                        subtitle="Frequently used or preferred rules"
                        rules={groupedRules.favoriteRules}
                        isOpen={sectionsOpen.favorites}
                        onToggleSection={toggleSection}
                        selectedRuleId={selectedRuleId}
                        selectedRuleIds={selectedRuleIds}
                        onSelectRule={onSelectRule}
                        onToggleRule={onToggleRule}
                        onToggleFavorite={onToggleFavorite}
                        onTogglePinned={onTogglePinned}
                        onToggleBulkSelection={toggleBulkSelection}
                        compactMode={compactMode}
                    />

                    <RulesGroup
                        sectionKey="others"
                        title="Others"
                        subtitle="Remaining rules in the workspace"
                        rules={groupedRules.otherRules}
                        isOpen={sectionsOpen.others}
                        onToggleSection={toggleSection}
                        selectedRuleId={selectedRuleId}
                        selectedRuleIds={selectedRuleIds}
                        onSelectRule={onSelectRule}
                        onToggleRule={onToggleRule}
                        onToggleFavorite={onToggleFavorite}
                        onTogglePinned={onTogglePinned}
                        onToggleBulkSelection={toggleBulkSelection}
                        compactMode={compactMode}
                    />
                </div>
            </div>
        </PanelCard>
    );
}

/* ========================================
   📦 Rules Group
======================================== */

function RulesGroup({
    sectionKey,
    title,
    subtitle,
    rules,
    isOpen,
    onToggleSection,
    selectedRuleId,
    selectedRuleIds,
    onSelectRule,
    onToggleRule,
    onToggleFavorite,
    onTogglePinned,
    onToggleBulkSelection,
    compactMode,
}) {
    if (!rules.length) return null;

    return (
        <div>
            <button
                onClick={() => onToggleSection(sectionKey)}
                className="mb-2 w-full text-left"
            >
                <PanelCard variant="glass" dense className="transition hover:border-cyber-violet/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-cyber-text">{title}</p>
                            <p className="mt-0.5 text-[11px] text-cyber-muted">{subtitle}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="rounded-lg border border-cyber-border bg-cyber-panel px-2 py-1 text-[10px] font-medium text-cyber-muted">
                                {rules.length}
                            </span>

                            {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-cyber-muted" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-cyber-muted" />
                            )}
                        </div>
                    </div>
                </PanelCard>
            </button>

            {isOpen && (
                <div className="space-y-2">
                    {rules.map((rule) => {
                        const selected = rule.id === selectedRuleId;
                        const bulkSelected = selectedRuleIds.includes(rule.id);

                        return (
                            <PanelCard
                                key={rule.id}
                                dense
                                variant={selected ? "elevated" : "default"}
                                className={`${compactMode ? "p-2.5" : "p-3"
                                    } ${selected
                                        ? "border-cyber-violet/30 shadow-[0_0_16px_rgba(139,92,246,0.10)]"
                                        : "hover:-translate-y-[1px] hover:border-cyber-violet/30"
                                    }`}
                            >
                                <div className="mb-2 flex items-start justify-between gap-2">
                                    <div className="flex min-w-0 flex-1 items-start gap-2">
                                        <button
                                            onClick={() => onToggleBulkSelection(rule.id)}
                                            className="mt-0.5 shrink-0 text-cyber-muted transition hover:text-white"
                                        >
                                            {bulkSelected ? (
                                                <CheckSquare className="h-4 w-4 text-cyber-green" />
                                            ) : (
                                                <Square className="h-4 w-4" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() => onSelectRule(rule.id)}
                                            className="min-w-0 flex-1 text-left"
                                        >
                                            <div className="mb-1 flex items-center gap-1.5">
                                                {rule.pinned && <Pin className="h-3.5 w-3.5 text-cyber-amber" />}
                                                {rule.favorite && (
                                                    <Star className="h-3.5 w-3.5 fill-cyber-violet text-cyber-violet" />
                                                )}
                                                <p
                                                    className={`truncate text-sm font-semibold ${selected ? "text-cyber-violet" : "text-cyber-text"
                                                        }`}
                                                >
                                                    {rule.name}
                                                </p>
                                            </div>
                                            <p className={`${compactMode ? "line-clamp-1" : "line-clamp-2"} text-[11px] text-cyber-muted`}>
                                                {rule.description}</p>
                                        </button>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => onTogglePinned(rule.id)}
                                            className={`rounded-lg border p-1 transition ${rule.pinned
                                                ? "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber"
                                                : "border-cyber-border bg-cyber-panel/70 text-cyber-muted hover:text-white"
                                                }`}
                                        >
                                            <Pin className="h-3.5 w-3.5" />
                                        </button>

                                        <button
                                            onClick={() => onToggleFavorite(rule.id)}
                                            className={`rounded-lg border p-1 transition ${rule.favorite
                                                ? "border-cyber-violet/30 bg-cyber-violet/10 text-cyber-violet"
                                                : "border-cyber-border bg-cyber-panel/70 text-cyber-muted hover:text-white"
                                                }`}
                                        >
                                            <Star className={`h-3.5 w-3.5 ${rule.favorite ? "fill-cyber-violet" : ""}`} />
                                        </button>

                                        <button
                                            onClick={() => onToggleRule(rule.id)}
                                            className={`inline-flex items-center gap-1 rounded-lg border px-1.5 py-1 text-[10px] transition ${rule.enabled
                                                ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
                                                : "border-cyber-border bg-cyber-panel/70 text-cyber-muted"
                                                }`}
                                        >
                                            {rule.enabled ? (
                                                <>
                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                    On
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldOff className="h-3.5 w-3.5" />
                                                    Off
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <StatusBadge kind="ruleType" value={rule.type} className="px-1.5 py-0.5 text-[9px]" />
                                    <StatusBadge kind="status" value={rule.status} className="px-1.5 py-0.5 text-[9px]" />
                                    <StatusBadge kind="severity" value={rule.severity} className="px-1.5 py-0.5 text-[9px]" />
                                </div>

                                {rule.matchScore > 0 && (
                                    <MetricBar
                                        value={rule.matchScore}
                                        showValue
                                        size="sm"
                                        tone="auto"
                                    />
                                )}
                            </PanelCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ========================================
   🧩 Small UI
======================================== */

function MiniStat({ label, value, tone = "text-cyber-text" }) {
    return (
        <PanelCard dense variant="glass" className="text-center">
            <p className="text-[10px] uppercase tracking-wide text-cyber-muted">{label}</p>
            <p className={`mt-1 text-lg font-bold ${tone}`}>{value}</p>
        </PanelCard>
    );
}

/* ========================================
   🎨 Tones
======================================== */

function computeAverageScore(rules) {
    const valid = rules.filter((rule) => rule.matchScore > 0);
    if (!valid.length) return "0%";
    return `${Math.round(valid.reduce((sum, rule) => sum + rule.matchScore, 0) / valid.length)}%`;
}

function severityRank(severity) {
    switch (severity) {
        case "critical":
            return 4;
        case "high":
            return 3;
        case "medium":
            return 2;
        case "low":
            return 1;
        default:
            return 0;
    }
}