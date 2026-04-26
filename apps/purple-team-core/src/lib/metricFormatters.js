/* ========================================
   📊 Metric Formatters
======================================== */

export function formatPercent(value, fallback = "0%") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback;
  }

  return `${Math.round(Number(value))}%`;
}

export function formatCount(value, fallback = "0") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback;
  }

  return String(value);
}

export function formatDurationSeconds(value, fallback = "N/A") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback;
  }

  const totalSeconds = Math.max(0, Math.round(Number(value)));

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes < 60) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function formatScore(value, fallback = "0%") {
  return formatPercent(value, fallback);
}

export function formatCoverage(value, fallback = "0%") {
  return formatPercent(value, fallback);
}

export function formatMomentum(value, fallback = "0%") {
  return formatPercent(value, fallback);
}
