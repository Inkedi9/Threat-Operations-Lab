export default function ProgressBar({ current, total }) {
    const width = total ? (current / total) * 100 : 0;

    return (
        <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm text-muted">
                <span>Progress</span>
                <span>
                    {current}/{total}
                </span>
            </div>
            <div className="h-3 rounded-full bg-slate-800">
                <div
                    className="h-3 rounded-full bg-accent transition-all"
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}