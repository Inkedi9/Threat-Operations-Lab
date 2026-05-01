import { getCrownTargetIds, shortestPathToTargets } from "./graphUtils";

export function buildAttackRouteIntelligence(nodes = [], edges = []) {
  const crownTargets = getCrownTargetIds(nodes);
  const compromisedNodes = nodes.filter((node) => node.data?.compromised);
  const privilegedNodes = nodes.filter((node) => node.data?.privileged);

  const routeCandidates = compromisedNodes
    .map((node) => {
      const path = shortestPathToTargets(node.id, crownTargets, edges);

      return {
        sourceId: node.id,
        sourceLabel: node.data?.label,
        sourceType: node.data?.entityType,
        path,
        hopCount: path ? path.length - 1 : null,
      };
    })
    .filter((candidate) => candidate.path);

  routeCandidates.sort((a, b) => a.hopCount - b.hopCount);

  const bestRoute = routeCandidates[0] || null;

  const offensivePivots = privilegedNodes
    .filter((node) => !crownTargets.has(node.id))
    .slice(0, 4)
    .map((node) => ({
      id: node.id,
      label: node.data?.label,
      type: node.data?.entityType,
      subtitle: node.data?.subtitle,
    }));

  return {
    crownReachable: routeCandidates.length > 0,
    bestRoute,
    compromisedCount: compromisedNodes.length,
    privilegedCount: privilegedNodes.length,
    offensivePivots,
  };
}

export function buildRouteFromFoothold(nodes = [], edges = [], footholdId = null) {
  if (!footholdId) return null;

  const crownTargets = getCrownTargetIds(nodes);
  const sourceNode = nodes.find((node) => node.id === footholdId);
  if (!sourceNode) return null;

  const path = shortestPathToTargets(footholdId, crownTargets, edges);

  if (!path) {
    return {
      sourceId: footholdId,
      sourceLabel: sourceNode.data?.label,
      path: [],
      hopCount: null,
    };
  }

  return {
    sourceId: footholdId,
    sourceLabel: sourceNode.data?.label,
    path,
    hopCount: path.length - 1,
  };
}

export function getBestStartNodeId({
  selectedFootholdId,
  replayFootholdId,
  attackIntelligence,
  visibleNodes,
}) {
  if (selectedFootholdId) return selectedFootholdId;
  if (replayFootholdId) return replayFootholdId;
  if (attackIntelligence.bestRoute?.sourceId) {
    return attackIntelligence.bestRoute.sourceId;
  }

  const compromisedUser = visibleNodes.find(
    (node) => node.data?.entityType === "user" && node.data?.compromised,
  );

  return compromisedUser?.id || null;
}
