export default function TopHeader({ onReset }) {
    return (
        <header className="panel-red grid-bg overflow-hidden p-6">
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.32em] text-danger">
                        Identity Threat Simulation
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                        Simulate identity compromise, privilege escalation and lateral movement
                    </h2>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                        A portfolio-ready cyber web app to visualize compromised accounts,
                        abused access paths and critical assets reached across a corporate
                        identity environment.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button className="rounded-2xl border border-danger/30 bg-danger px-4 py-3 text-sm font-semibold text-white transition hover:bg-dangerDeep">
                        Launch Scenario
                    </button>

                    <button className="rounded-2xl border border-line/80 bg-zinc-950/50 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10">
                        View Attack Chain
                    </button>

                    <button
                        onClick={onReset}
                        className="rounded-2xl border border-line/80 bg-black/40 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-danger/20 hover:bg-danger/10"
                    >
                        Reset Simulation
                    </button>
                </div>
            </div>
        </header>
    );
}
