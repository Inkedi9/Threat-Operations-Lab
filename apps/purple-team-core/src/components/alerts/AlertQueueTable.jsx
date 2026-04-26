import { AlertTriangle, Eye, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import PanelCard from "../ui/PanelCard";
import PanelHeader from "../ui/PanelHeader";
import EmptyState from "../ui/EmptyState";

/* ========================================
   🚨 Alert Queue Table
======================================== */

export default function AlertQueueTable({
  alerts = [],
  selectedAlertId,
  onSelectAlert,
  onUpdateAlertStatus,
}) {
  const sortedAlerts = useMemo(() => {
    const order = {
      open: 0,
      investigating: 1,
      closed: 2,
    };

    return [...alerts].sort((a, b) => {
      const aValue = order[a.triageStatus ?? "open"] ?? 99;
      const bValue = order[b.triageStatus ?? "open"] ?? 99;
      return aValue - bValue;
    });
  }, [alerts]);

  if (!alerts.length) {
    return (
      <PanelCard variant="defense">
        <PanelHeader
          icon={<ShieldCheck className="h-5 w-5 text-cyber-blue" />}
          title="Alert Triage Queue"
          subtitle="SOC-style analyst queue for triggered detections"
        />

        <div className="mt-4">
          <PanelCard variant="signal" className="border-dashed">
            <EmptyState
              icon={<AlertTriangle className="h-6 w-6 text-cyber-amber" />}
              title="No alerts yet"
              description="Trigger a simulation to populate the triage queue."
            />
          </PanelCard>
        </div>
      </PanelCard>
    );
  }

  return (
    <PanelCard variant="defense">
      <PanelHeader
        icon={<ShieldCheck className="h-5 w-5 text-cyber-blue" />}
        title="Alert Triage Queue"
        subtitle="Review, prioritize and track detection alerts"
      />

      <div className="mt-4 hidden lg:block">
        <PanelCard
          variant="signal"
          padded={false}
          className="overflow-hidden"
          live={alerts.length > 0}
          hotLevel={alerts.some((alert) => String(alert.severity ?? "").toLowerCase() === "high") ? "low" : "none"}
        >
          <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.6fr] border-b border-white/[0.06] bg-black/20 px-4 py-3 text-xs uppercase tracking-[0.18em] text-cyber-muted">
            <span>Alert</span>
            <span>Severity</span>
            <span>Status</span>
            <span>Source</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {sortedAlerts.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                selected={selectedAlertId === alert.id}
                onSelectAlert={onSelectAlert}
                onUpdateAlertStatus={onUpdateAlertStatus}
              />
            ))}
          </div>
        </PanelCard>
      </div>

      <div className="mt-4 space-y-3 lg:hidden">
        {sortedAlerts.map((alert) => (
          <AlertMobileCard
            key={alert.id}
            alert={alert}
            selected={selectedAlertId === alert.id}
            onSelectAlert={onSelectAlert}
            onUpdateAlertStatus={onUpdateAlertStatus}
          />
        ))}
      </div>
    </PanelCard>
  );
}

/* ========================================
   🧩 Desktop Row
======================================== */

function AlertRow({
  alert,
  selected,
  onSelectAlert,
  onUpdateAlertStatus,
}) {
  const severity = String(alert.severity ?? "medium").toLowerCase();
  const isHigh = severity === "high";

  const rowClass = selected
    ? "bg-cyber-violet/10"
    : isHigh
      ? "bg-[linear-gradient(180deg,rgba(40,10,14,0.20),rgba(12,8,10,0.82))] hover:bg-[linear-gradient(180deg,rgba(50,10,14,0.24),rgba(14,8,10,0.9))]"
      : "bg-[linear-gradient(180deg,rgba(14,18,28,0.88),rgba(9,12,18,0.96))] hover:bg-[linear-gradient(180deg,rgba(18,24,36,0.92),rgba(10,14,22,0.98))]";

  return (
    <div
      className={[
        "relative grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.6fr] items-center px-4 py-3 transition-all duration-200",
        rowClass,
        selected && isHigh ? "shadow-[0_0_26px_rgba(239,68,68,0.10)]" : "",
      ].join(" ")}
    >
      {(selected || isHigh) && (
        <div
          className={[
            "absolute inset-y-0 left-0 w-[3px]",
            selected
              ? "bg-cyber-violet shadow-[0_0_14px_rgba(139,92,246,0.35)]"
              : "bg-cyber-red shadow-[0_0_14px_rgba(239,68,68,0.32)]",
          ].join(" ")}
        />
      )}

      {selected && isHigh && (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(239,68,68,0.03),transparent)] animate-[panelScanSweep_3.2s_linear_infinite]" />
      )}

      <div className="min-w-0 pr-3 pl-2">
        <p className="truncate text-sm font-semibold text-cyber-text">
          {alert.title || "Detection alert"}
        </p>
        <p className="mt-1 truncate text-xs text-cyber-muted">
          {alert.message}
        </p>
      </div>

      <div>
        <SeverityBadge severity={alert.severity} />
      </div>

      <div>
        <StatusSelect
          value={alert.triageStatus ?? "open"}
          onChange={(value) => onUpdateAlertStatus(alert.id, value)}
        />
      </div>

      <div>
        <span className="text-sm text-cyber-muted">
          {alert.source || "siem"}
        </span>
      </div>

      <div>
        <button
          onClick={() => onSelectAlert(alert)}
          className="inline-flex items-center gap-2 rounded-md border border-cyber-border bg-black/20 px-3 py-2 text-xs font-medium text-cyber-text transition hover:border-cyber-violet/40 hover:bg-cyber-violet/10"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
      </div>
    </div>
  );
}

/* ========================================
   📱 Mobile Card
======================================== */

function AlertMobileCard({
  alert,
  selected,
  onSelectAlert,
  onUpdateAlertStatus,
}) {
  const severity = String(alert.severity ?? "medium").toLowerCase();
  const variant = severity === "high" ? "threat" : "signal";

  return (
    <PanelCard
      variant={selected ? "intel" : variant}
      className="relative overflow-hidden"
      live={selected}
      stress={selected && severity === "high"}
      scan={selected && severity === "high"}
      hotLevel={
        selected && severity === "high"
          ? "high"
          : selected || severity === "high"
            ? "medium"
            : "none"
      }
    >
      {(selected || severity === "high") && (
        <div
          className={[
            "absolute inset-y-0 left-0 w-[3px]",
            selected
              ? "bg-cyber-violet shadow-[0_0_14px_rgba(139,92,246,0.35)]"
              : "bg-cyber-red shadow-[0_0_14px_rgba(239,68,68,0.32)]",
          ].join(" ")}
        />
      )}

      <div className="pl-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cyber-text">
              {alert.title || "Detection alert"}
            </p>
            <p className="mt-1 text-xs text-cyber-muted">
              {alert.message}
            </p>
          </div>

          <SeverityBadge severity={alert.severity} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-cyber-muted">
              Status
            </p>
            <StatusSelect
              value={alert.triageStatus ?? "open"}
              onChange={(value) => onUpdateAlertStatus(alert.id, value)}
            />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-cyber-muted">
              Source
            </p>
            <div className="rounded-md border border-cyber-border bg-black/20 px-3 py-2 text-sm text-cyber-muted">
              {alert.source || "siem"}
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelectAlert(alert)}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-cyber-border bg-black/20 px-3 py-2 text-sm font-medium text-cyber-text transition hover:border-cyber-violet/40 hover:bg-cyber-violet/10"
        >
          <Eye className="h-4 w-4" />
          View Alert
        </button>
      </div>
    </PanelCard>
  );
}

/* ========================================
   ⚠️ Severity Badge
======================================== */

function SeverityBadge({ severity = "medium" }) {
  const normalized = String(severity).toLowerCase();

  const styles =
    normalized === "high"
      ? "border-cyber-red/30 bg-cyber-red/10 text-cyber-red"
      : normalized === "medium"
        ? "border-cyber-amber/30 bg-cyber-amber/10 text-cyber-amber"
        : "border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue";

  return (
    <span className={`inline-flex rounded-md border px-3 py-1 text-xs font-medium uppercase ${styles}`}>
      {normalized}
    </span>
  );
}

/* ========================================
   🧭 Analyst Status Select
======================================== */

function StatusSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-md border border-cyber-border bg-black/20 px-3 py-2 text-sm text-cyber-text outline-none transition focus:border-cyber-violet"
    >
      <option value="open">Open</option>
      <option value="investigating">Investigating</option>
      <option value="closed">Closed</option>
    </select>
  );
}