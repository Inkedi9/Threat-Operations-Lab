export function enrichEvent(baseEvent, index) {
  const now = Date.now();

  return {
    ...baseEvent,
    id: crypto.randomUUID(),
    timestamp: new Date(now + index * 1200).toISOString(),
    severity: getSeverity(baseEvent.type),
    source: getSource(baseEvent.type),
  };
}

function getSeverity(type) {
  switch (type) {
    case "attack":
      return "high";
    case "alert":
      return "medium";
    case "log":
      return "low";
    default:
      return "low";
  }
}

function getSource(type) {
  switch (type) {
    case "attack":
      return "endpoint";
    case "alert":
      return "siem";
    case "log":
      return "system";
    default:
      return "unknown";
  }
}
