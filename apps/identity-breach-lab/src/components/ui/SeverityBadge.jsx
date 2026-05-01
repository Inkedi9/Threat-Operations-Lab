import { severityTone } from "../../lib/constants";

export default function SeverityBadge({ severity }) {
    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${severityTone[severity] || severityTone.low}`}>
            {severity}
        </span>
    );
}