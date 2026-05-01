import { useMemo, useState } from "react";
import Panel from "../ui/Panel";
import SeverityBadge from "../ui/SeverityBadge";

export default function EventTable({ events }) {
    const [severity, setSeverity] = useState("all");
    const [category, setCategory] = useState("all");

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const severityMatch = severity === "all" || event.severity === severity;
            const categoryMatch = category === "all" || event.category === category;
            return severityMatch && categoryMatch;
        });
    }, [events, severity, category]);

    return (
        <Panel
            title="Event Log Viewer"
            subtitle="Identity and access events correlated from the simulated attack chain."
            actions={
                <div className="flex gap-2">
                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="rounded-xl border border-lineSoft bg-black/30 px-3 py-2 text-sm text-zinc-200 outline-none"
                    >
                        <option value="all">All severities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-lineSoft bg-black/30 px-3 py-2 text-sm text-zinc-200 outline-none"
                    >
                        <option value="all">All phases</option>
                        <option value="baseline">Baseline</option>
                        <option value="initial-access">Initial Access</option>
                        <option value="credential-abuse">Credential Abuse</option>
                        <option value="privilege-escalation">Privilege Escalation</option>
                        <option value="lateral-movement">Lateral Movement</option>
                        <option value="persistence">Persistence</option>
                        <option value="impact">Impact</option>
                    </select>
                </div>
            }
        >
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.2em] text-muted">
                        <tr className="border-b border-lineSoft">
                            <th className="px-3 py-3">Timestamp</th>
                            <th className="px-3 py-3">Type</th>
                            <th className="px-3 py-3">Source Identity</th>
                            <th className="px-3 py-3">Target</th>
                            <th className="px-3 py-3">Severity</th>
                            <th className="px-3 py-3">Status</th>
                            <th className="px-3 py-3">Technique</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((event) => (
                            <tr key={event.id} className="border-b border-line/80 text-zinc-300">
                                <td className="px-3 py-3">{event.timestamp}</td>
                                <td className="px-3 py-3 capitalize">{event.type}</td>
                                <td className="px-3 py-3">{event.sourceIdentity}</td>
                                <td className="px-3 py-3">{event.targetSystem}</td>
                                <td className="px-3 py-3"><SeverityBadge severity={event.severity} /></td>
                                <td className="px-3 py-3 capitalize">{event.status}</td>
                                <td className="px-3 py-3">{event.technique}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}