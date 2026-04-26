const STORAGE_KEY = "purple-team-lab-simulation-store";

export function loadPersistedSimulationState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load simulation state from localStorage:", error);
    return null;
  }
}

export function savePersistedSimulationState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save simulation state to localStorage:", error);
  }
}

export function clearPersistedSimulationState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear simulation state from localStorage:", error);
  }
}
