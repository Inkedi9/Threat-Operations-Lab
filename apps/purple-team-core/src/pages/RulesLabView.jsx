import { useMemo, useState } from "react";
import {
    FileCode2,
    ShieldCheck,
    FlaskConical,
    Eye,
    Sparkles,
    Braces,
    Activity,
    FolderKanban,
} from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PageHeader from "../components/layout/PageHeader";
import RulesEditorPanel from "../components/blue/RulesEditorPanel";
import RulesLibraryPanel from "../components/blue/RulesLibraryPanel";
import PanelCard from "../components/ui/PanelCard";
import PanelHeader from "../components/ui/PanelHeader";
import MetricCard from "../components/ui/MetricCard";
import { formatCoverage } from "../lib/metricFormatters";

/* ========================================
   🧪 Initial Rules Library
======================================== */

const INITIAL_RULES = [
    {
        id: "rule_bruteforce",
        name: "Bruteforce Login Detection",
        type: "sigma",
        status: "active",
        severity: "medium",
        techniques: ["T1110"],
        scenarios: ["bruteforce"],
        author: "purple-lab",
        description: "Detects repeated failed authentication attempts indicating bruteforce.",
        content: `title: Bruteforce Login Detection
id: PTL-001
status: stable
description: Detects multiple failed authentication attempts indicating bruteforce
author: purple-lab
date: 2026/04/21

logsource:
  category: authentication
  product: windows

detection:
  selection:
    EventID: 4625
    LogonType: 3
  condition: selection | count() by TargetUserName > 5
  timeframe: 5m

falsepositives:
  - Legitimate users forgetting their password
  - Password expiry

level: medium
tags:
  - attack.credential_access
  - attack.t1110`,
        matchScore: 87,
        lastTriggered: "2026-04-21 16:43:19",
        enabled: true,
        favorite: true,
        pinned: true,
    },
    {
        id: "rule_networkscan",
        name: "Network Port Scan Detection",
        type: "sigma",
        status: "active",
        severity: "low",
        techniques: ["T1046"],
        scenarios: ["scan"],
        author: "purple-lab",
        description: "Detects SYN sweep activity indicating network reconnaissance.",
        content: `title: Network Port Scan SYN Sweep
id: PTL-002
status: stable
description: Detects SYN sweep activity indicating network reconnaissance
author: purple-lab
date: 2026/04/21

logsource:
  category: network_traffic
  product: ids

detection:
  selection:
    network.transport: tcp
    tcp.flags: SYN
    destination.port|range: [1, 1024]
  condition: selection | count() by source.ip > 50
  timeframe: 60s

falsepositives:
  - Authorized network scanners
  - Vulnerability assessment tools

level: low
tags:
  - attack.discovery
  - attack.t1046`,
        matchScore: 62,
        lastTriggered: "2026-04-21 16:43:31",
        enabled: true,
        favorite: false,
        pinned: false,
    },
    {
        id: "rule_lsass",
        name: "LSASS Memory Access",
        type: "sigma",
        status: "active",
        severity: "high",
        techniques: ["T1003"],
        scenarios: ["mimikatz"],
        author: "purple-lab",
        description: "Detects suspicious LSASS access patterns tied to credential dumping.",
        content: `title: LSASS Memory Access Suspicious
id: PTL-003
status: experimental
description: Detects suspicious memory access to LSASS process
author: purple-lab
date: 2026/04/21

logsource:
  category: process_access
  product: windows

detection:
  selection:
    TargetImage|endswith: '\\lsass.exe'
    GrantedAccess|contains:
      - '0x1010'
      - '0x1038'
      - '0x40'
      - '0x1FFFFF'
  filter_legit:
    SourceImage|startswith:
      - 'C:\\Windows\\System32\\'
      - 'C:\\Windows\\SysWOW64\\'
  condition: selection and not filter_legit

falsepositives:
  - Antivirus products accessing LSASS
  - Legitimate system tools

level: high
tags:
  - attack.credential_access
  - attack.t1003.001`,
        matchScore: 15,
        lastTriggered: "Never — MISSED",
        enabled: true,
        favorite: true,
        pinned: false,
    },
    {
        id: "rule_exfil",
        name: "Large Outbound Data Transfer",
        type: "sigma",
        status: "active",
        severity: "high",
        techniques: ["T1041"],
        scenarios: ["exfiltration"],
        author: "purple-lab",
        description: "Detects unusually large outbound transfers.",
        content: `title: Suspicious Large Outbound Transfer
id: PTL-004
status: stable
description: Detects unusually large outbound data transfers indicating exfiltration
author: purple-lab
date: 2026/04/21

logsource:
  category: network_traffic
  product: dlp

detection:
  selection:
    network.direction: outbound
    network.bytes|gte: 104857600
    destination.ip|cidr|not:
      - '10.0.0.0/8'
      - '172.16.0.0/12'
      - '192.168.0.0/16'
  condition: selection

falsepositives:
  - Authorized backup jobs
  - Cloud sync services

level: high
tags:
  - attack.exfiltration
  - attack.t1041`,
        matchScore: 72,
        lastTriggered: "2026-04-21 16:43:58",
        enabled: true,
        favorite: false,
        pinned: true,
    },
    {
        id: "rule_yara_cobalt",
        name: "Cobalt Strike Beacon",
        type: "yara",
        status: "draft",
        severity: "critical",
        techniques: ["T1071", "T1573"],
        scenarios: [],
        author: "purple-lab",
        description: "Generic YARA signature for Cobalt Strike style artifacts.",
        content: `rule CobaltStrike_Beacon_Generic {
    meta:
        description = "Detects Cobalt Strike beacon artifacts"
        author = "purple-lab"
        date = "2026-04-21"
        severity = "critical"
        technique = "T1071, T1573"

    strings:
        $header = { 4D 5A }
        $str1 = "ReflectiveLoader" ascii wide
        $str2 = "beacon.dll" ascii wide nocase
        $str3 = "%s (admin)" ascii
        $str4 = "Could not connect to pipe" ascii
        $cfg1 = { 69 68 69 68 69 6B }
        $cfg2 = { 2E 2E 2E 00 00 00 00 }
        $xor_key = { 69 ?? 69 ?? 69 }

    condition:
        $header at 0 and
        (2 of ($str*)) or
        (any of ($cfg*) and $xor_key)
}`,
        matchScore: 0,
        lastTriggered: "Never — draft",
        enabled: false,
        favorite: false,
        pinned: false,
    },
];

/* ========================================
   🧪 Rules Lab View
======================================== */

export default function RulesLabView({
    selectedScenario,
    visibleStatus,
    coverage,
    rulesLabFocus = null,
    onClearRulesLabFocus,
}) {
    const [rules, setRules] = useState(INITIAL_RULES);
    const [selectedRuleId, setSelectedRuleId] = useState(INITIAL_RULES[0].id);

    const selectedRule = useMemo(() => {
        return rules.find((rule) => rule.id === selectedRuleId) ?? rules[0] ?? null;
    }, [rules, selectedRuleId]);

    const workspaceMetrics = useMemo(() => {
        const totalRules = rules.length;
        const activeRules = rules.filter((rule) => rule.enabled).length;
        const draftRules = rules.filter((rule) => rule.status === "draft").length;

        const averageScore =
            totalRules > 0
                ? Math.round(
                    rules.reduce((sum, rule) => sum + (rule.matchScore ?? 0), 0) / totalRules
                )
                : 0;

        return {
            totalRules,
            activeRules,
            draftRules,
            averageScore,
        };
    }, [rules]);

    const headerStats = useMemo(() => {
        return [
            {
                label: "Workspace",
                value: "Rules Lab",
                icon: <FileCode2 className="h-4 w-4 text-cyber-violet" />,
            },
            {
                label: "Status",
                value: visibleStatus,
                icon: <ShieldCheck className="h-4 w-4 text-cyber-green" />,
            },
            {
                label: "Mode",
                value: "Test / Preview",
                icon: <FlaskConical className="h-4 w-4 text-cyber-blue" />,
            },
            {
                label: "Coverage",
                value: formatCoverage(coverage),
                icon: <Eye className="h-4 w-4 text-cyber-amber" />,
            },
        ];
    }, [coverage, visibleStatus]);

    const handleToggleRule = (ruleId) => {
        setRules((prev) =>
            prev.map((rule) =>
                rule.id === ruleId
                    ? {
                        ...rule,
                        enabled: !rule.enabled,
                    }
                    : rule
            )
        );
    };

    const handleToggleFavorite = (ruleId) => {
        setRules((prev) =>
            prev.map((rule) =>
                rule.id === ruleId
                    ? {
                        ...rule,
                        favorite: !rule.favorite,
                    }
                    : rule
            )
        );
    };

    const handleTogglePinned = (ruleId) => {
        setRules((prev) =>
            prev.map((rule) =>
                rule.id === ruleId
                    ? {
                        ...rule,
                        pinned: !rule.pinned,
                    }
                    : rule
            )
        );
    };

    const handleBulkEnable = (ruleIds) => {
        setRules((prev) =>
            prev.map((rule) =>
                ruleIds.includes(rule.id)
                    ? {
                        ...rule,
                        enabled: true,
                    }
                    : rule
            )
        );
    };

    const handleBulkDisable = (ruleIds) => {
        setRules((prev) =>
            prev.map((rule) =>
                ruleIds.includes(rule.id)
                    ? {
                        ...rule,
                        enabled: false,
                    }
                    : rule
            )
        );
    };

    const handleBulkDelete = (ruleIds) => {
        if (!ruleIds.length) return;

        const nextRules = rules.filter((rule) => !ruleIds.includes(rule.id));
        if (!nextRules.length) return;

        setRules(nextRules);

        if (ruleIds.includes(selectedRuleId)) {
            setSelectedRuleId(nextRules[0].id);
        }
    };

    const selectedRuleTone =
        selectedRule?.severity === "critical" || selectedRule?.severity === "high"
            ? "text-cyber-red"
            : selectedRule?.severity === "medium"
                ? "text-cyber-amber"
                : "text-cyber-blue";

    return (
        <PageShell
            leftWidth="320px"
            rightWidth="300px"
            variant="dense"
            header={
                <PageHeader
                    variant="default"
                    eyebrow="DETECTION ENGINEERING"
                    title="Rules Lab"
                    description="Design, test and preview Sigma / YARA style detection rules in a dedicated workspace built for purple team validation and analyst iteration."
                    stats={headerStats}
                />
            }
            left={
                <RulesLibraryPanel
                    rules={rules}
                    selectedRuleId={selectedRuleId}
                    onSelectRule={setSelectedRuleId}
                    onToggleRule={handleToggleRule}
                    onToggleFavorite={handleToggleFavorite}
                    onTogglePinned={handleTogglePinned}
                    onBulkEnable={handleBulkEnable}
                    onBulkDisable={handleBulkDisable}
                    onBulkDelete={handleBulkDelete}
                    focus={rulesLabFocus}
                    onClearFocus={onClearRulesLabFocus}
                />
            }
            center={
                <RulesEditorPanel
                    rules={rules}
                    setRules={setRules}
                    selectedRuleId={selectedRuleId}
                    setSelectedRuleId={setSelectedRuleId}
                    selectedRule={selectedRule}
                    selectedScenario={selectedScenario}
                    visibleStatus={visibleStatus}
                    coverage={coverage}
                />
            }
            right={
                <div className="space-y-4">
                    <PanelCard variant="intel" glow>
                        <PanelHeader
                            icon={<Sparkles className="h-5 w-5 text-cyber-blue" />}
                            title="Detection Workflow"
                            subtitle="Suggested operator loop"
                        />

                        <div className="mt-4 space-y-3">
                            <WorkflowStep
                                title="1. Select Rule"
                                text="Choose an existing rule or create a new draft to edit."
                            />
                            <WorkflowStep
                                title="2. Test Mapping"
                                text="Run the rule against a scenario and inspect match confidence."
                            />
                            <WorkflowStep
                                title="3. Preview"
                                text="Validate syntax, metadata and MITRE mapping before tuning further."
                            />
                        </div>
                    </PanelCard>

                    <PanelCard variant="signal">
                        <PanelHeader
                            icon={<FolderKanban className="h-5 w-5 text-cyber-green" />}
                            title="Workspace Snapshot"
                            subtitle="At-a-glance lab status"
                        />

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <MetricCard
                                compact
                                label="Selected"
                                value={selectedRule?.type?.toUpperCase() ?? "—"}
                                variant="glass"
                                accent="violet"
                                icon={<FileCode2 className="h-4 w-4 text-cyber-violet" />}
                            />

                            <MetricCard
                                compact
                                label="Active"
                                value={workspaceMetrics.activeRules}
                                variant="defense"
                                accent="green"
                            />

                            <MetricCard
                                compact
                                label="Draft"
                                value={workspaceMetrics.draftRules}
                                variant="signal"
                                accent="amber"
                            />

                            <MetricCard
                                compact
                                label="Avg Score"
                                value={`${workspaceMetrics.averageScore}%`}
                                variant="glass"
                                accent="red"
                            />
                        </div>
                    </PanelCard>

                    <PanelCard variant="glass">
                        <PanelHeader
                            icon={<Braces className="h-5 w-5 text-cyber-violet" />}
                            title="Engineering Notes"
                            subtitle="Selected rule context"
                        />

                        <div className="mt-4 rounded-2xl p-4 liquid-glass-soft">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-cyber-text">
                                        {selectedRule?.name ?? "No rule selected"}
                                    </p>
                                    <p className={`mt-1 text-xs font-medium uppercase tracking-wide ${selectedRuleTone}`}>
                                        {selectedRule?.severity ?? "unknown"} severity
                                    </p>
                                </div>

                                {selectedRule?.techniques?.length ? (
                                    <div className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-cyber-muted">
                                        {selectedRule.techniques[0]}
                                    </div>
                                ) : null}
                            </div>

                            <p className="mt-4 text-sm leading-6 text-cyber-muted">
                                {selectedRule?.description ??
                                    "This workspace is designed to simulate a detection engineering workflow where rules can be authored, tested against offensive scenarios, and reviewed before being considered operationally useful."}
                            </p>

                            <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-cyber-muted">
                                <InlineMeta label="Author" value={selectedRule?.author ?? "—"} />
                                <InlineMeta label="Last Triggered" value={selectedRule?.lastTriggered ?? "—"} />
                                <InlineMeta
                                    label="Scenario Mapping"
                                    value={
                                        selectedRule?.scenarios?.length
                                            ? selectedRule.scenarios.join(", ")
                                            : "No mapping yet"
                                    }
                                />
                            </div>
                        </div>
                    </PanelCard>
                </div>
            }
        />
    );
}

/* ========================================
   🧩 UI Helpers
======================================== */

function WorkflowStep({ title, text }) {
    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_8px_22px_rgba(0,0,0,0.18)] transition-all duration-200 hover:border-cyber-blue/30 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))]">
            <p className="text-sm font-semibold text-cyber-text">{title}</p>
            <p className="mt-2 text-sm leading-6 text-cyber-muted">{text}</p>
        </div>
    );
}

function InlineMeta({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2">
            <span className="uppercase tracking-wide text-[11px] text-cyber-muted">
                {label}
            </span>
            <span className="text-right text-cyber-text">
                {value}
            </span>
        </div>
    );
}