import { motion as Motion } from "framer-motion";

export default function MetricCard({ label, value, hint }) {
    return (
        <Motion.div
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-line/70 bg-panel/90 p-4 shadow-soft transition hover:border-danger/30 hover:bg-panelAlt/90 hover:shadow-danger"
        >
            <p className="text-xs uppercase tracking-[0.24em] text-muted">{label}</p>

            <div className="mt-3 flex items-end justify-between gap-3">
                <Motion.span
                    key={value}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-ink"
                >
                    {value}
                </Motion.span>

                <span className="text-xs text-muted">{hint}</span>
            </div>
        </Motion.div>
    );
}
