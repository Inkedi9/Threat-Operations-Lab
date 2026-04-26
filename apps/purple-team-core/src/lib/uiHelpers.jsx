import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Shield,
  Terminal,
} from "lucide-react";

/* ========================================
   🎨 UI Helpers
======================================== */

export function coverageTone(value) {
  if (value >= 80) return "text-cyber-green";
  if (value >= 50) return "text-cyber-amber";
  return "text-cyber-red";
}

export function eventAccent(type) {
  switch (type) {
    case "attack":
      return "border-l-cyber-red";
    case "alert":
      return "border-l-cyber-blue";
    case "purple":
      return "border-l-cyber-violet";
    case "log":
      return "border-l-cyan-500";
    case "campaign":
      return "border-l-cyber-amber";
    default:
      return "border-l-slate-500";
  }
}

export function eventIcon(type) {
  switch (type) {
    case "attack":
      return <Activity className="h-4 w-4 text-cyber-red" />;
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-cyber-blue" />;
    case "purple":
      return <Shield className="h-4 w-4 text-cyber-violet" />;
    case "log":
      return <Terminal className="h-4 w-4 text-cyan-400" />;
    case "campaign":
      return <CheckCircle2 className="h-4 w-4 text-cyber-amber" />;
    default:
      return <Eye className="h-4 w-4 text-cyber-muted" />;
  }
}
