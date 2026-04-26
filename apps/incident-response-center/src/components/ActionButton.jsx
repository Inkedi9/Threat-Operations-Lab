import { Play, CheckCircle2 } from "lucide-react";

export default function ActionButton({ children, onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="group flex items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-5 py-3 text-sm font-black text-amber-100 transition hover:border-amber-400/70 hover:from-amber-500/25 hover:to-orange-500/20 disabled:cursor-not-allowed disabled:border-green-500/20 disabled:bg-green-500/10 disabled:text-green-300 disabled:opacity-80"
        >
            {disabled ? <CheckCircle2 size={16} /> : <Play size={16} />}
            {children}
        </button>
    );
}