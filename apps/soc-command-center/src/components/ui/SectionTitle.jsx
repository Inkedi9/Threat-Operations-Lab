export function SectionTitle({ icon: Icon, title, subtitle }) {
    return (
        <div className="mb-4 flex items-center gap-3">
            {Icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300">
                    <Icon className="h-5 w-5" />
                </div>
            )}

            <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
                    {title}
                </h3>
                {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
            </div>
        </div>
    );
}