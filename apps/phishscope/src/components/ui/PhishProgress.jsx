export function PhishProgress({ value = 0, max = 100 }) {
    const percent = Math.min(100, Math.round((value / max) * 100));

    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>Progress</span>
                <span>
                    {value}/{max}
                </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full border border-[#303741] bg-[#101418]">
                <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#2dd4bf,#99f6e4)] shadow-[0_0_18px_rgba(45,212,191,0.28)] transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}