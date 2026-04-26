/* ========================================
   🌐 Linked Incident Banner
======================================== */

export default function LinkedIncidentBanner({
    incidentId,
    title = "Linked Incident",
    context = "",
    returnTo,
}) {
    if (!incidentId) return null;

    return (
        <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/10 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        {title}
                    </p>

                    <p className="mt-2 text-lg font-bold text-white">
                        {incidentId}
                    </p>

                    {context && (
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            {context}
                        </p>
                    )}
                </div>

                {returnTo && (
                    <a
                        href={returnTo}
                        className="inline-flex rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/20"
                    >
                        Return to Purple Team Lab
                    </a>
                )}
            </div>
        </div>
    );
}