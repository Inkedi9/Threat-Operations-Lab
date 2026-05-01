import { graphLinks } from "../data/environment";

const COMPROMISED_STATUSES = new Set(["compromised", "privileged-compromised"]);
const CROWN_JEWEL_IDS = new Set(["dc-01", "srv-db-01"]);

function buildAdjacency(edges = []) {
  const adjacency = new Map();

  edges.forEach(({ from, to }) => {
    if (!adjacency.has(from)) adjacency.set(from, []);
    if (!adjacency.has(to)) adjacency.set(to, []);

    adjacency.get(from).push(to);
    adjacency.get(to).push(from);
  });

  return adjacency;
}

function shortestDistance(startId, targetIds, adjacency) {
  if (!startId) return null;

  const queue = [{ id: startId, distance: 0 }];
  const visited = new Set([startId]);

  while (queue.length) {
    const current = queue.shift();

    if (targetIds.has(current.id)) {
      return current.distance;
    }

    const neighbors = adjacency.get(current.id) || [];
    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ id: neighbor, distance: current.distance + 1 });
      }
    });
  }

  return null;
}

function buildInferredRiskLinks(state) {
  const links = [];
  const addLink = (from, to) => {
    if (from && to) links.push({ from, to });
  };

  state.users
    .filter((user) => COMPROMISED_STATUSES.has(user.status))
    .forEach((user) => {
      addLink(user.id, user.machineId);

      if (user.machineId === "ws-04") {
        addLink("ws-04", "srv-file-02");
        addLink("srv-file-02", "srv-db-01");
      }

      if (user.machineId === "ws-02" || user.groups?.includes("grp-local-admins")) {
        addLink(user.machineId, "adm-01");
        addLink("adm-01", "dc-01");
      }

      if (user.machineId === "adm-01" || user.status === "privileged-compromised") {
        addLink("adm-01", "dc-01");
        addLink("adm-01", "srv-file-02");
        addLink("srv-file-02", "srv-db-01");
      }
    });

  state.systems
    .filter((system) => system.status === "impacted")
    .forEach((system) => {
      if (system.id === "ws-04") addLink("ws-04", "srv-file-02");
      if (system.id === "ws-02") addLink("ws-02", "adm-01");
      if (system.id === "adm-01") addLink("adm-01", "dc-01");
      if (system.id === "srv-file-02") addLink("srv-file-02", "srv-db-01");
    });

  return links;
}

function scoreCrownDistance(state) {
  const adjacency = buildAdjacency([...graphLinks, ...buildInferredRiskLinks(state)]);
  const compromisedUsers = state.users.filter((user) =>
    COMPROMISED_STATUSES.has(user.status),
  );

  const distances = compromisedUsers
    .map((user) => shortestDistance(user.id, CROWN_JEWEL_IDS, adjacency))
    .filter((distance) => distance !== null);

  if (!distances.length) return 0;

  const nearest = Math.min(...distances);
  if (nearest <= 2) return 20;
  if (nearest <= 4) return 14;
  if (nearest <= 6) return 8;

  return 4;
}

export function computeRiskScore(state) {
  const compromisedUsers = state.users.filter((user) =>
    COMPROMISED_STATUSES.has(user.status),
  ).length;

  const privilegedCompromised = state.users.filter(
    (user) => user.status === "privileged-compromised",
  ).length;

  const elevatedCompromised = state.users.filter(
    (user) =>
      user.status === "compromised" &&
      ["elevated", "privileged"].includes(user.privilege),
  ).length;

  const impactedSystems = state.systems.filter(
    (system) => system.status === "impacted",
  ).length;

  const criticalReached = state.systems.filter(
    (system) =>
      system.criticality === "critical" && system.status === "impacted",
  ).length;

  const completedAttackSteps = state.attackPath.filter((step) => step.complete).length;
  const lateralEvents = state.events.filter(
    (event) => event.category === "lateral-movement",
  ).length;

  const raw =
    compromisedUsers * 12 +
    elevatedCompromised * 10 +
    privilegedCompromised * 22 +
    impactedSystems * 8 +
    criticalReached * 18 +
    completedAttackSteps * 5 +
    lateralEvents * 7 +
    scoreCrownDistance(state);

  return Math.min(Math.round(raw), 100);
}
