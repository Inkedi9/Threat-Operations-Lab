import { X, Keyboard } from "lucide-react";

/* ========================================
   ⌨️ Keyboard Shortcuts Overlay
======================================== */

const SHORTCUT_GROUPS = [
    {
        title: "Navigation",
        items: [
            { key: "1", action: "Aller sur Dashboard" },
            { key: "2", action: "Aller sur Red Side" },
            { key: "3", action: "Aller sur Purple Side" },
            { key: "4", action: "Aller sur Blue Side" },
            { key: "5", action: "Aller sur Rules Lab" },
            { key: "6", action: "Aller sur War Room" },
            { key: "7", action: "Aller sur Analytics" },
            { key: "8", action: "Aller sur Output" },
        ],
    },
    {
        title: "Actions globales",
        items: [
            { key: "?", action: "Afficher / fermer les raccourcis" },
            { key: "Esc", action: "Fermer l’overlay / quitter le fullscreen" },
            { key: "R", action: "Lancer la simulation" },
            { key: "W", action: "Ouvrir directement War Room" },
            { key: "F", action: "Toggle fullscreen War Room" },
        ],
    },
];

export default function KeyboardShortcutsOverlay({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <div className="w-full max-w-4xl rounded-[28px] p-5 liquid-glass">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyber-violet">
                            <Keyboard className="h-4 w-4" />
                            Keyboard Shortcuts
                        </div>

                        <h2 className="text-2xl font-bold text-white md:text-3xl">
                            Navigation & Control Overlay
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                            Utilise les raccourcis clavier pour naviguer rapidement dans la plateforme,
                            lancer une simulation et contrôler la War Room.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {SHORTCUT_GROUPS.map((group) => (
                        <div
                            key={group.title}
                            className="rounded-3xl border border-white/10 bg-black/20 p-4"
                        >
                            <p className="mb-4 text-sm font-semibold text-white">{group.title}</p>

                            <div className="space-y-3">
                                {group.items.map((item) => (
                                    <div
                                        key={`${group.title}-${item.key}`}
                                        className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 liquid-glass-soft"
                                    >
                                        <span className="text-sm text-white/80">{item.action}</span>

                                        <span className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 font-mono text-xs text-white">
                                            {item.key}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                        Tip
                    </p>
                    <p className="mt-1 text-sm text-white/75">
                        Les raccourcis sont ignorés quand tu écris dans un input, un textarea ou un éditeur.
                    </p>
                </div>
            </div>
        </div>
    );
}