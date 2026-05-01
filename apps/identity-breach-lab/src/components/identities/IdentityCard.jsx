import StatusBadge from "../ui/StatusBadge";
import { privilegeTone } from "../../lib/constants";

export default function IdentityCard({ user }) {
    return (
        <div className="rounded-2xl border border-line/80 bg-black/25 p-4 transition hover:border-danger/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="font-semibold text-ink">{user.name}</p>
                    <p className="text-sm text-muted">@{user.username}</p>
                </div>
                <StatusBadge status={user.status} />
            </div>

            <div className="mt-4 space-y-2 text-sm text-zinc-300">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Role</span>
                    <span>{user.role}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Privilege</span>
                    <span className={`rounded-full border px-2 py-1 text-xs ${privilegeTone[user.privilege]}`}>
                        {user.privilege}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Machine</span>
                    <span>{user.machineId}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Risk</span>
                    <span className="font-semibold text-danger">{user.riskScore}/100</span>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {user.groups.map((group) => (
                    <span key={group} className="rounded-full border border-lineSoft bg-zinc-900/45 px-2 py-1 text-xs text-zinc-300">
                        {group}
                    </span>
                ))}
            </div>
        </div>
    );
}