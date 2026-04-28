import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const icons = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: Info,
};

export default function Toast({ message, type = 'info', onClose }) {
    if (!message) return null;

    const Icon = icons[type] || Info;

    const tone =
        type === 'success'
            ? 'border-success/20 bg-success/10 text-success'
            : type === 'error'
                ? 'border-danger/20 bg-danger/10 text-danger'
                : 'border-gold/20 bg-gold/10 text-gold-soft';

    return (
        <div className={`fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${tone}`}>
            <div className="flex items-start gap-3">
                <Icon size={18} className="mt-0.5 shrink-0" />
                <div className="text-sm leading-6">{message}</div>
                <button type="button" onClick={onClose} className="ml-2 text-xs opacity-70 hover:opacity-100">
                    ✕
                </button>
            </div>
        </div>
    );
}