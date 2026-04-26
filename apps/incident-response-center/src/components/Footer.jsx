import { Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer className="pb-4 pt-2">
            <div className="glass-panel rounded-[2rem] p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300">
                            <Shield size={18} />
                        </div>

                        <div>
                            <p className="font-black text-command-text">
                                Incident Response & Remediation Center
                            </p>
                            <p className="text-sm text-command-muted">
                                Satellite module for a Purple Team cyber lab ecosystem.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs uppercase tracking-[0.2em] text-command-muted">
                        Detect → Investigate → Respond → Contain → Remediate → Report
                    </p>
                </div>
            </div>
        </footer>
    );
}