import { CheckCircle2, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ toast, onClose }) {
    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.96 }}
                    className="fixed right-5 top-5 z-50 w-[calc(100%-2.5rem)] max-w-md rounded-3xl border border-amber-500/25 bg-black/90 p-4 shadow-amberGlow backdrop-blur-xl"
                >
                    <div className="flex items-start gap-3">
                        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-2 text-green-300">
                            {toast.type === "info" ? <Info size={18} /> : <CheckCircle2 size={18} />}
                        </div>

                        <div className="flex-1">
                            <p className="font-black text-command-text">{toast.title}</p>
                            <p className="mt-1 text-sm leading-5 text-command-muted">
                                {toast.message}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="rounded-xl p-1 text-command-muted transition hover:bg-white/10 hover:text-command-text"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}