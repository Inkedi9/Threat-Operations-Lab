export default function AppShell({ children }) {
    return (
        <main className="command-grid min-h-screen px-4 py-6 md:px-8">
            <div className="noise-layer" />
            <div className="command-scanline" />

            <div className="mx-auto max-w-[1500px] space-y-6">{children}</div>
        </main>
    );
}