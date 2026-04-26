import { Clock3 } from "lucide-react";

export default function ResponseTimeline({ timeline }) {
    return (
        <section className="glass-panel rounded-[2rem] p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                        Response Timeline
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-command-text">
                        Incident Progression
                    </h2>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
                    <Clock3 size={22} />
                </div>
            </div>

            <div className="mt-7 space-y-5">
                {timeline.map((event, index) => (
                    <div key={event.id} className="relative flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-amber-400 blur-md" />
                                <div className="relative h-3.5 w-3.5 rounded-full bg-amber-300" />
                            </div>

                            {index !== timeline.length - 1 && (
                                <div className="mt-2 h-full min-h-14 w-px bg-gradient-to-b from-amber-500/50 to-transparent" />
                            )}
                        </div>

                        <div className="premium-hover flex-1 rounded-3xl border border-white/5 bg-black/35 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                                    {event.phase}
                                </p>
                                <p className="font-mono text-xs text-command-muted">
                                    {event.time}
                                </p>
                            </div>

                            <h3 className="mt-3 font-black text-command-text">
                                {event.title}
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-command-muted">
                                {event.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}