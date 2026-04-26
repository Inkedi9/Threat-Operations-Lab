import { useMemo, useState } from "react";
import AppShell from "./components/AppShell";
import Header from "./components/Header";
import IncidentOverview from "./components/IncidentOverview";
import IncidentSummary from "./components/IncidentSummary";
import ContainmentActions from "./components/ContainmentActions";
import RemediationChecklist from "./components/RemediationChecklist";
import ResponseTimeline from "./components/ResponseTimeline";
import RiskReductionPanel from "./components/RiskReductionPanel";
import AssetStatusCard from "./components/AssetStatusCard";
import IdentityStatusCard from "./components/IdentityStatusCard";
import IocResponsePanel from "./components/IocResponsePanel";
import ReportPreview from "./components/ReportPreview";
import { incidents } from "./data/incidents";
import { getQueryContext } from "./utils/queryParams";
import {
  buildIncidentReport,
  downloadIncidentReport,
} from "./utils/reportBuilder";
import Toast from "./components/Toast";
import IntegrationContext from "./components/IntegrationContext";
import MissionStatus from "./components/MissionStatus";
import Footer from "./components/Footer";

export default function App() {
  const context = getQueryContext();

  const incident =
    incidents.find((item) => item.id === context.incidentId) || incidents[0];

  const createInitialState = () => ({
    riskScore: incident.initialRisk,
    actions: incident.containmentActions.map((action) => ({ ...action })),
    checklist: incident.remediationChecklist.map((label, index) => ({
      id: `remediation-${index}`,
      label,
      completed: false,
    })),
    timeline: incident.timeline.map((event) => ({ ...event })),
  });

  const [toast, setToast] = useState(null);

  function showToast(title, message, type = "success") {
    setToast({ title, message, type });

    setTimeout(() => {
      setToast(null);
    }, 3200);
  }

  const [state, setState] = useState(createInitialState);

  const remediationProgress = useMemo(() => {
    const completed = state.checklist.filter((item) => item.completed).length;
    return Math.round((completed / state.checklist.length) * 100);
  }, [state.checklist]);

  const completedActions = state.actions.filter(
    (action) => action.status === "completed"
  ).length;

  const report = buildIncidentReport({
    incident,
    riskScore: state.riskScore,
    actions: state.actions,
    checklist: state.checklist,
    timeline: state.timeline,
  });

  function addTimelineEntry({ phase, title, description }) {
    return {
      id: crypto.randomUUID(),
      phase,
      title,
      description,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "completed",
    };
  }

  function handleRunAction(actionId) {
    setState((prev) => {
      const action = prev.actions.find((item) => item.id === actionId);

      if (!action || action.status === "completed") {
        return prev;
      }

      const updatedActions = prev.actions.map((item) =>
        item.id === actionId ? { ...item, status: "completed" } : item
      );

      const updatedRisk = Math.max(
        prev.riskScore - action.riskReduction,
        0
      );

      showToast(
        "Containment action executed",
        `${action.label} completed on ${action.target}. Risk reduced by ${action.riskReduction} points.`
      );


      return {
        ...prev,
        riskScore: updatedRisk,
        actions: updatedActions,
        timeline: [
          ...prev.timeline,
          addTimelineEntry({
            phase: "Containment",
            title: action.label,
            description: action.result,
          }),
        ],
      };
    });
  }

  function handleToggleChecklist(itemId) {
    setState((prev) => {
      const item = prev.checklist.find((entry) => entry.id === itemId);

      const updatedChecklist = prev.checklist.map((entry) =>
        entry.id === itemId ? { ...entry, completed: !entry.completed } : entry
      );

      const nextItem = updatedChecklist.find((entry) => entry.id === itemId);

      showToast(
        nextItem?.completed ? "Remediation task completed" : "Remediation task reopened",
        item?.label || "Checklist updated",
        nextItem?.completed ? "success" : "info"
      );

      return {
        ...prev,
        checklist: updatedChecklist,
        timeline: [
          ...prev.timeline,
          addTimelineEntry({
            phase: "Remediation",
            title: item?.label || "Remediation task updated",
            description: nextItem?.completed
              ? "Remediation task marked as completed."
              : "Remediation task reopened for review.",
          }),
        ],
      };
    });
  }

  function handleReset() {
    setState(createInitialState());

    showToast(
      "Simulation reset",
      "Incident state restored to its initial risk, actions and timeline.",
      "info"
    );
  }

  function handleGenerateReport() {
    downloadIncidentReport(`${incident.id}-incident-response-report.txt`, report);

    showToast(
      "Report exported",
      "The incident response report was generated as a TXT file."
    );
  }
  const contained = completedActions > 0;
  const remediated = remediationProgress > 0;

  return (
    <AppShell>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <Header
        incident={incident}
        onReset={handleReset}
        onGenerateReport={handleGenerateReport}
      />

      <IncidentOverview
        incident={incident}
        riskScore={state.riskScore}
        remediationProgress={remediationProgress}
      />

      <IncidentSummary incident={incident} context={context} />
      <IntegrationContext context={context} />

      <div className="grid gap-6 xl:grid-cols-2">
        <ContainmentActions
          actions={state.actions}
          onRunAction={handleRunAction}
        />

        <RemediationChecklist
          checklist={state.checklist}
          onToggle={handleToggleChecklist}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ResponseTimeline timeline={state.timeline} />

        <RiskReductionPanel
          initialRisk={incident.initialRisk}
          riskScore={state.riskScore}
          completedActions={completedActions}
          remediationProgress={remediationProgress}
        />
      </div>

      <section className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                Assets Status
              </p>
              <h2 className="mt-2 text-2xl font-black text-command-text">
                Impacted Infrastructure
              </h2>
            </div>

            <p className="text-sm text-command-muted">
              Before / after containment state
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {incident.impactedAssets.map((asset) => (
              <AssetStatusCard
                key={asset}
                name={asset}
                contained={contained}
                remediated={remediated}
              />
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                Identities Status
              </p>
              <h2 className="mt-2 text-2xl font-black text-command-text">
                Compromised Access
              </h2>
            </div>

            <p className="text-sm text-command-muted">
              Sessions, privilege and recovery
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-1">
            {incident.compromisedUsers.map((user) => (
              <IdentityStatusCard
                key={user}
                name={user}
                contained={contained}
                remediated={remediated}
              />
            ))}
          </div>
        </div>
      </section>

      <IocResponsePanel incident={incident} actions={state.actions} />

      <MissionStatus
        riskScore={state.riskScore}
        remediationProgress={remediationProgress}
        completedActions={completedActions}
        totalActions={state.actions.length}
      />

      <ReportPreview
        incident={incident}
        riskScore={state.riskScore}
        actions={state.actions}
        checklist={state.checklist}
        timeline={state.timeline}
        report={report}
        onExport={handleGenerateReport}
      />
      <Footer />
    </AppShell>
  );
}
