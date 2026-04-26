export function PhishMetric({ label, value, tone = "teal" }) {
    const tones = {
        teal: "border-teal-400/20 bg-teal-400/10 text-teal-300",
        red: "border-red-500/20 bg-red-500/10 text-red-300",
        green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
        slate: "border-[#303741] bg-[#151a20] text-slate-300",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
            <p className="text-xs uppercase tracking-[0.16em] opacity-80">{label}</p>
            <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>
    );
}