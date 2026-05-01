export function computeMetrics(state) {
  const compromisedUsers = state.users.filter((user) =>
    ["compromised", "privileged-compromised"].includes(user.status),
  );

  const privilegedAccounts = state.users.filter((user) =>
    ["elevated", "privileged"].includes(user.privilege),
  );

  const activeSessions = state.sessions.filter(
    (session) => session.status === "active",
  );

  const lateralAttempts = state.events.filter(
    (event) => event.category === "lateral-movement",
  ).length;

  const criticalAssetsReached = state.systems.filter(
    (system) =>
      system.criticality === "critical" && system.status === "impacted",
  ).length;

  return {
    users: state.users.length,
    privilegedAccounts: privilegedAccounts.length,
    compromisedIdentities: compromisedUsers.length,
    activeSessions: activeSessions.length,
    lateralMovementAttempts: lateralAttempts,
    criticalAssetsReached,
  };
}
