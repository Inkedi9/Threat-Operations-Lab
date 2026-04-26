import { UserX, KeyRound, ShieldCheck } from "lucide-react";

export default function IdentityStatusCard({ name, contained, remediated }) {
    const privileged = name.includes("admin");

    return (
        <div className="premium-hover rounded-3xl border border-white/5 bg-black/35 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-mono text-xl font-black text-command-text">{name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-command-muted">
                        Compromised Identity
                    </p>
                </div>

                <div
                    className={`rounded-2xl border p-3 ${privileged
                            ? "border-red-500/25 bg-red-500/10 text-red-300"
                            : "border-orange-500/25 bg-orange-500/10 text-orange-300"
                        }`}
                >
                    <UserX size={20} />
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <Info
                    label="Privilege"
                    value={privileged ? "Privileged" : "Standard"}
                    tone={privileged ? "text-red-300" : "text-orange-300"}
                />
                <Info
                    label="Session"
                    value={contained ? "Revoked" : "Active"}
                    tone={contained ? "text-green-300" : "text-red-300"}
                />
            </div>

            <div className="mt-5 space-y-3">
                <StatusLine
                    icon={KeyRound}
                    label="Before"
                    value="Credential abused"
                    tone="text-red-300"
                />
                <StatusLine
                    icon={ShieldCheck}
                    label="Containment"
                    value={contained ? "Account controlled" : "Disable pending"}
                    tone={contained ? "text-green-300" : "text-command-muted"}
                />
                <StatusLine
                    icon={ShieldCheck}
                    label="Remediation"
                    value={remediated ? "Password reset / MFA" : "Not started"}
                    tone={remediated ? "text-green-300" : "text-command-muted"}
                />
            </div>

            <div className="mt-5 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-3 text-xs leading-5 text-command-muted">
                Recommended: revoke sessions, reset credentials, enforce MFA and review
                privileged group memberships.
            </div>
        </div>
    );
}

function Info({ label, value, tone }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/35 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-command-muted">
                {label}
            </p>
            <p className={`mt-1 text-sm font-black ${tone}`}>{value}</p>
        </div>
    );
}

function StatusLine({ icon: Icon, label, value, tone }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-black/25 px-3 py-2">
            <div className="flex items-center gap-2">
                <Icon size={15} className={tone} />
                <span className="text-xs text-command-muted">{label}</span>
            </div>
            <span className={`text-xs font-bold ${tone}`}>{value}</span>
        </div>
    );
}