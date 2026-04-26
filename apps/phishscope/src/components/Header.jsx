import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-border/80 bg-panel/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link
                    to="/"
                    className="text-2xl font-black tracking-wide text-accent drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                >
                    PhishScope
                </Link>

                <nav className="flex gap-3 text-sm text-slate-300 md:gap-6">
                    <Link
                        to="/"
                        className="rounded-lg px-3 py-2 transition hover:bg-slate-800/70 hover:text-white"
                    >
                        Home
                    </Link>
                    <Link
                        to="/simulator"
                        className="rounded-lg px-3 py-2 transition hover:bg-slate-800/70 hover:text-white"
                    >
                        Simulator
                    </Link>
                    <Link
                        to="/results"
                        className="rounded-lg px-3 py-2 transition hover:bg-slate-800/70 hover:text-white"
                    >
                        Results
                    </Link>
                    <Link
                        to="/about"
                        className="rounded-lg px-3 py-2 transition hover:bg-slate-800/70 hover:text-white"
                    >
                        About
                    </Link>
                </nav>
            </div>
        </header>
    );
}