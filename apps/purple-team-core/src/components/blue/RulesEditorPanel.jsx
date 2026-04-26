import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
    Save,
    RotateCcw,
    Eye,
    Pencil,
    Plus,
    Upload,
    Download,
    X,
    Copy,
    Trash2,
    PenSquare,
    Code2,
    Play,
    Radar,
    CheckCircle2,
    AlertTriangle,
    Info,
} from "lucide-react";

/* UI */
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";
import MetricCard from "../ui/MetricCard";
import StatusBadge, { severityClasses, statusClasses } from "../ui/StatusBadge";
import ConsoleShell from "../ui/ConsoleShell";
import EmptyState from "../ui/EmptyState";
import MetricBar from "../ui/MetricBar";

/* Lib */
import { formatCoverage, formatCount } from "../../lib/metricFormatters";

/* ========================================
   🧪 Test Scenarios
======================================== */

const TEST_SCENARIOS = [
    {
        id: "bruteforce",
        name: "Bruteforce Login",
        tech: "T1110",
        events: [
            "EventID=4625 TargetUserName=admin LogonType=3 SourceIP=185.220.101.x",
            "EventID=4625 TargetUserName=admin LogonType=3 SourceIP=185.220.101.x",
            "EventID=4625 TargetUserName=admin LogonType=3 SourceIP=185.220.101.x",
            "EventID=4625 TargetUserName=admin LogonType=3 SourceIP=185.220.101.x",
            "EventID=4625 TargetUserName=admin LogonType=3 SourceIP=185.220.101.x",
            "EventID=4625 TargetUserName=admin LogonType=3 SourceIP=185.220.101.x — THRESHOLD EXCEEDED",
        ],
    },
    {
        id: "scan",
        name: "Network Scan",
        tech: "T1046",
        events: [
            "SRC=185.220.101.x DST=192.168.0.1 TCP FLAGS=SYN DPT=22",
            "SRC=185.220.101.x DST=192.168.0.1 TCP FLAGS=SYN DPT=80",
            "SRC=185.220.101.x DST=192.168.0.2 TCP FLAGS=SYN DPT=443",
            "SRC=185.220.101.x — 57 SYN packets in 60s — THRESHOLD",
        ],
    },
    {
        id: "mimikatz",
        name: "Credential Dumping",
        tech: "T1003",
        events: [
            "SourceImage=C:\\Windows\\Temp\\payload.exe TargetImage=lsass.exe GrantedAccess=0x1FFFFF",
            "ALERT: lsass.exe memory read — GrantedAccess=FULL — NO EDR RULE MATCHED",
        ],
    },
    {
        id: "exfiltration",
        name: "Data Exfiltration",
        tech: "T1041",
        events: [
            "direction=outbound bytes=148897856 dst=185.220.101.x:443 proto=HTTPS",
            "DLP: transfer > 100MB to external IP — ALERT TRIGGERED",
        ],
    },
];

/* ========================================
   🛡️ Rules Editor Panel
======================================== */

export default function RulesEditorPanel({
    rules,
    setRules,
    selectedRuleId,
    setSelectedRuleId,
    selectedRule,
    selectedScenario,
    visibleStatus,
    coverage,
}) {
    const fileInputRef = useRef(null);
    const testLogRef = useRef(null);
    const testTimeoutsRef = useRef([]);
    const importMessageTimeoutRef = useRef(null);

    const [activeTab, setActiveTab] = useState("editor");
    const [editorContent, setEditorContent] = useState(selectedRule?.content ?? "");
    const [isDirty, setIsDirty] = useState(false);

    const [testScenarioId, setTestScenarioId] = useState(TEST_SCENARIOS[0].id);
    const [testRunning, setTestRunning] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [testLog, setTestLog] = useState([]);

    const [importMessage, setImportMessage] = useState(null);

    const [showNewRuleModal, setShowNewRuleModal] = useState(false);
    const [newRuleForm, setNewRuleForm] = useState({
        name: "",
        type: "sigma",
        severity: "medium",
        author: "analyst",
        description: "",
    });

    const [showRenameModal, setShowRenameModal] = useState(false);
    const [renameValue, setRenameValue] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const selectedTestScenario = useMemo(() => {
        return TEST_SCENARIOS.find((scenario) => scenario.id === testScenarioId) ?? TEST_SCENARIOS[0];
    }, [testScenarioId]);

    const mappedScenarioCount = selectedRule?.scenarios?.length ?? 0;
    const scenarioMappedToRule = selectedRule?.scenarios?.includes(testScenarioId) ?? false;

    const avgScore = useMemo(() => {
        const valid = rules.filter((rule) => rule.matchScore > 0);
        if (!valid.length) return "0%";

        return `${Math.round(
            valid.reduce((sum, rule) => sum + rule.matchScore, 0) / valid.length
        )}%`;
    }, [rules]);

    const highlightedPreview = useMemo(() => {
        return highlightRuleContent(editorContent, selectedRule?.type);
    }, [editorContent, selectedRule?.type]);

    const previewTone = getPreviewTone(selectedRule?.severity);

    const previewContextLine = useMemo(() => {
        const scenarioName = selectedScenario?.name ?? "No scenario";
        return `Active simulation context: ${scenarioName} — status ${visibleStatus} — coverage ${formatCoverage(
            coverage
        )}`;
    }, [coverage, selectedScenario, visibleStatus]);

    useEffect(() => {
        if (testLogRef.current) {
            testLogRef.current.scrollTop = testLogRef.current.scrollHeight;
        }
    }, [testLog]);

    useEffect(() => {
        return () => {
            testTimeoutsRef.current.forEach(clearTimeout);
            if (importMessageTimeoutRef.current) {
                clearTimeout(importMessageTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!selectedRule) return;

        clearTestState();
        setEditorContent(selectedRule.content ?? "");
        setIsDirty(false);

        if (selectedRule.scenarios?.length) {
            setTestScenarioId(selectedRule.scenarios[0]);
        } else {
            setTestScenarioId(TEST_SCENARIOS[0].id);
        }
    }, [selectedRuleId, selectedRule]);

    useEffect(() => {
        if (!importMessage) return;

        if (importMessageTimeoutRef.current) {
            clearTimeout(importMessageTimeoutRef.current);
        }

        importMessageTimeoutRef.current = setTimeout(() => {
            setImportMessage(null);
        }, 4000);
    }, [importMessage]);

    if (!selectedRule) {
        return (
            <PanelCard variant="default">
                <EmptyState
                    title="No rule selected"
                    description="Choose a rule from the library to edit, test and preview its detection logic."
                    compact
                />
            </PanelCard>
        );
    }

    const handleEdit = (event) => {
        setEditorContent(event.target.value);
        setIsDirty(true);
    };

    const saveRule = () => {
        setRules((prev) =>
            prev.map((rule) =>
                rule.id === selectedRuleId
                    ? {
                        ...rule,
                        content: editorContent,
                    }
                    : rule
            )
        );

        setIsDirty(false);
    };

    const revertRule = () => {
        setEditorContent(selectedRule.content);
        setIsDirty(false);
    };

    const createNewRule = () => {
        const trimmedName = newRuleForm.name.trim();
        if (!trimmedName) return;

        const newId = `rule_custom_${Date.now()}`;
        const template =
            newRuleForm.type === "yara"
                ? `rule ${sanitizeRuleName(trimmedName)} {
    meta:
        description = "${newRuleForm.description || "Custom YARA detection rule"}"
        author = "${newRuleForm.author || "analyst"}"
        severity = "${newRuleForm.severity}"

    strings:
        $s1 = "example"

    condition:
        $s1
}`
                : `title: ${trimmedName}
id: ${newId}
status: experimental
description: ${newRuleForm.description || "Custom Sigma detection rule"}
author: ${newRuleForm.author || "analyst"}
date: 2026/04/21

logsource:
  category:
  product:

detection:
  selection:
    EventID:
  condition: selection

level: ${newRuleForm.severity}
tags:
  - attack.`;

        const newRule = {
            id: newId,
            name: trimmedName,
            type: newRuleForm.type,
            status: "draft",
            severity: newRuleForm.severity,
            techniques: [],
            scenarios: [],
            author: newRuleForm.author || "analyst",
            description: newRuleForm.description || "Custom detection rule",
            content: template,
            matchScore: 0,
            lastTriggered: "Never",
            enabled: false,
            favorite: false,
            pinned: false,
        };

        setRules((prev) => [...prev, newRule]);
        setSelectedRuleId(newId);
        setActiveTab("editor");
        setShowNewRuleModal(false);
        setNewRuleForm({
            name: "",
            type: "sigma",
            severity: "medium",
            author: "analyst",
            description: "",
        });

        setImportMessage({
            type: "success",
            text: `New rule "${trimmedName}" created.`,
        });
    };

    const openRenameModal = () => {
        setRenameValue(selectedRule.name);
        setShowRenameModal(true);
    };

    const renameRule = () => {
        const trimmed = renameValue.trim();
        if (!trimmed) return;

        setRules((prev) =>
            prev.map((rule) =>
                rule.id === selectedRuleId
                    ? {
                        ...rule,
                        name: trimmed,
                    }
                    : rule
            )
        );

        setShowRenameModal(false);
        setImportMessage({
            type: "success",
            text: `Rule renamed to "${trimmed}".`,
        });
    };

    const duplicateRule = () => {
        const duplicatedId = `rule_copy_${Date.now()}`;
        const duplicatedRule = {
            ...selectedRule,
            id: duplicatedId,
            name: `${selectedRule.name} Copy`,
            status: "draft",
            enabled: false,
            lastTriggered: "Never",
            favorite: false,
            pinned: false,
        };

        setRules((prev) => [...prev, duplicatedRule]);
        setSelectedRuleId(duplicatedId);
        setActiveTab("editor");

        setImportMessage({
            type: "success",
            text: `Rule duplicated from "${selectedRule.name}".`,
        });
    };

    const deleteRule = () => {
        if (rules.length <= 1) {
            setImportMessage({
                type: "error",
                text: "At least one rule must remain in the workspace.",
            });
            setShowDeleteModal(false);
            return;
        }

        const currentIndex = rules.findIndex((rule) => rule.id === selectedRuleId);
        const filtered = rules.filter((rule) => rule.id !== selectedRuleId);
        const fallbackRule =
            filtered[Math.max(0, Math.min(currentIndex - 1, filtered.length - 1))] ?? filtered[0];

        setRules(filtered);
        setSelectedRuleId(fallbackRule.id);
        setActiveTab("editor");
        setShowDeleteModal(false);

        setImportMessage({
            type: "success",
            text: `Rule "${selectedRule.name}" deleted.`,
        });
    };

    const runTest = () => {
        clearTestState(true);

        setTestRunning(true);
        setTestResult(null);
        setTestLog([]);

        const ruleMatch = selectedRule.scenarios.includes(testScenarioId) && selectedRule.enabled;
        const score = ruleMatch ? selectedRule.matchScore : 0;

        const logs = [
            {
                delay: 0,
                text: `$ rule.test --rule="${selectedRule.name}" --scenario=${selectedTestScenario.id}`,
                type: "cmd",
            },
            {
                delay: 350,
                text: `Loading rule: ${selectedRule.name} [${selectedRule.type.toUpperCase()}]`,
                type: "info",
            },
            {
                delay: 700,
                text: `Injecting ${selectedTestScenario.events.length} events from scenario ${selectedTestScenario.name}...`,
                type: "info",
            },
            ...selectedTestScenario.events.map((line, index) => ({
                delay: 1100 + index * 260,
                text: `[EVT] ${line}`,
                type: line.includes("ALERT") || line.includes("THRESHOLD")
                    ? "ok"
                    : line.includes("MISSED")
                        ? "err"
                        : "data",
            })),
            {
                delay: 1100 + selectedTestScenario.events.length * 260 + 180,
                text: ruleMatch
                    ? `✓ MATCH — rule triggered on ${selectedTestScenario.name} — confidence: ${score}%`
                    : `✕ NO MATCH — rule did not trigger on ${selectedTestScenario.name}`,
                type: ruleMatch ? "ok" : "err",
            },
            {
                delay: 1100 + selectedTestScenario.events.length * 260 + 500,
                text: `Test complete — score: ${score}% — false positives: ${ruleMatch ? "low" : "N/A"}`,
                type: "info",
            },
        ];

        logs.forEach((item) => {
            const timeoutId = setTimeout(() => {
                setTestLog((prev) => [...prev, { text: item.text, type: item.type }]);

                if (item.text.startsWith("Test complete")) {
                    setTestRunning(false);
                    setTestResult({
                        matched: ruleMatch,
                        score,
                        scenario: selectedTestScenario.name,
                    });
                }
            }, item.delay);

            testTimeoutsRef.current.push(timeoutId);
        });
    };

    const exportRules = () => {
        const payload = {
            exportedAt: new Date().toISOString(),
            workspace: "purple-team-lab-rules",
            count: rules.length,
            rules,
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "purple-team-lab-rules.json";
        anchor.click();

        URL.revokeObjectURL(url);

        setImportMessage({
            type: "success",
            text: "Rules exported successfully.",
        });
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            const importedRules = Array.isArray(parsed)
                ? parsed
                : Array.isArray(parsed.rules)
                    ? parsed.rules
                    : null;

            if (!importedRules) {
                throw new Error("Invalid rules file format.");
            }

            const normalizedRules = importedRules
                .map(normalizeImportedRule)
                .filter(Boolean);

            if (!normalizedRules.length) {
                throw new Error("No valid rules found in file.");
            }

            setRules((prev) => {
                const merged = [...prev];

                normalizedRules.forEach((incomingRule) => {
                    const existingIndex = merged.findIndex((rule) => rule.id === incomingRule.id);
                    if (existingIndex >= 0) {
                        merged[existingIndex] = incomingRule;
                    } else {
                        merged.push(incomingRule);
                    }
                });

                return merged;
            });

            setSelectedRuleId(normalizedRules[0].id);
            setActiveTab("editor");

            setImportMessage({
                type: "success",
                text: `${normalizedRules.length} rule(s) imported successfully.`,
            });
        } catch (error) {
            setImportMessage({
                type: "error",
                text: error.message || "Import failed.",
            });
        } finally {
            event.target.value = "";
        }
    };

    function clearTestState(keepBuffers = false) {
        testTimeoutsRef.current.forEach(clearTimeout);
        testTimeoutsRef.current = [];
        setTestRunning(false);
        setTestResult(null);

        if (!keepBuffers) {
            setTestLog([]);
        }
    }

    return (
        <>
            <PanelCard variant="default">
                <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <PanelHeader
                        title="Detection Rules Workspace"
                        subtitle="Sigma / YARA editor, test execution and preview inspection"
                    />

                    <div className="flex flex-wrap gap-2">
                        <ActionButton
                            icon={Plus}
                            onClick={() => setShowNewRuleModal(true)}
                            tone="violet"
                        >
                            New Rule
                        </ActionButton>

                        <ActionButton
                            icon={Upload}
                            onClick={handleImportClick}
                            tone="blue"
                        >
                            Import
                        </ActionButton>

                        <ActionButton
                            icon={Download}
                            onClick={exportRules}
                            tone="amber"
                        >
                            Export
                        </ActionButton>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            className="hidden"
                            onChange={handleImportFile}
                        />
                    </div>
                </div>

                {importMessage && (
                    <InlineNotice
                        type={importMessage.type}
                        onDismiss={() => setImportMessage(null)}
                    >
                        {importMessage.text}
                    </InlineNotice>
                )}

                <div className="mb-4 grid grid-cols-2 gap-2 xl:grid-cols-4">
                    <MetricCard
                        label="Selected Rule"
                        value={selectedRule.type.toUpperCase()}
                        tone="text-cyber-violet"
                        compact
                    />
                    <MetricCard
                        label="Workspace Rules"
                        value={formatCount(rules.length)}
                        tone="text-cyber-green"
                        compact
                    />
                    <MetricCard
                        label="Avg Score"
                        value={avgScore}
                        tone="text-cyan-400"
                        compact
                    />
                    <MetricCard
                        label="Coverage"
                        value={formatCoverage(coverage)}
                        tone="text-cyber-amber"
                        compact
                    />
                </div>

                <div className="min-w-0 space-y-4">
                    <PanelCard variant="glass" dense>
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge kind="ruleType" value={selectedRule.type} className="px-2 py-1 text-[10px]" />
                            <span className="text-sm font-semibold text-cyber-text">{selectedRule.name}</span>
                            <StatusBadge kind="status" value={selectedRule.status} className="px-2 py-1 text-[10px]" />
                            <StatusBadge kind="severity" value={selectedRule.severity} className="px-2 py-1 text-[10px]" />

                            {isDirty && (
                                <span className="rounded-lg border border-cyber-amber/30 bg-cyber-amber/10 px-2 py-1 text-[10px] font-medium text-cyber-amber">
                                    ● unsaved
                                </span>
                            )}
                        </div>
                    </PanelCard>

                    <PanelCard variant="glass" dense>
                        <div className="flex flex-wrap gap-2">
                            <ActionButton icon={PenSquare} onClick={openRenameModal} tone="blue" size="sm">
                                Rename
                            </ActionButton>

                            <ActionButton icon={Copy} onClick={duplicateRule} tone="violet" size="sm">
                                Duplicate
                            </ActionButton>

                            <ActionButton
                                icon={Trash2}
                                onClick={() => setShowDeleteModal(true)}
                                tone="red"
                                size="sm"
                            >
                                Delete
                            </ActionButton>
                        </div>
                    </PanelCard>

                    <PanelCard variant="glass" dense padded={false}>
                        <div className="flex gap-2 p-1">
                            {[
                                { id: "editor", label: "Editor", icon: <Pencil className="h-4 w-4" /> },
                                { id: "test", label: "Test", icon: <Code2 className="h-4 w-4" /> },
                                { id: "preview", label: "Preview", icon: <Eye className="h-4 w-4" /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${activeTab === tab.id
                                        ? "border border-cyber-violet/30 bg-cyber-violet/10 text-white shadow-[0_0_12px_rgba(139,92,246,0.22)]"
                                        : "border border-transparent text-cyber-muted hover:text-white"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </PanelCard>

                    {activeTab === "editor" && (
                        <div className="space-y-3">
                            <ConsoleEditor
                                fileName={`${selectedRule.name}.${selectedRule.type}`}
                                content={editorContent}
                                onChange={handleEdit}
                                readOnly={false}
                            />

                            <div className="flex flex-wrap gap-3">
                                <ActionButton
                                    icon={Save}
                                    onClick={saveRule}
                                    disabled={!isDirty}
                                    tone="violet"
                                    size="md"
                                >
                                    {isDirty ? "Save Rule" : "Saved"}
                                </ActionButton>

                                <ActionButton
                                    icon={RotateCcw}
                                    onClick={revertRule}
                                    disabled={!isDirty}
                                    tone="neutral"
                                    size="md"
                                >
                                    Revert
                                </ActionButton>
                            </div>
                        </div>
                    )}

                    {activeTab === "test" && (
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                            <div className="space-y-4">
                                <PanelCard variant={testRunning ? "signal" : "default"}>
                                    <PanelHeader
                                        title="Scenario Test Bench"
                                        subtitle="Select a scenario and inspect live match confidence"
                                        compact
                                    />

                                    <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <MiniMeta
                                                label="Rule Mapping"
                                                value={scenarioMappedToRule ? "Mapped" : "Not mapped"}
                                                tone={scenarioMappedToRule ? "text-cyber-green" : "text-cyber-amber"}
                                            />
                                            <MiniMeta
                                                label="Mapped Scenarios"
                                                value={mappedScenarioCount}
                                                tone="text-cyber-blue"
                                            />
                                            <MiniMeta
                                                label="Technique"
                                                value={selectedTestScenario.tech}
                                                tone="text-cyber-violet"
                                            />
                                            <MiniMeta
                                                label="Events"
                                                value={selectedTestScenario.events.length}
                                                tone="text-cyber-text"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {TEST_SCENARIOS.map((scenario) => {
                                            const selected = scenario.id === testScenarioId;
                                            const mapped = selectedRule.scenarios.includes(scenario.id);

                                            return (
                                                <button
                                                    key={scenario.id}
                                                    onClick={() => {
                                                        setTestScenarioId(scenario.id);
                                                        setTestResult(null);
                                                        setTestLog([]);
                                                    }}
                                                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected
                                                        ? "border-cyber-blue/30 bg-cyber-blue/10"
                                                        : "border-cyber-border bg-cyber-panel/70 hover:border-cyber-blue/30"
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full ${mapped ? "bg-cyber-green" : "bg-cyber-muted"
                                                            }`}
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={`text-sm font-medium ${selected ? "text-cyber-blue" : "text-cyber-text"
                                                                }`}
                                                        >
                                                            {scenario.name}
                                                        </p>
                                                        <p className="text-xs text-cyber-muted">{scenario.tech}</p>
                                                    </div>

                                                    {mapped && (
                                                        <span className="rounded-lg border border-cyber-green/30 bg-cyber-green/10 px-2 py-1 text-[10px] font-medium text-cyber-green">
                                                            mapped
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </PanelCard>

                                <ActionButton
                                    icon={Play}
                                    onClick={runTest}
                                    disabled={testRunning}
                                    tone="blue"
                                    fullWidth
                                    size="lg"
                                >
                                    {testRunning ? "Running test..." : "Run Test"}
                                </ActionButton>

                                {testResult ? (
                                    <PanelCard
                                        variant={testRunning.matched ? "signal" : "critical"}
                                        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${testRunning
                                            ? "border-cyber-blue/40 bg-cyber-blue/15 shadow-[0_0_24px_rgba(59,130,246,0.18)]"
                                            : "border-cyber-blue/30 bg-cyber-blue/10 hover:bg-cyber-blue/20"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`mt-0.5 ${testResult.matched ? "text-cyber-green" : "text-cyber-red"
                                                    }`}
                                            >
                                                {testResult.matched ? (
                                                    <CheckCircle2 className="h-5 w-5" />
                                                ) : (
                                                    <AlertTriangle className="h-5 w-5" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`text-sm font-semibold ${testResult.matched ? "text-cyber-green" : "text-cyber-red"
                                                        }`}
                                                >
                                                    {testResult.matched ? "✓ MATCH" : "✕ NO MATCH"}
                                                </p>

                                                <p className="mt-2 text-sm text-cyber-text">
                                                    {selectedRule.name} vs {testResult.scenario}
                                                </p>

                                                <div className="mt-3">
                                                    <div className="mb-1 flex items-center justify-between text-xs text-cyber-muted">
                                                        <span>Confidence score</span>
                                                    </div>

                                                    <MetricBar
                                                        value={testResult.score}
                                                        showValue
                                                        size="md"
                                                        tone="auto"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </PanelCard>
                                ) : (
                                    <PanelCard variant="glass">
                                        <PanelHeader
                                            icon={<Info className="h-4 w-4 text-cyber-blue" />}
                                            title="Test Readiness"
                                            subtitle="Quick execution hint"
                                            compact
                                        />

                                        <p className="mt-3 text-sm leading-6 text-cyber-muted">
                                            {scenarioMappedToRule
                                                ? "This scenario is already mapped to the selected rule. Run the test to inspect streaming events and confidence."
                                                : "This scenario is not mapped to the selected rule. You can still run the test to validate the gap and inspect why no match occurs."}
                                        </p>
                                    </PanelCard>
                                )}
                            </div>

                            <ConsoleLog
                                ref={testLogRef}
                                title="rule.test — event stream"
                                lines={testLog}
                                variant="simulation"
                                emptyText="Launch a rule test to stream matching events and simulated console output."
                                live={testRunning}
                            />
                        </div>
                    )}

                    {activeTab === "preview" && (
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                            <PreviewConsole
                                fileName={`${selectedRule.name}.${selectedRule.type}`}
                                html={highlightedPreview}
                            />

                            <div className="space-y-4">
                                <PanelCard variant="default">
                                    <PanelHeader
                                        title="Rule Metadata"
                                        subtitle="Current rule snapshot"
                                        compact
                                    />

                                    <div className="mt-3 space-y-2">
                                        <PreviewMetaRow label="Author" value={selectedRule.author} />
                                        <PreviewMetaRow label="Type" value={selectedRule.type.toUpperCase()} />
                                        <PreviewMetaRow label="Status" value={selectedRule.status} />
                                        <PreviewMetaRow label="Severity" value={selectedRule.severity} />
                                        <PreviewMetaRow label="Last Match" value={selectedRule.lastTriggered} />
                                        <PreviewMetaRow
                                            label="Match Score"
                                            value={selectedRule.matchScore > 0 ? `${selectedRule.matchScore}%` : "N/A"}
                                        />
                                    </div>
                                </PanelCard>

                                <PanelCard variant="glass" className={previewTone}>
                                    <PanelHeader
                                        title="MITRE Techniques"
                                        subtitle="Mapped attack references"
                                        compact
                                    />

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {selectedRule.techniques.length > 0 ? (
                                            selectedRule.techniques.map((technique) => (
                                                <span
                                                    key={technique}
                                                    className="rounded-lg border border-cyber-violet/40 bg-cyber-violet/15 px-2.5 py-1 text-[10px] font-semibold text-cyber-violet shadow-[0_0_10px_rgba(139,92,246,0.18)]"
                                                >
                                                    {technique}
                                                </span>
                                            ))
                                        ) : (
                                            <EmptyState
                                                compact
                                                title="No mapped techniques"
                                                description="Add MITRE references to improve validation and rule review quality."
                                            />
                                        )}
                                    </div>
                                </PanelCard>

                                <PanelCard variant="default">
                                    <PanelHeader
                                        title="Covered Scenarios"
                                        subtitle="Scenario coverage linked to this rule"
                                        compact
                                    />

                                    <div className="mt-3 space-y-2">
                                        {selectedRule.scenarios.length > 0 ? (
                                            selectedRule.scenarios.map((scenarioId) => {
                                                const scenario = TEST_SCENARIOS.find((item) => item.id === scenarioId);

                                                return (
                                                    <div
                                                        key={scenarioId}
                                                        className="flex items-center gap-2 text-sm text-cyber-green"
                                                    >
                                                        <span className="text-cyber-green">✓</span>
                                                        <span className="font-medium">
                                                            {scenario?.name ?? scenarioId}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <EmptyState
                                                compact
                                                title="No mapped scenarios"
                                                description="Link this rule to one or more scenarios to improve testability and preview context."
                                            />
                                        )}
                                    </div>
                                </PanelCard>

                                <PanelCard variant="glass" className={previewTone}>
                                    <PanelHeader
                                        title="Context"
                                        subtitle="Validation environment"
                                        compact
                                    />

                                    <div className="mt-3 rounded-2xl border border-white/[0.06] bg-black/10 p-3">
                                        <p className="text-sm leading-6 text-cyber-muted">
                                            {previewContextLine}
                                        </p>
                                    </div>
                                </PanelCard>
                            </div>
                        </div>
                    )}
                </div>

                <style>{`
          .rule-preview .hl-key { color: #8b5cf6; }
          .rule-preview .hl-string { color: #fbbf24; }
          .rule-preview .hl-bool { color: #ef4444; }
          .rule-preview .hl-comment { color: #64748b; font-style: italic; }
          .rule-preview .hl-list { color: #f59e0b; }
          .rule-preview .hl-var { color: #c084fc; }
          .rule-preview .hl-keyword { color: #fb7185; font-weight: 600; }
          .rule-preview .hl-hex { color: #f59e0b; }
        `}</style>
            </PanelCard>

            {showNewRuleModal && (
                <NewRuleModal
                    form={newRuleForm}
                    setForm={setNewRuleForm}
                    onClose={() => setShowNewRuleModal(false)}
                    onCreate={createNewRule}
                />
            )}

            {showRenameModal && (
                <RenameRuleModal
                    value={renameValue}
                    setValue={setRenameValue}
                    onClose={() => setShowRenameModal(false)}
                    onConfirm={renameRule}
                />
            )}

            {showDeleteModal && (
                <DeleteRuleModal
                    ruleName={selectedRule.name}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={deleteRule}
                />
            )}
        </>
    );
}

/* ========================================
   🧩 Modals
======================================== */

function NewRuleModal({ form, setForm, onClose, onCreate }) {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-3xl border border-cyber-border bg-cyber-panel p-5 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-lg font-semibold text-cyber-text">Create New Rule</p>
                        <p className="mt-1 text-sm text-cyber-muted">
                            Initialize a new Sigma or YARA style detection rule.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl border border-cyber-border bg-cyber-panel2 p-2 text-cyber-muted transition hover:border-cyber-violet/40 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Rule Name">
                        <input
                            value={form.name}
                            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                            className="w-full rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                            placeholder="Ex: Suspicious LSASS Read"
                        />
                    </Field>

                    <Field label="Type">
                        <select
                            value={form.type}
                            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                            className="w-full rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                        >
                            <option value="sigma">Sigma</option>
                            <option value="yara">YARA</option>
                        </select>
                    </Field>

                    <Field label="Severity">
                        <select
                            value={form.severity}
                            onChange={(event) => setForm((prev) => ({ ...prev, severity: event.target.value }))}
                            className="w-full rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </Field>

                    <Field label="Author">
                        <input
                            value={form.author}
                            onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
                            className="w-full rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                            placeholder="analyst"
                        />
                    </Field>

                    <div className="md:col-span-2">
                        <Field label="Description">
                            <textarea
                                value={form.description}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, description: event.target.value }))
                                }
                                className="min-h-[110px] w-full rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet/40"
                                placeholder="Short description of the rule purpose"
                            />
                        </Field>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <ActionButton icon={Plus} onClick={onCreate} tone="violet" size="md">
                        Create Rule
                    </ActionButton>

                    <ActionButton icon={X} onClick={onClose} tone="neutral" size="md">
                        Cancel
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}

function RenameRuleModal({ value, setValue, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-3xl border border-cyber-border bg-cyber-panel p-5 shadow-[0_0_40px_rgba(59,130,246,0.18)]">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-lg font-semibold text-cyber-text">Rename Rule</p>
                        <p className="mt-1 text-sm text-cyber-muted">
                            Update the display name of the current rule.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl border border-cyber-border bg-cyber-panel2 p-2 text-cyber-muted transition hover:border-cyber-violet/40 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <Field label="Rule Name">
                    <input
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        className="w-full rounded-xl border border-cyber-border bg-cyber-panel2 px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-blue/40"
                        placeholder="New rule name"
                    />
                </Field>

                <div className="mt-5 flex flex-wrap gap-3">
                    <ActionButton icon={PenSquare} onClick={onConfirm} tone="blue" size="md">
                        Rename Rule
                    </ActionButton>

                    <ActionButton icon={X} onClick={onClose} tone="neutral" size="md">
                        Cancel
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}

function DeleteRuleModal({ ruleName, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-3xl border border-cyber-border bg-cyber-panel p-5 shadow-[0_0_40px_rgba(239,68,68,0.18)]">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-lg font-semibold text-cyber-text">Delete Rule</p>
                        <p className="mt-1 text-sm text-cyber-muted">
                            This action removes the selected rule from the workspace.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl border border-cyber-border bg-cyber-panel2 p-2 text-cyber-muted transition hover:border-cyber-violet/40 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="rounded-2xl border border-cyber-red/30 bg-cyber-red/10 p-4">
                    <p className="text-sm leading-6 text-cyber-text">
                        You are about to delete <span className="font-semibold text-cyber-red">{ruleName}</span>.
                    </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <ActionButton icon={Trash2} onClick={onConfirm} tone="red" size="md">
                        Delete Rule
                    </ActionButton>

                    <ActionButton icon={X} onClick={onClose} tone="neutral" size="md">
                        Cancel
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-wide text-cyber-muted">{label}</span>
            {children}
        </label>
    );
}

/* ========================================
   🧩 Editor Console
======================================== */

function ConsoleEditor({ fileName, content, onChange, readOnly = false }) {
    const lineCount = content.split("\n").length;

    return (
        <ConsoleShell
            title={fileName}
            rightSlot={
                <span className="font-mono text-[10px] text-cyber-muted">
                    {lineCount} lines
                </span>
            }
        >
            <div className="flex min-h-[420px] font-mono">
                <div className="w-14 shrink-0 border-r border-white/[0.04] bg-white/[0.02] px-2 py-4 text-right text-[11px] leading-7 text-slate-500/60">
                    {content.split("\n").map((_, index) => (
                        <div key={index}>{index + 1}</div>
                    ))}
                </div>

                <textarea
                    value={content}
                    onChange={onChange}
                    readOnly={readOnly}
                    spellCheck={false}
                    className="min-h-[420px] flex-1 resize-none bg-transparent px-4 py-4 font-mono text-[12px] leading-7 text-slate-100 outline-none"
                />
            </div>
        </ConsoleShell>
    );
}

/* ========================================
   🧪 Test Console
======================================== */

const ConsoleLog = forwardRef(function ConsoleLog(
    { title, lines, variant = "simulation", emptyText, live = false },
    ref
) {
    return (
        <ConsoleShell title={title} isLive={live}>
            <div
                ref={ref}
                className="min-h-[420px] max-h-[520px] overflow-auto"
            >
                {!lines.length ? (
                    <EmptyState
                        title="No test output yet"
                        description={emptyText}
                        compact
                    />
                ) : (
                    <div className="space-y-2">
                        {lines.map((line, index) => (
                            <div key={index} className="break-words text-sm leading-6">
                                {line.type === "cmd" ? (
                                    <>
                                        <span className="text-cyber-violet">$</span>{" "}
                                        <span className="text-slate-100">{line.text}</span>
                                    </>
                                ) : (
                                    <span className={getTestLogColor(line.type, variant)}>{line.text}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ConsoleShell>
    );
});

/* ========================================
   👁️ Preview Console
======================================== */

function PreviewConsole({ fileName, html }) {
    return (
        <ConsoleShell
            title={fileName}
            rightSlot={
                <span className="rounded-lg border border-cyber-amber/30 bg-cyber-amber/10 px-2 py-0.5 text-[11px] font-medium text-cyber-amber">
                    Preview
                </span>
            }
        >
            <div className="rule-preview min-h-[420px] overflow-auto">
                <pre
                    className="whitespace-pre-wrap break-words text-[12px] leading-7 text-slate-100"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </ConsoleShell>
    );
}

/* ========================================
   🧩 Small UI
======================================== */

function ActionButton({
    icon: Icon,
    children,
    onClick,
    disabled = false,
    tone = "neutral",
    size = "sm",
    fullWidth = false,
}) {
    const toneClasses = {
        violet: "border-cyber-violet/30 bg-cyber-violet/10 text-white hover:bg-cyber-violet/20",
        blue: "border-cyber-blue/30 bg-cyber-blue/10 text-white hover:bg-cyber-blue/20",
        amber: "border-cyber-amber/30 bg-cyber-amber/10 text-white hover:bg-cyber-amber/20",
        red: "border-cyber-red/30 bg-cyber-red/10 text-white hover:bg-cyber-red/20",
        neutral: "border-cyber-border bg-cyber-panel2 text-cyber-text hover:border-cyber-violet/40",
    };

    const sizeClasses = {
        sm: "px-3 py-2 text-xs rounded-xl",
        md: "px-4 py-2 text-sm rounded-xl",
        lg: "px-4 py-3 text-sm rounded-2xl",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={[
                "inline-flex items-center justify-center gap-2 border font-semibold transition",
                toneClasses[tone] ?? toneClasses.neutral,
                sizeClasses[size] ?? sizeClasses.sm,
                fullWidth ? "w-full" : "",
                "disabled:cursor-not-allowed disabled:opacity-40",
            ].join(" ")}
        >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {children}
        </button>
    );
}

function InlineNotice({ type = "success", children, onDismiss }) {
    const isSuccess = type === "success";

    return (
        <div
            className={`mb-4 flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${isSuccess
                ? "border-cyber-green/30 bg-cyber-green/10 text-cyber-green"
                : "border-cyber-red/30 bg-cyber-red/10 text-cyber-red"
                }`}
        >
            <div className="min-w-0">{children}</div>

            <button
                onClick={onDismiss}
                className="shrink-0 rounded-lg border border-white/10 p-1 text-current opacity-80 transition hover:opacity-100"
                aria-label="Dismiss notice"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

function MiniMeta({ label, value, tone = "text-cyber-text" }) {
    return (
        <div className="rounded-xl border border-cyber-border bg-cyber-panel2 p-3">
            <p className="text-[10px] uppercase tracking-wide text-cyber-muted">{label}</p>
            <p className={`mt-1 text-sm font-semibold ${tone}`}>{value}</p>
        </div>
    );
}

function PreviewMetaRow({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.04] py-2 last:border-b-0">
            <span className="text-[11px] uppercase tracking-wide text-cyber-muted">{label}</span>
            <span className="text-right font-mono text-xs font-semibold text-cyber-text">{value}</span>
        </div>
    );
}

/* ========================================
   🎨 Tones
======================================== */

function getPreviewTone(severity) {
    if (severity === "critical" || severity === "high") return "border-cyber-red/20";
    if (severity === "medium") return "border-cyber-amber/20";
    return "border-cyber-violet/20";
}

function getTestLogColor(type, variant) {
    if (variant === "simulation") {
        if (type === "info") return "text-cyan-400";
        if (type === "ok") return "text-green-400";
        if (type === "err") return "text-red-400";
        return "text-slate-300";
    }

    if (type === "info") return "text-cyan-400";
    if (type === "ok") return "text-green-400";
    if (type === "err") return "text-red-400";
    return "text-slate-300";
}

/* ========================================
   🧠 Helpers
======================================== */

function sanitizeRuleName(name) {
    return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
}

function normalizeImportedRule(rule) {
    if (!rule || typeof rule !== "object") return null;

    return {
        id: rule.id || `rule_import_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: rule.name || "Imported Rule",
        type: rule.type === "yara" ? "yara" : "sigma",
        status: rule.status || "draft",
        severity: rule.severity || "medium",
        techniques: Array.isArray(rule.techniques) ? rule.techniques : [],
        scenarios: Array.isArray(rule.scenarios) ? rule.scenarios : [],
        author: rule.author || "imported",
        description: rule.description || "Imported detection rule",
        content: typeof rule.content === "string" ? rule.content : "",
        matchScore: typeof rule.matchScore === "number" ? rule.matchScore : 0,
        lastTriggered: rule.lastTriggered || "Never",
        enabled: typeof rule.enabled === "boolean" ? rule.enabled : false,
        favorite: typeof rule.favorite === "boolean" ? rule.favorite : false,
        pinned: typeof rule.pinned === "boolean" ? rule.pinned : false,
    };
}

function highlightRuleContent(code, type) {
    if (!code) return "";

    const lines = code.split("\n");

    return lines
        .map((line) => {
            const trimmed = line.trimStart();
            const indent = line.length - trimmed.length;
            const pad = " ".repeat(indent);

            if (trimmed.startsWith("#")) {
                return `<span class="hl-comment">${line}</span>`;
            }

            if (type === "yara") {
                if (/^(rule|meta:|strings:|condition:|import)\b/.test(trimmed)) {
                    return `${pad}<span class="hl-keyword">${trimmed}</span>`;
                }

                if (/^\$(str|cfg|xor|header)/.test(trimmed)) {
                    return `<span class="hl-var">${pad}${trimmed}</span>`;
                }

                if (/\{[0-9A-Fa-f ?]+\}/.test(trimmed)) {
                    return `${pad}${trimmed.replace(/(\{[0-9A-Fa-f ?]+\})/g, '<span class="hl-hex">$1</span>')}`;
                }
            }

            const keyMatch = trimmed.match(/^([a-zA-Z_|]+)(\s*:.*)$/);
            if (keyMatch) {
                const val = keyMatch[2]
                    .replace(/'([^']+)'/g, `'<span class="hl-string">$1</span>'`)
                    .replace(/\b(true|false|stable|experimental|test)\b/g, '<span class="hl-bool">$1</span>');

                return `${pad}<span class="hl-key">${keyMatch[1]}</span>${val}`;
            }

            if (trimmed.startsWith("- ")) {
                return `${pad}<span class="hl-list">- </span><span class="hl-string">${trimmed.slice(2)}</span>`;
            }

            if (/\{[0-9A-Fa-f ?]+\}/.test(trimmed)) {
                return `${pad}${trimmed.replace(/(\{[0-9A-Fa-f ?]+\})/g, '<span class="hl-hex">$1</span>')}`;
            }

            return line;
        })
        .join("\n");
}