import { motion } from "framer-motion";

export default function MetricCard({ label, value, helper, icon: Icon }) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            className="glass-panel premium-hover rounded-3xl p-5"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-command-muted">
                        {label}
                    </p>

                    <p className="mt-3 text-3xl font-black tracking-tight text-command-text">
                        {value}
                    </p>

                    {helper && (
                        <p className="mt-2 text-sm leading-5 text-command-muted">
                            {helper}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
                        <Icon size={21} />
                    </div>
                )}
            </div>

            <div className="mt-5 h-1 overflow-hidden rounded-full bg-stone-900">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-orange-500" />
            </div>
        </motion.div>
    );
}