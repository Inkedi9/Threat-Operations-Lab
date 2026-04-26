import { cn } from "@/lib/utils";
import { CyberPanel } from "./CyberPanel";

export function MetricCard({ title, value, icon: Icon, tone = "blue" }) {
    const tones = {
        blue: {
            value: "text-blue-300",
            icon: "border-blue-500/30 bg-blue-500/10 text-blue-300",
        },
        red: {
            value: "text-red-300",
            icon: "border-red-500/30 bg-red-500/10 text-red-300",
        },
        orange: {
            value: "text-orange-300",
            icon: "border-orange-500/30 bg-orange-500/10 text-orange-300",
        },
        cyan: {
            value: "text-cyan-300",
            icon: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
        },
        green: {
            value: "text-emerald-300",
            icon: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        },
    };

    return (
        <CyberPanel variant="metric">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        {title}
                    </p>
                    <p className={cn("mt-3 text-3xl font-black", tones[tone].value)}>
                        {value}
                    </p>
                </div>

                <div
                    className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl border",
                        tones[tone].icon
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </CyberPanel>
    );
}