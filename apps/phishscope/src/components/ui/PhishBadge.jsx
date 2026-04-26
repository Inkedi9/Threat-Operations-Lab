export function PhishBadge({ children, tone = "teal" }) {
    const tones = {
        teal: "border-teal-400/25 bg-teal-400/10 text-teal-300",
        slate: "border-[#303741] bg-[#151a20] text-slate-300",
        red: "border-red-500/25 bg-red-500/10 text-red-300",
        orange: "border-orange-500/25 bg-orange-500/10 text-orange-300",
        green: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        amber: "border-amber-500/25 bg-amber-500/10 text-amber-300",
    };

    return (
        <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
            {children}
        </span>
    );
}