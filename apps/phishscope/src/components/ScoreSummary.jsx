export default function ScoreSummary({ result, email }) {
    if (!result || !email) return null;

    return (
        <div className="mt-6 rounded-2xl border border-border bg-panel p-6">
            <h3 className="mb-3 text-lg font-bold text-accent">Analysis Result</h3>
            <p className="text-sm text-slate-300">
                Score: <span className="font-bold text-white">{result.score}/100</span>
            </p>
            <p className="mt-2 text-sm text-slate-300">
                Expected: <span className="font-semibold">{email.type}</span>
            </p>
            <p className="mt-2 text-sm text-slate-300">
                Correct: <span className="font-semibold">{result.isCorrect ? "Yes" : "No"}</span>
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">{email.explanation}</p>

            {result.matchedFlags.length > 0 && (
                <div className="mt-4">
                    <p className="font-semibold text-success">Matched flags</p>
                    <p className="text-sm text-slate-300">{result.matchedFlags.join(", ")}</p>
                </div>
            )}

            {result.missedFlags.length > 0 && (
                <div className="mt-4">
                    <p className="font-semibold text-warning">Missed flags</p>
                    <p className="text-sm text-slate-300">{result.missedFlags.join(", ")}</p>
                </div>
            )}
        </div>
    );
}