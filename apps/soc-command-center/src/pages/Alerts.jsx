import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { CyberPanel } from "@/components/ui/CyberPanel";
import { HeaderCard } from "@/components/ui/HeaderCard";
import { Badge } from "@/components/ui/Badge";
import { ActionButton } from "@/components/ui/ActionButton";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { TabButton } from "@/components/ui/TabButton";

import {
  Play,
  Pause,
  Rocket,
  Layers,
  List,
  Bell,
  ShieldAlert,
} from "lucide-react";

function buildTimeline(alert) {
  if (!alert) return [];

  let baseTime = new Date();

  return alert.logs.map((log, index) => {
    const time = new Date(baseTime.getTime() + index * 60000);

    return {
      time: time.toLocaleTimeString(),
      event: log,
      type:
        log.toLowerCase().includes("success")
          ? "success"
          : log.toLowerCase().includes("failed")
            ? "failed"
            : "info",
    };
  });
}

function aiSOCAnalysis(alert) {
  if (!alert) return null;

  const logs = alert.logs.join(" ").toLowerCase();

  if (logs.includes("failed login")) {
    return {
      threat: "Brute Force Attack",
      confidence: 88,
      impact: "Account compromise risk",
      recommendation: "Block IP, reset credentials, enable MFA",
      summary:
        "Multiple failed authentication attempts indicate a likely brute force campaign that may have led to account compromise.",
      mitre: "T1110 - Brute Force",
    };
  }

  if (logs.includes("mimikatz") || logs.includes("encoded")) {
    return {
      threat: "Credential Dumping / Post-Exploitation",
      confidence: 97,
      impact: "Full system compromise possible",
      recommendation: "Isolate host immediately and collect forensic evidence",
      summary:
        "Encoded execution and credential-dumping indicators strongly suggest post-exploitation activity on the endpoint.",
      mitre: "T1003 - OS Credential Dumping",
    };
  }

  if (logs.includes("scan") || logs.includes("nmap")) {
    return {
      threat: "Reconnaissance Activity",
      confidence: 72,
      impact: "Pre-attack behavior detected",
      recommendation: "Monitor the source IP and review firewall telemetry",
      summary:
        "Port scanning behavior suggests reconnaissance activity that may precede exploitation attempts.",
      mitre: "T1046 - Network Service Scanning",
    };
  }

  return {
    threat: "Unknown Activity",
    confidence: 40,
    impact: "Undetermined",
    recommendation: "Manual investigation required",
    summary:
      "The current telemetry is insufficient for a high-confidence classification.",
    mitre: "Unknown",
  };
}

function analyzeAlert(alert) {
  if (!alert) return null;

  const logsText = alert.logs.join(" ").toLowerCase();

  if (logsText.includes("failed login")) {
    return {
      type: "Brute Force Attack",
      severity: "Credential Attack",
      recommendation: "Block IP and review authentication logs",
    };
  }

  if (logsText.includes("mimikatz") || logsText.includes("encoded")) {
    return {
      type: "Post-Exploitation",
      severity: "Malicious Execution",
      recommendation: "Isolate host immediately",
    };
  }

  return {
    type: "Unknown Activity",
    severity: "Needs Investigation",
    recommendation: "Manual analysis required",
  };
}

const baseAlerts = [
  {
    id: 1,
    time: "10:23",
    name: "SSH Brute Force Attack",
    severity: "high",
    ip: "192.168.1.10",
    tag: "Bruteforce",
    status: "open",
    logs: [
      "Failed login root",
      "Failed login admin",
      "Failed login root",
      "SUCCESS login root",
    ],
  },
  {
    id: 2,
    time: "11:02",
    name: "Suspicious PowerShell Execution",
    severity: "critical",
    ip: "10.0.0.5",
    tag: "Execution",
    status: "open",
    logs: [
      "Encoded command detected",
      "Base64 suspicious payload",
      "Invoke-Mimikatz attempt",
    ],
  },
];

const severityColor = {
  low: "text-gray-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-500",
};

const severityScore = {
  low: 25,
  medium: 50,
  high: 75,
  critical: 100,
};

export default function Alerts({
  setGlobalAlerts,
  demoTrigger,
  resetTrigger,
  linkedAlerts = [],
}) {
  const [alertsState, setAlertsState] = useState(() => {
    const savedAlerts = localStorage.getItem("soc_alerts_state");
    return savedAlerts ? JSON.parse(savedAlerts) : baseAlerts;
  });
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isRunning, setIsRunning] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [incidentPriority, setIncidentPriority] = useState("P2");
  const [analystNotes, setAnalystNotes] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [notesByIncident, setNotesByIncident] = useState({});
  const [incidentStatusById, setIncidentStatusById] = useState({});
  const [incidentPriorityById, setIncidentPriorityById] = useState({});
  const [toast, setToast] = useState(null);
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem("soc_activity_log");
    return saved ? JSON.parse(saved) : [];
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });
  const [, setNowTick] = useState(Date.now());
  const [viewMode, setViewMode] = useState("flat");

  useEffect(() => {
    if (!linkedAlerts.length) return;

    setAlertsState((prev) => {
      const existingIds = new Set(prev.map((alert) => String(alert.id)));

      const normalizedLinkedAlerts = linkedAlerts.map((alert) => ({
        ...alert,
        id: alert.id,
        time: alert.time || new Date().toLocaleTimeString(),
        tag: alert.tag || alert.technique || "Linked Incident",
        status: alert.status || "open",
        logs:
          Array.isArray(alert.logs) && alert.logs.length
            ? alert.logs
            : [
              alert.description || "Linked incident alert imported from Purple Team Lab.",
              alert.user ? `Affected user: ${alert.user}` : null,
              alert.technique ? `MITRE technique: ${alert.technique}` : null,
              alert.ip ? `Source IP: ${alert.ip}` : null,
            ].filter(Boolean),
      }));

      const nextAlerts = normalizedLinkedAlerts.filter(
        (alert) => !existingIds.has(String(alert.id))
      );

      if (!nextAlerts.length) return prev;

      return [...nextAlerts, ...prev];
    });

    setSelected((prev) => prev ?? linkedAlerts[0]);
    setFilter("all");
  }, [linkedAlerts]);


  const analysis = analyzeAlert(selected);
  const ai = aiSOCAnalysis(selected);
  const timeline = buildTimeline(selected);
  const flag = selected?.logs?.find((log) => log.includes("FLAG"));

  function resetLocalWorkflowData() {
    localStorage.removeItem("soc_notes_by_incident");
    localStorage.removeItem("soc_status_by_incident");
    localStorage.removeItem("soc_priority_by_incident");
    localStorage.removeItem("soc_alerts_state");
    localStorage.removeItem("soc_activity_log");

    setNotesByIncident({});
    setIncidentStatusById({});
    setIncidentPriorityById({});
    setAlertsState(baseAlerts);
    setSelected(null);
    setAnalystNotes("");
    setIncidentPriority("P2");
    setActivityLog([]);
  }

  function launchLiveAttack() {
    const scenario = generateAttackScenario();

    setLiveMode(true);

    scenario.forEach((alert, index) => {
      setTimeout(() => {
        setAlertsState((prev) => [alert, ...prev].slice(0, 100));
      }, index * 1500);
    });

    setTimeout(() => {
      setLiveMode(false);
    }, scenario.length * 1500 + 1000);
  }

  function updateStatus(id, newStatus) {
    setIncidentStatusById((prev) => ({
      ...prev,
      [id]: newStatus,
    }));

    setAlertsState((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? { ...alert, status: newStatus }
          : alert
      )
    );
    showToast(`Incident status updated to ${newStatus}`, "info");
    addActivityLog(`Incident status changed to ${newStatus}`, "info");
  }

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const scenario = generateAttackScenario();

      scenario.forEach((alert, index) => {
        setTimeout(() => {
          setAlertsState((prev) => [alert, ...prev].slice(0, 50));
        }, index * 3000);
      });
    }, 20000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setGlobalAlerts?.(alertsState);
  }, [alertsState, setGlobalAlerts]);

  useEffect(() => {
    if (!demoTrigger) return;
    launchLiveAttack();
  }, [demoTrigger]);

  useEffect(() => {
    if (!resetTrigger) return;

    setAlertsState(baseAlerts);
    setSelected(null);
    setFilter("all");
    setLiveMode(false);
    setIsRunning(true);
  }, [resetTrigger]);

  useEffect(() => {
    const savedNotes = localStorage.getItem("soc_notes_by_incident");
    const savedStatuses = localStorage.getItem("soc_status_by_incident");
    const savedPriorities = localStorage.getItem("soc_priority_by_incident");

    if (savedNotes) {
      setNotesByIncident(JSON.parse(savedNotes));
    }

    if (savedStatuses) {
      setIncidentStatusById(JSON.parse(savedStatuses));
    }

    if (savedPriorities) {
      setIncidentPriorityById(JSON.parse(savedPriorities));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("soc_alerts_state", JSON.stringify(alertsState));
  }, [alertsState]);

  useEffect(() => {
    localStorage.setItem(
      "soc_notes_by_incident",
      JSON.stringify(notesByIncident)
    );
  }, [notesByIncident]);

  useEffect(() => {
    localStorage.setItem(
      "soc_status_by_incident",
      JSON.stringify(incidentStatusById)
    );
  }, [incidentStatusById]);

  useEffect(() => {
    localStorage.setItem(
      "soc_priority_by_incident",
      JSON.stringify(incidentPriorityById)
    );
  }, [incidentPriorityById]);

  useEffect(() => {
    localStorage.setItem("soc_activity_log", JSON.stringify(activityLog));
  }, [activityLog]);

  function getPriorityClass(priority) {
    switch (priority) {
      case "P1":
        return "bg-red-500/15 text-red-400 border border-red-500/30 shadow-red-500/20 shadow";
      case "P2":
        return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
      case "P3":
        return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30";
      default:
        return "bg-slate-600/20 text-slate-300 border border-slate-500/20";
    }
  }

  function generateReport(alert, analysis, ai, timeline, notes, priority, status) {
    return `
==============================
 SOC INCIDENT REPORT
==============================

[GENERAL]
Alert Name: ${alert.name}
IP Address: ${alert.ip}
Severity: ${alert.severity}
Priority: ${priority}
Status: ${status}
Time: ${alert.time}
Tag: ${alert.tag}
SLA Age: X min

[ANALYSIS]
Type: ${analysis?.type || "N/A"}
Category: ${analysis?.severity || "N/A"}
Recommendation: ${analysis?.recommendation || "N/A"}

[AI SOC ANALYSIS]
Threat: ${ai?.threat || "N/A"}
Confidence: ${ai?.confidence ? `${ai.confidence}%` : "N/A"}
Impact: ${ai?.impact || "N/A"}
MITRE: ${ai?.mitre || "N/A"}
Summary: ${ai?.summary || "N/A"}
Recommendation: ${ai?.recommendation || "N/A"}

[TIMELINE]
${timeline.length > 0 ? timeline.map((t) => `${t.time} - ${t.event}`).join("\n") : "No timeline available"}

[ANALYST NOTES]
${notes?.trim() ? notes : "No notes provided"}

[WORKFLOW]
Current incident status: ${status}
Current analyst priority: ${priority}

==============================
 END OF REPORT
==============================
`;
  }

  function downloadReport(content, alert) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${alert.name.replace(/\s+/g, "-").toLowerCase()}-${alert.id}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  }

  function saveAnalystNotes() {
    if (!selected) return;

    setNotesByIncident((prev) => ({
      ...prev,
      [selected.id]: analystNotes,
    }));

    showToast("Analyst notes saved", "success");
    addActivityLog("Analyst notes saved", "success");
  }

  function getSavedNotesCount() {
    return Object.keys(notesByIncident).length;
  }

  const selectedPriority =
    selected
      ? incidentPriorityById[selected.id] ||
      (selected.severity === "critical"
        ? "P1"
        : selected.severity === "high"
          ? "P2"
          : selected.severity === "medium"
            ? "P3"
            : "P4")
      : "P2";

  const selectedStatus =
    selected ? incidentStatusById[selected.id] || selected.status : "open";

  const generatedReport = selected
    ? generateReport(
      selected,
      analysis,
      ai,
      timeline,
      notesByIncident[selected.id] || analystNotes,
      selectedPriority,
      selectedStatus
    )
    : "";

  const displayedAlerts = alertsState.map((alert) => ({
    ...alert,
    status: incidentStatusById[alert.id] || alert.status,
    priority:
      incidentPriorityById[alert.id] ||
      (alert.severity === "critical"
        ? "P1"
        : alert.severity === "high"
          ? "P2"
          : alert.severity === "medium"
            ? "P3"
            : "P4"),
    slaMinutes: getSLAMinutes(alert),
  }));

  const sortedAlerts = [...displayedAlerts].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // PRIORITY → convertir P1 → 1
    if (sortConfig.key === "priority") {
      aValue = parseInt(aValue.replace("P", ""));
      bValue = parseInt(bValue.replace("P", ""));
    }

    // SEVERITY → ranking
    if (sortConfig.key === "severity") {
      const map = { critical: 4, high: 3, medium: 2, low: 1 };
      aValue = map[aValue];
      bValue = map[bValue];
    }

    // SLA déjà numérique

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const groupedAlerts = Object.values(
    sortedAlerts.reduce((acc, alert) => {
      if (!acc[alert.ip]) {
        acc[alert.ip] = {
          ip: alert.ip,
          alerts: [],
          count: 0,
          highestSeverity: alert.severity,
          highestPriority: alert.priority,
          oldestSLA: alert.slaMinutes,
        };
      }

      acc[alert.ip].alerts.push(alert);
      acc[alert.ip].count += 1;

      const severityRank = { low: 1, medium: 2, high: 3, critical: 4 };
      if (
        severityRank[alert.severity] >
        severityRank[acc[alert.ip].highestSeverity]
      ) {
        acc[alert.ip].highestSeverity = alert.severity;
      }

      const priorityRank = { P4: 1, P3: 2, P2: 3, P1: 4 };
      if (
        priorityRank[alert.priority] >
        priorityRank[acc[alert.ip].highestPriority]
      ) {
        acc[alert.ip].highestPriority = alert.priority;
      }

      if (alert.slaMinutes > acc[alert.ip].oldestSLA) {
        acc[alert.ip].oldestSLA = alert.slaMinutes;
      }

      return acc;
    }, {})
  );

  function updateIncidentPriority(id, priority) {
    setIncidentPriority(priority);

    setIncidentPriorityById((prev) => ({
      ...prev,
      [id]: priority,
    }));

    showToast(`Priority changed to ${priority}`, "warning");
    addActivityLog(`Priority updated to ${priority}`, "warning");
  }

  function appendAnalystNote(text) {
    if (!selected) return;

    const currentNotes = notesByIncident[selected.id] || analystNotes || "";
    const separator = currentNotes ? "\n\n" : "";
    const nextNotes = `${currentNotes}${separator}${text}`;

    setAnalystNotes(nextNotes);

    setNotesByIncident((prev) => ({
      ...prev,
      [selected.id]: nextNotes,
    }));
  }

  function handleEscalate() {
    if (!selected) return;

    updateIncidentPriority(selected.id, "P1");
    updateStatus(selected.id, "investigating");
    appendAnalystNote("Action: Incident escalated to high priority (P1) and moved to investigating.");
    showToast("Incident escalated to P1", "warning");
    addActivityLog("Incident escalated to P1", "warning");
  }

  function handleAssignTier2() {
    if (!selected) return;

    appendAnalystNote("Action: Incident assigned to Tier 2 analyst for deeper investigation.");
    showToast("Assigned to Tier 2 analyst", "info");
    addActivityLog("Incident assigned to Tier 2", "info");
  }

  function handleBlockSource() {
    if (!selected) return;

    appendAnalystNote(`Action: Source IP ${selected.ip} marked for containment / blocking.`);
    showToast(`Source ${selected.ip} marked for blocking`, "error");
    addActivityLog(`Source ${selected.ip} marked for blocking`, "error");
  }

  function handleCollectIOCs() {
    if (!selected) return;

    appendAnalystNote(
      `IOC Collection:\n- Source IP: ${selected.ip}\n- Severity: ${selected.severity}\n- Tag: ${selected.tag}`
    );
    showToast("IOCs collected and appended to notes", "success");
    addActivityLog("IOCs collected from incident", "success");
  }

  function showToast(message, type = "info") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  function getToastClass(type) {
    switch (type) {
      case "success":
        return "bg-green-500/15 border-green-500/30 text-green-400";
      case "warning":
        return "bg-orange-500/15 border-orange-500/30 text-orange-400";
      case "error":
        return "bg-red-500/15 border-red-500/30 text-red-400";
      default:
        return "bg-blue-500/15 border-blue-500/30 text-blue-400";
    }
  }

  function addActivityLog(action, type = "info") {
    const entry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      action,
      type,
      incidentId: selected?.id || null,
      incidentName: selected?.name || "Unknown incident",
    };

    setActivityLog((prev) => [entry, ...prev].slice(0, 30));
  }

  function getActivityTypeClass(type) {
    switch (type) {
      case "success":
        return "text-green-400 border-green-500/20 bg-green-500/10";
      case "warning":
        return "text-orange-400 border-orange-500/20 bg-orange-500/10";
      case "error":
        return "text-red-400 border-red-500/20 bg-red-500/10";
      default:
        return "text-blue-400 border-blue-500/20 bg-blue-500/10";
    }
  }

  function getSLAMinutes(alert) {
    if (!alert?.time) return 0;

    const now = new Date();
    const [hours, minutes, seconds] = alert.time.split(":").map(Number);

    const alertDate = new Date();
    alertDate.setHours(hours || 0, minutes || 0, seconds || 0, 0);

    const diffMs = now - alertDate;
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

    return diffMinutes;
  }

  function getSLAClass(minutes) {
    if (minutes >= 30) return "text-red-400 bg-red-500/10 border-red-500/20";
    if (minutes >= 15) return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    return "text-green-400 bg-green-500/10 border-green-500/20";
  }

  const selectedSLAMinutes = selected ? getSLAMinutes(selected) : 0;

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "desc" };
    });
  }

  function getSortIndicator(key) {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick(Date.now());
    }, 10000); // refresh toutes les 10 sec

    return () => clearInterval(interval);
  }, []);

  function downloadPDFReport(alert, analysis, ai, timeline, notes, priority, status) {
    const doc = new jsPDF();

    let y = 20;

    function addLine(text, space = 8) {
      doc.text(text, 14, y);
      y += space;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    addLine("SOC INCIDENT REPORT", 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    addLine(`[GENERAL]`);
    addLine(`Alert Name: ${alert.name}`);
    addLine(`IP Address: ${alert.ip}`);
    addLine(`Severity: ${alert.severity}`);
    addLine(`Priority: ${priority}`);
    addLine(`Status: ${status}`);
    addLine(`Time: ${alert.time}`);
    addLine(`Tag: ${alert.tag}`, 12);

    addLine(`[ANALYSIS]`);
    addLine(`Type: ${analysis?.type || "N/A"}`);
    addLine(`Category: ${analysis?.severity || "N/A"}`);
    addLine(`Recommendation: ${analysis?.recommendation || "N/A"}`, 12);

    addLine(`[AI SOC ANALYSIS]`);
    addLine(`Threat: ${ai?.threat || "N/A"}`);
    addLine(`Confidence: ${ai?.confidence ? `${ai.confidence}%` : "N/A"}`);
    addLine(`Impact: ${ai?.impact || "N/A"}`);
    addLine(`MITRE: ${ai?.mitre || "N/A"}`, 12);

    addLine(`[TIMELINE]`);
    timeline.forEach((t) => addLine(`${t.time} - ${t.event}`));
    y += 6;

    addLine(`[ANALYST NOTES]`);
    const splitNotes = doc.splitTextToSize(notes?.trim() ? notes : "No notes provided", 180);
    doc.text(splitNotes, 14, y);
    y += splitNotes.length * 6 + 8;

    addLine(`[WORKFLOW]`);
    addLine(`Current incident status: ${status}`);
    addLine(`Current analyst priority: ${priority}`);

    doc.save(`${alert.name.replace(/\s+/g, "-").toLowerCase()}-${alert.id}.pdf`);
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">

      <div className="space-y-4">
        <HeaderCard
          eyebrow="Alert Operations"
          title="Security Alerts"
          description="Triage live detections, prioritize incidents, inspect logs and drive analyst response workflows."
        >
          <Badge tone="blue">{alertsState.length} Alerts</Badge>
          <Badge tone={liveMode ? "red" : "green"}>
            {liveMode ? "Attack Running" : "Monitoring"}
          </Badge>
          <Badge tone={viewMode === "grouped" ? "cyan" : "slate"}>
            {viewMode === "grouped" ? "Grouped View" : "Flat View"}
          </Badge>
        </HeaderCard>

        <CyberPanel>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <ActionButton
                tone={isRunning ? "red" : "green"}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? "Pause SOC" : "Resume SOC"}
              </ActionButton>

              <ActionButton tone="blue" onClick={launchLiveAttack}>
                <Rocket className="h-4 w-4" />
                Launch Attack
              </ActionButton>

              <ActionButton
                tone="slate"
                onClick={() => setViewMode((prev) => (prev === "flat" ? "grouped" : "flat"))}
              >
                {viewMode === "flat" ? <Layers className="h-4 w-4" /> : <List className="h-4 w-4" />}
                {viewMode === "flat" ? "Grouped by IP" : "Flat View"}
              </ActionButton>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-blue-400/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
              >
                <option value="all">All severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-300">
                <Bell className="h-4 w-4" />
                {alertsState.length}
              </div>
            </div>
          </div>
        </CyberPanel>

        {liveMode && (
          <CyberPanel variant="threat" className="animate-pulse">
            <div className="flex items-center gap-3 text-red-200">
              <ShieldAlert className="h-5 w-5" />
              <p className="font-semibold tracking-wide">
                Live attack simulation in progress...
              </p>
            </div>
          </CyberPanel>
        )}

        <CyberPanel className="overflow-hidden p-0">
          <table className="w-full text-left">
            <thead className="bg-soc-bg text-soc-muted text-sm uppercase tracking-wide">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Alert</th>
                <th onClick={() => handleSort("severity")} className="p-3 cursor-pointer">
                  Severity {getSortIndicator("severity")}
                </th>
                <th onClick={() => handleSort("priority")} className="p-3 cursor-pointer">
                  Priority {getSortIndicator("priority")}
                </th>
                <th onClick={() => handleSort("slaMinutes")} className="p-3 cursor-pointer">
                  SLA {getSortIndicator("slaMinutes")}
                </th>
                <th className="p-3">IP</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {sortedAlerts
                .filter((a) => filter === "all" || a.severity === filter)
                .map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => {
                      setSelected(a);
                      setActiveTab("overview");

                      const priority =
                        incidentPriorityById[a.id] ||
                        (a.severity === "critical"
                          ? "P1"
                          : a.severity === "high"
                            ? "P2"
                            : a.severity === "medium"
                              ? "P3"
                              : "P4");

                      setIncidentPriorityById((prev) => ({
                        ...prev,
                        [a.id]: priority,
                      }));

                      setIncidentPriority(priority);
                      setAnalystNotes(notesByIncident[a.id] || "");
                    }}
                    className="border-t border-slate-700 hover:bg-slate-700/40 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                  >
                    <td className="p-3">{a.time}</td>

                    {/* ALERT NAME */}
                    <td className="p-3">{a.name}</td>

                    {/* SEVERITY */}
                    <td className="p-3">
                      <SeverityBadge severity={a.severity} />
                    </td>

                    {/* PRIORITY */}
                    <td className="p-3">
                      <span
                        title="Analyst-defined priority"
                        className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityClass(a.priority)}`}>
                        {a.priority}
                      </span>
                    </td>

                    {/* SLA */}
                    <td className="p-3">
                      <span
                        title="Time since detection"
                        className={`px-2 py-1 rounded text-xs font-semibold border ${getSLAClass(a.slaMinutes)
                          } ${a.slaMinutes >= 30 ? "animate-pulse" : ""}`}
                      >
                        {a.slaMinutes}m
                      </span>
                    </td>

                    {/* IP */}
                    <td className="p-3">{a.ip}</td>

                    {/* STATUS */}
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 rounded bg-slate-700">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CyberPanel>
        <div className="bg-soc-panel border border-soc-border rounded-lg overflow-hidden shadow-lg shadow-black/20"></div>
      </div>

      {/* PANEL DÉTAIL INCIDENT */}

      {selected && (
        <CyberPanel className="drawer-animation max-h-screen overflow-y-auto no-scrollbar xl:sticky xl:top-6">

          {/* HEADER */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                Incident Analysis
              </h3>
              <p className="text-sm text-soc-muted mt-1">
                Analyst review and response workflow
              </p>
            </div>

            <div className="min-w-[110px]">
              <p className="text-[11px] uppercase tracking-wide text-soc-muted mb-1 text-right">
                Priority
              </p>

              <select
                value={incidentPriority}
                onChange={(e) => updateIncidentPriority(selected.id, e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-xs font-semibold outline-none bg-soc-bg ${getPriorityClass(incidentPriority)}`}
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
              </select>
              <p className="text-[11px] text-soc-muted mt-1 text-right">
                Analyst-defined severity
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="mb-5 flex flex-wrap gap-2 border-b border-blue-400/10 pb-4">
            {[
              { id: "overview", label: "Overview" },
              { id: "ai", label: "AI" },
              { id: "timeline", label: "Timeline" },
              { id: "notes", label: "Notes" },
              { id: "report", label: "Report" },
              { id: "activity", label: "Activity" },
            ].map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <>
              {/* INCIDENT WORKFLOW */}
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  ⚡ Incident Workflow
                </h4>

                <div className="flex flex-wrap gap-2">
                  <ActionButton
                    size="sm"
                    tone="yellow"
                    onClick={() => updateStatus(selected.id, "investigating")}
                  >
                    Investigating
                  </ActionButton>

                  <ActionButton
                    size="sm"
                    tone="green"
                    onClick={() => updateStatus(selected.id, "closed")}
                  >
                    Closed
                  </ActionButton>

                  <ActionButton
                    size="sm"
                    tone="slate"
                    onClick={() => updateStatus(selected.id, "open")}
                  >
                    Reopen
                  </ActionButton>
                </div>
              </div>



              {/* METADATA */}
              <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-blue-400/10 bg-slate-950/55 p-3">
                  <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                    Alert Name
                  </p>
                  <p className="font-semibold text-white">{selected.name}</p>
                </div>

                <div className="rounded-xl border border-blue-400/10 bg-slate-950/55 p-3">
                  <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                    Source IP
                  </p>
                  <p className="font-mono font-semibold text-blue-300">{selected.ip}</p>
                </div>

                <div className="rounded-xl border border-blue-400/10 bg-slate-950/55 p-3">
                  <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                    Timestamp
                  </p>
                  <p className="font-semibold text-slate-200">{selected.time}</p>
                </div>

                <div className="rounded-xl border border-blue-400/10 bg-slate-950/55 p-3">
                  <p className="mb-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                    Severity
                  </p>
                  <SeverityBadge severity={selected.severity} />
                </div>

                <div className="col-span-2 rounded-xl border border-blue-400/10 bg-slate-950/55 p-3">
                  <p className="mb-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                    Attack Tag
                  </p>
                  <Badge tone="blue">{selected.tag}</Badge>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  ⏱️ Incident SLA
                </h4>

                <div className={`rounded-xl border px-3 py-3 ${getSLAClass(selectedSLAMinutes)}`}>
                  <p className="text-xs uppercase tracking-wide opacity-80 mb-1">
                    Time since detection
                  </p>
                  <p className="text-lg font-bold">
                    {selectedSLAMinutes} min
                  </p>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  🛠️ Response Actions
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <ActionButton size="sm" tone="orange" onClick={handleEscalate}>
                    Escalate
                  </ActionButton>

                  <ActionButton size="sm" tone="blue" onClick={handleAssignTier2}>
                    Assign Tier 2
                  </ActionButton>

                  <ActionButton size="sm" tone="red" onClick={handleBlockSource}>
                    Block Source
                  </ActionButton>

                  <ActionButton size="sm" tone="green" onClick={handleCollectIOCs}>
                    Collect IOCs
                  </ActionButton>
                </div>
              </div>

              {/* LOGS */}
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  📜 Security Logs
                </h4>

                <div className="rounded-2xl border border-emerald-500/15 bg-black/45 p-4 font-mono text-xs shadow-inner">
                  <div className="mb-3 flex items-center gap-2 border-b border-emerald-500/10 pb-2 text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Raw Event Stream
                  </div>

                  <div className="space-y-1.5">
                    {selected.logs.map((log, i) => (
                      <div key={i} className="flex gap-2 text-emerald-300">
                        <span className="text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-blue-500">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RISK SCORE */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                    📊 Risk Score
                  </h4>
                  <span className="text-xs font-bold text-red-300">
                    {severityScore[selected.severity]}/100
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full border border-red-500/20 bg-slate-950">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#2563eb,#f97316,#ef4444)] shadow-[0_0_18px_rgba(239,68,68,0.35)] transition-all duration-500"
                    style={{
                      width: `${severityScore[selected.severity]}%`,
                    }}
                  />
                </div>
              </div>

              {/* FLAG */}
              {flag && (
                <CyberPanel variant="success" className="mt-4">
                  <h4 className="mb-1 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    🏁 Flag Captured
                  </h4>
                  <p className="font-mono text-sm text-emerald-200">{flag}</p>
                </CyberPanel>
              )}
            </>
          )}

          {/* AI */}
          {/* AI */}
          {activeTab === "ai" && (
            <CyberPanel className="mt-4">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                  🧠 AI SOC Analyst
                </p>
                <h4 className="mt-2 text-xl font-black text-white">
                  Automated Threat Assessment
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Classification, confidence scoring and response recommendation.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-400/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Detected Threat
                </p>
                <p className="mt-2 text-lg font-bold text-white">
                  {ai?.threat}
                </p>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      Confidence
                    </span>
                    <span
                      className={
                        ai?.confidence >= 90
                          ? "text-sm font-bold text-red-300"
                          : ai?.confidence >= 75
                            ? "text-sm font-bold text-orange-300"
                            : "text-sm font-bold text-yellow-300"
                      }
                    >
                      {ai?.confidence}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full border border-blue-500/20 bg-slate-950">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#2563eb,#38bdf8,#ef4444)] shadow-[0_0_18px_rgba(56,189,248,0.35)] transition-all duration-500"
                      style={{ width: `${ai?.confidence || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="rounded-2xl border border-red-500/15 bg-red-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-red-300">
                    Impact
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {ai?.impact}
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-500/15 bg-purple-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-purple-300">
                    MITRE ATT&CK
                  </p>
                  <p className="mt-2 font-mono text-sm text-slate-200">
                    {ai?.mitre}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-500/15 bg-blue-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-blue-300">
                    Summary
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {ai?.summary}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">
                    Recommended Response
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {ai?.recommendation}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-blue-400/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  SOC Rule Match
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-400">Type</span>
                    <span className="text-right font-semibold text-white">
                      {analysis?.type}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-400">Category</span>
                    <span className="text-right font-semibold text-orange-300">
                      {analysis?.severity}
                    </span>
                  </div>

                  <div className="border-t border-blue-400/10 pt-3">
                    <p className="text-sm leading-relaxed text-blue-300">
                      {analysis?.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </CyberPanel>
          )}

          {/* TIMELINE */}
          {/* TIMELINE */}
          {activeTab === "timeline" && (
            <CyberPanel className="mt-4">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                  📜 Attack Timeline
                </p>
                <h4 className="mt-2 text-xl font-black text-white">
                  Incident Event Flow
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Chronological reconstruction of attacker activity and system events.
                </p>
              </div>

              {/* TIMELINE STREAM */}
              <div className="relative pl-4">
                <div className="absolute left-1 top-0 h-full w-[2px] bg-blue-500/20" />

                <div className="space-y-4">
                  {timeline.map((t, i) => (
                    <div key={i} className="relative flex items-start gap-3">

                      {/* DOT */}
                      <div
                        className={`mt-1 h-2.5 w-2.5 rounded-full shadow-[0_0_12px] ${t.type === "success"
                          ? "bg-red-500 shadow-red-500/60"
                          : t.type === "failed"
                            ? "bg-orange-400 shadow-orange-400/60"
                            : "bg-blue-400 shadow-blue-400/60"
                          }`}
                      />

                      {/* EVENT CARD */}
                      <div className="flex-1 rounded-xl border border-blue-400/10 bg-slate-950/60 p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-mono text-xs text-slate-400">
                            {t.time}
                          </span>

                          <span
                            className={`text-xs font-semibold ${t.type === "success"
                              ? "text-red-400"
                              : t.type === "failed"
                                ? "text-orange-300"
                                : "text-blue-300"
                              }`}
                          >
                            {t.type.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-sm text-slate-200">{t.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RELATED FLOW */}
              <div className="mt-6 border-t border-blue-400/10 pt-4">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  ⏱ Related Incident Flow (Same IP)
                </h4>

                <div className="space-y-2">
                  {alertsState
                    .filter((a) => a.ip === selected.ip)
                    .slice(0, 5)
                    .reverse()
                    .map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-blue-400/10 bg-slate-950/50 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {a.name}
                          </p>
                          <p className="text-xs text-slate-400">{a.time}</p>
                        </div>

                        <SeverityBadge severity={a.severity} />
                      </div>
                    ))}
                </div>
              </div>
            </CyberPanel>
          )}

          {/* NOTES */}
          {/* NOTES */}
          {activeTab === "notes" && (
            <CyberPanel className="mt-4">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                  📝 Analyst Notes
                </p>
                <h4 className="mt-2 text-xl font-black text-white">
                  Investigation Notes
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Document findings, response decisions and investigation context.
                </p>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2">
                <ActionButton
                  size="sm"
                  tone="blue"
                  onClick={() =>
                    appendAnalystNote(
                      `Initial triage:\n- Alert reviewed: ${selected.name}\n- Source IP: ${selected.ip}\n- Severity: ${selected.severity}\n- Status: ${selectedStatus}`
                    )
                  }
                >
                  Add Triage Template
                </ActionButton>

                <ActionButton
                  size="sm"
                  tone="orange"
                  onClick={() =>
                    appendAnalystNote(
                      `Containment note:\n- Source ${selected.ip} requires containment review.\n- Recommended action: block source and monitor related events.`
                    )
                  }
                >
                  Add Containment
                </ActionButton>
              </div>

              <textarea
                value={analystNotes}
                onChange={(e) => setAnalystNotes(e.target.value)}
                placeholder="Add investigation notes, findings, or response decisions..."
                className="min-h-[170px] w-full rounded-2xl border border-blue-400/10 bg-slate-950/70 p-4 text-sm leading-relaxed text-slate-100 outline-none placeholder:text-slate-600 focus:border-blue-500/40"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-400">
                  Saved notes: {getSavedNotesCount()}
                </p>

                <div className="flex flex-wrap gap-2">
                  <ActionButton size="sm" tone="green" onClick={saveAnalystNotes}>
                    Save Notes
                  </ActionButton>

                  <ActionButton size="sm" tone="slate" onClick={resetLocalWorkflowData}>
                    Reset Local Data
                  </ActionButton>
                </div>
              </div>

              {notesByIncident[selected.id] && (
                <div className="mt-4 rounded-2xl border border-blue-400/10 bg-slate-950/55 p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                    Last Saved Note
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                    {notesByIncident[selected.id]}
                  </p>
                </div>
              )}
            </CyberPanel>
          )}

          {/* REPORT */}
          {activeTab === "report" && (
            <CyberPanel className="mt-4">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                  📄 Incident Report
                </p>
                <h4 className="mt-2 text-xl font-black text-white">
                  Exportable Case Summary
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Generate analyst-ready evidence reports for handoff or portfolio demo.
                </p>
              </div>

              <pre className="max-h-[360px] overflow-auto rounded-2xl border border-blue-400/10 bg-black/50 p-4 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                {generatedReport}
              </pre>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <ActionButton
                  size="sm"
                  tone="blue"
                  onClick={() => {
                    downloadReport(generatedReport, selected);
                    showToast("TXT incident report exported", "success");
                    addActivityLog("TXT incident report exported", "success");
                  }}
                >
                  Export TXT
                </ActionButton>

                <ActionButton
                  size="sm"
                  tone="purple"
                  onClick={() => {
                    downloadPDFReport(
                      selected,
                      analysis,
                      ai,
                      timeline,
                      notesByIncident[selected.id] || analystNotes,
                      selectedPriority,
                      selectedStatus
                    );
                    showToast("PDF incident report exported", "success");
                    addActivityLog("PDF incident report exported", "success");
                  }}
                >
                  Export PDF
                </ActionButton>

                <ActionButton
                  size="sm"
                  tone="green"
                  onClick={() => {
                    appendAnalystNote("Verdict: Incident classified as TRUE POSITIVE.");
                    showToast("Marked as True Positive", "success");
                    addActivityLog("Incident marked as True Positive", "success");
                  }}
                >
                  True Positive
                </ActionButton>

                <ActionButton
                  size="sm"
                  tone="red"
                  onClick={() => {
                    appendAnalystNote("Verdict: Incident classified as FALSE POSITIVE.");
                    showToast("Marked as False Positive", "warning");
                    addActivityLog("Incident marked as False Positive", "warning");
                  }}
                >
                  False Positive
                </ActionButton>
              </div>
            </CyberPanel>
          )}

          {/* ACTIVITY */}
          {activeTab === "activity" && (
            <CyberPanel className="mt-4">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
                  📌 Audit Trail
                </p>
                <h4 className="mt-2 text-xl font-black text-white">
                  Analyst Activity Log
                </h4>
                <p className="mt-1 text-sm text-slate-400">
                  Timeline of analyst actions performed on this incident.
                </p>
              </div>

              {activityLog.filter((entry) => entry.incidentId === selected.id).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-blue-400/20 bg-slate-950/40 p-4 text-sm text-slate-400">
                  No analyst activity recorded for this incident yet.
                </div>
              ) : (
                <div className="relative pl-4">
                  <div className="absolute left-1 top-0 h-full w-[2px] bg-blue-500/20" />

                  <div className="space-y-4">
                    {activityLog
                      .filter((entry) => entry.incidentId === selected.id)
                      .map((entry) => (
                        <div key={entry.id} className="relative flex gap-3">
                          <span
                            className={`mt-1 h-2.5 w-2.5 rounded-full shadow-[0_0_12px] ${entry.type === "success"
                                ? "bg-emerald-400 shadow-emerald-400/60"
                                : entry.type === "warning"
                                  ? "bg-orange-400 shadow-orange-400/60"
                                  : entry.type === "error"
                                    ? "bg-red-400 shadow-red-400/60"
                                    : "bg-blue-400 shadow-blue-400/60"
                              }`}
                          />

                          <div className="flex-1 rounded-2xl border border-blue-400/10 bg-slate-950/55 p-3">
                            <div className="mb-1 flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-slate-100">
                                {entry.action}
                              </p>
                              <span className="font-mono text-xs text-slate-500">
                                {entry.time}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400">{entry.incidentName}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CyberPanel>
          )}
        </CyberPanel>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`min-w-[280px] max-w-sm rounded-xl border px-4 py-3 shadow-xl shadow-black/30 backdrop-blur transition-all duration-300 ${getToastClass(toast.type)}`}          >
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function generateRandomAlert() {
  const types = [
    {
      name: "SSH Brute Force Attack",
      severity: "high",
      tag: "Bruteforce",
      logs: [
        "Failed login root",
        "Failed login admin",
        "SUCCESS login root",
      ],
    },
    {
      name: "Suspicious PowerShell Execution",
      severity: "critical",
      tag: "Execution",
      logs: [
        "Encoded command detected",
        "Mimikatz pattern found",
        "Privilege escalation attempt",
      ],
    },
    {
      name: "Port Scan Detected",
      severity: "medium",
      tag: "Reconnaissance",
      logs: [
        "Multiple ports scanned",
        "Nmap signature detected",
      ],
    },
  ];

  const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;

  const type = types[Math.floor(Math.random() * types.length)];

  return {
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    name: type.name,
    severity: type.severity,
    ip,
    tag: type.tag,
    status: "open",
    logs: type.logs,
  };
}

function generateAttackScenario() {
  const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;

  return [
    {
      name: "Port Scan Detected",
      severity: "medium",
      tag: "Reconnaissance",
      logs: ["Nmap scan detected", "Multiple ports scanned"],
    },
    {
      name: "SSH Brute Force Attack",
      severity: "high",
      tag: "Bruteforce",
      logs: [
        "Failed login root",
        "Failed login admin",
        "Multiple attempts detected",
      ],
    },
    {
      name: "Successful Login",
      severity: "high",
      tag: "Credential Access",
      logs: ["Login success root", "New session opened"],
    },
    {
      name: "Privilege Escalation",
      severity: "critical",
      tag: "Privilege Escalation",
      logs: ["Sudo abuse detected", "Root privileges granted"],
    },
    {
      name: "Data Exfiltration",
      severity: "critical",
      tag: "Exfiltration",
      logs: [
        "Large data transfer",
        "Suspicious outbound traffic",
        "FLAG{data_exfiltration_detected}"
      ],
    },
  ].map((step, index) => ({
    id: Date.now() + index,
    time: new Date().toLocaleTimeString(),
    ip,
    status: "open",
    ...step,
  }));
}
