import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function LinkedIncidentBanner({ incident }) {
    if (!incident?.incidentId) return null;

    return (
        <div className="mb-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 shadow-lg shadow-blue-500/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-blue-400" />
                        <p className="text-xs uppercase tracking-widest text-blue-300">
                            Linked SOC Investigation
                        </p>
                    </div>

                    <p className="text-lg font-bold text-white">{incident.incidentId}</p>

                    <p className="mt-2 text-sm leading-6 text-soc-muted">
                        Imported from Purple Team Lab
                        {incident.user ? ` · user: ${incident.user}` : ""}
                        {incident.ip ? ` · ip: ${incident.ip}` : ""}
                        {incident.technique ? ` · MITRE: ${incident.technique}` : ""}
                    </p>
                </div>

                {incident.returnTo && (
                    <a
                        href={incident.returnTo}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/20"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Return to Purple Team Lab
                    </a>
                )}
            </div>
        </div>
    );
}