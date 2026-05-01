function formatKey(key) {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/[-_]/g, " ")
        .replace(/^./, (char) => char.toUpperCase());
}

function countValue(value) {
    if (Array.isArray(value)) return value.length;
    if (value && typeof value === "object") return Object.keys(value).length;
    if (value === true) return 1;
    if (!value) return 0;
    return 1;
}

function buildImpactItems(scenario) {
    const mutations = scenario?.mutations || {};
    const items = [];

    Object.entries(mutations).forEach(([key, value]) => {
        const count = countValue(value);
        if (!count) return;

        if (key.toLowerCase().includes("user")) {
            items.push({
                label: "Identity exposure",
                value: `${count} user change${count > 1 ? "s" : ""}`,
            });
            return;
        }

        if (key.toLowerCase().includes("system")) {
            items.push({
                label: "System access pressure",
                value: `${count} system change${count > 1 ? "s" : ""}`,
            });
            return;
        }

        if (key.toLowerCase().includes("session")) {
            items.push({
                label: "Active access context",
                value: `${count} session change${count > 1 ? "s" : ""}`,
            });
            return;
        }

        if (key.toLowerCase().includes("attackpath")) {
            items.push({
                label: "Attack path progression",
                value: `${count} path update${count > 1 ? "s" : ""}`,
            });
            return;
        }

        items.push({
            label: formatKey(key),
            value: `${count} change${count > 1 ? "s" : ""}`,
        });
    });

    if (scenario?.requires?.length) {
        items.push({
            label: "Chain dependency",
            value: "Extends an existing foothold",
        });
    } else {
        items.push({
            label: "Initial foothold",
            value: "Can start from baseline",
        });
    }

    if (scenario?.focusTarget) {
        items.push({
            label: "Operator focus",
            value: scenario.focusTarget,
        });
    }

    return items;
}

export default function AttackImpactPreview({ scenario }) {
    const items = buildImpactItems(scenario);

    return (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-danger">
                Attack Impact
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
                Estimated operational value unlocked by running this scenario.
            </p>

            <div className="mt-4 space-y-2">
                {items.map((item) => (
                    <div
                        key={`${item.label}-${item.value}`}
                        className="flex items-center justify-between gap-4 rounded-xl border border-line/70 bg-black/25 px-3 py-2"
                    >
                        <span className="text-sm text-zinc-400">
                            {item.label}
                        </span>

                        <span className="text-right text-sm font-semibold text-red-100">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}