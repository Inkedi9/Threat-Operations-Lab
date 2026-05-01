import { statusTone } from "../../lib/constants";

export default function StatusBadge({ status }) {
    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusTone[status] || statusTone.safe}`}>
            {status.replace(/-/g, " ")}
        </span>
    );
}