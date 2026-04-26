import {
    AlertTriangle,
    Server,
    UserX,
    Radar,
    Activity,
    ShieldCheck,
} from "lucide-react";
import MetricCard from "./MetricCard";

export default function IncidentOverview({
    incident,
    riskScore,
    remediationProgress,
}) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <MetricCard
                label="Severity"
                value={incident.severity}
                helper="Escalated incident"
                icon={AlertTriangle}
            />
            <MetricCard
                label="Current Risk"
                value={`${riskScore}/100`}
                helper="Live reduction score"
                icon={Activity}
            />
            <MetricCard
                label="Users"
                value={incident.compromisedUsers.length}
                helper="Compromised identities"
                icon={UserX}
            />
            <MetricCard
                label="Assets"
                value={incident.impactedAssets.length}
                helper="Impacted systems"
                icon={Server}
            />
            <MetricCard
                label="IoCs"
                value={
                    incident.iocs.domains.length +
                    incident.iocs.ips.length +
                    incident.iocs.hashes.length
                }
                helper="Active indicators"
                icon={Radar}
            />
            <MetricCard
                label="Progress"
                value={`${remediationProgress}%`}
                helper="Remediation"
                icon={ShieldCheck}
            />
        </section>
    );
}