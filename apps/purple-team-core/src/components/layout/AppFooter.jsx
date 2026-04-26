/* ========================================
   🦶 Global App Footer
======================================== */

export default function AppFooter() {
    return (
        <footer className="mt-6 border-t border-cyber-border bg-cyber-panel/60 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 text-xs text-cyber-muted md:flex-row">
                <div className="flex items-center gap-2">
                    <span className="text-cyber-text">Purple Team Lab</span>
                    <span>•</span>
                    <span>Cybersecurity Validation Platform</span>
                </div>

                <div className="flex items-center gap-2">
                    <span>React</span>
                    <span>•</span>
                    <span>Vite</span>
                    <span>•</span>
                    <span>Tailwind</span>
                </div>
            </div>
        </footer>
    );
}