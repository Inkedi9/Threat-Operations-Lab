import { Handle, Position } from "reactflow";

export default function GroupGraphNode({ data, selected }) {
    return (
        <div
            className={`min-w-[220px] rounded-2xl border p-3 transition ${data.replayHighlighted
                ? "border-red-300/40 bg-red-500/14 text-red-50 shadow-[0_0_26px_rgba(239,68,68,0.18)]"
                : data.pathHighlighted
                    ? "border-red-400/40 bg-red-500/12 text-red-50 shadow-[0_0_24px_rgba(239,68,68,0.16)]"
                    : data.compromised
                        ? "border-danger/30 bg-danger/10 text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.12)]"
                        : data.privileged
                            ? "border-amber-500/25 bg-amber-500/10 text-amber-100"
                            : "border-lineSoft bg-zinc-900/45 text-zinc-100"
                } ${selected ? "ring-1 ring-danger/40" : ""}`}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="!h-2.5 !w-2.5 !border-0 !bg-danger/70"
            />

            <p className="text-[10px] uppercase tracking-[0.24em] opacity-70">group</p>
            <p className="mt-2 font-semibold">{data.label}</p>
            <p className="mt-1 text-xs text-zinc-400">{data.subtitle}</p>

            <div className="mt-3 flex flex-wrap gap-2">
                {data.replayHighlighted && (
                    <span className="rounded-full border border-red-300/30 bg-red-500/14 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-red-50">
                        replay
                    </span>
                )}
                {data.pathHighlighted && (
                    <span className="rounded-full border border-red-400/30 bg-red-500/12 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-red-100">
                        attack path
                    </span>
                )}
                {data.privileged && (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-amber-200">
                        privileged
                    </span>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="!h-2.5 !w-2.5 !border-0 !bg-danger/70"
            />
        </div>
    );
}