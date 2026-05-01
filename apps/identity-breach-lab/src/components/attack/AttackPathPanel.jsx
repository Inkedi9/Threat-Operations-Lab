import Panel from "../ui/Panel";

export default function AttackPathPanel({ steps }) {
    return (
        <Panel
            title="Attack Path / Kill Chain Summary"
            subtitle="The current compromise progression through identity and access attack stages."
        >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {steps.map((step, index) => (
                    <div
                        key={step.key}
                        className={`rounded-2xl border p-4 ${step.complete
                                ? "border-danger/30 bg-danger/10 text-red-100"
                                : "border-lineSoft/60 bg-black/20 text-zinc-400"
                            }`}
                    >
                        <p className="text-xs uppercase tracking-[0.2em] opacity-70">Step {index + 1}</p>
                        <p className="mt-2 font-semibold">{step.label}</p>
                        <p className="mt-2 text-sm">{step.complete ? "Completed" : "Pending"}</p>
                    </div>
                ))}
            </div>
        </Panel>
    );
}