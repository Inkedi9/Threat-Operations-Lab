import { Home, AlertTriangle, FileText, Search, Target, GitBranch } from "lucide-react";
import socLogo from "../assets/soc-logo.svg";

const menu = [
  { name: "Dashboard", icon: Home, page: "dashboard" },
  { name: "Alerts", icon: AlertTriangle, page: "alerts" },
  { name: "Attack Story", icon: GitBranch, page: "attackstory" },
  { name: "Attack Map", icon: Target, page: "attackmap" },
  { name: "Logs", icon: FileText, page: "logs" },
  { name: "Investigations", icon: Search, page: "investigations" },
  { name: "CTF Lab", icon: Target, page: "ctf" },
];

export default function Sidebar({ setPage, currentPage, activityCount = 0 }) {
  return (
    <div className="w-64 bg-soc-panel border-r border-soc-border p-4 flex flex-col">

      {/* LOGO + TITLE */}
      <div className="flex items-center gap-3 mb-10">
        <img src={socLogo} alt="SOC Logo" className="w-10 h-10" />

        <div>
          <h1 className="text-sm font-bold text-blue-400 leading-tight">
            SOC Simulator
          </h1>
          <p className="text-xs text-soc-muted">
            Command Center
          </p>
        </div>
      </div>

      {/* MENU */}
      <ul className="space-y-2 flex-1">
        {menu.map((item, i) => {
          const isActive = currentPage === item.page;
          const savedActivity = localStorage.getItem("soc_activity_log");
          const activityCount = savedActivity ? JSON.parse(savedActivity).length : 0;

          return (
            <li
              key={i}
              onClick={() => setPage(item.page)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group
              ${isActive
                  ? "bg-blue-500/10 border border-blue-500/20 text-white"
                  : "text-soc-muted hover:bg-soc-border/40 hover:text-soc-text"
                }`}
            >
              <item.icon
                size={18}
                className={`${isActive ? "text-blue-400" : "group-hover:text-white"}`}
              />

              <span className="text-sm font-medium">
                {item.name}
              </span>

              {item.page === "investigations" && activityCount > 0 && (
                <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                  {activityCount}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* FOOTER STATUS */}
      <div className="mt-6 border-t border-soc-border pt-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-soc-muted">System</span>
          <span className="text-green-400 font-semibold">● Operational</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-soc-muted">Engine</span>
          <span className="text-blue-400">SOC v2.0</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-soc-muted">Mode</span>
          <span className="text-cyan-400">Live Monitoring</span>
        </div>
      </div>

    </div>
  );
}