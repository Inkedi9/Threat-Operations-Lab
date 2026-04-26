export function PhishLayout({ children }) {
    return (
        <main className="mx-auto min-h-[calc(100vh-64px)] max-w-7xl px-6 py-10">
            {children}
        </main>
    );
}