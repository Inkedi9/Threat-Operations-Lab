export default function Panel({ title, subtitle, children, actions, tone = "default" }) {
    const toneClass = tone === "critical" ? "panel-red-soft" : "panel";

    return (
        <section className={`${toneClass} p-5`}>
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-ink">{title}</h3>
                    {subtitle ? (
                        <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p>
                    ) : null}
                </div>
                {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
            {children}
        </section>
    );
}
