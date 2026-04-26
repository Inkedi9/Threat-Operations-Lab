import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/* ========================================
   ⬆️ Scroll To Top Button
======================================== */

export default function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    /* ----------------------------------------
       👀 Show button on scroll
    ---------------------------------------- */
    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 280);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* ----------------------------------------
       ⬆️ Scroll to top action
    ---------------------------------------- */
    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!visible) return null;

    return (
        <button
            onClick={handleScrollTop}
            className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyber-violet/30 bg-cyber-panel/80 text-cyber-text shadow-[0_0_20px_rgba(139,92,246,0.16)] backdrop-blur transition hover:border-cyber-violet/50 hover:bg-cyber-violet/10"
            aria-label="Scroll to top"
            title="Scroll to top"
        >
            <ArrowUp className="h-4 w-4" />
        </button>
    );
}