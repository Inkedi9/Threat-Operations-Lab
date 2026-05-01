export function getNodeById(nodes = [], id) {
  return nodes.find((node) => node.id === id) || null;
}

export function buildAdjacency(edges = []) {
  const adjacency = new Map();

  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);

    adjacency.get(edge.source).push(edge.target);
    adjacency.get(edge.target).push(edge.source);
  });

  return adjacency;
}

export function shortestPathToTargets(startId, targetIds = new Set(), edges = []) {
  if (!startId || targetIds.size === 0) return null;

  const adjacency = buildAdjacency(edges);
  const queue = [[startId]];
  const visited = new Set([startId]);

  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (targetIds.has(current) && current !== startId) {
      return path;
    }

    const neighbors = adjacency.get(current) || [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return null;
}

export function focusNodeInViewport(flowInstance, node) {
  if (!flowInstance || !node?.position) return;

  const centerX = node.position.x + 110;
  const centerY = node.position.y + 45;

  flowInstance.setCenter(centerX, centerY, {
    zoom: 0.95,
    duration: 500,
  });
}

export function findReplayStepNode(nodes = [], replayStep, type = "source") {
  if (!replayStep) return null;

  const needle =
    type === "source" ? replayStep.sourceIdentity : replayStep.targetSystem;

  if (!needle) return null;

  return (
    nodes.find((node) => node.data?.label === needle) ||
    nodes.find((node) => node.data?.title === needle) ||
    nodes.find((node) => node.data?.raw?.username === needle) ||
    nodes.find((node) => node.data?.raw?.name === needle) ||
    nodes.find((node) => node.data?.raw?.machineId === needle) ||
    null
  );
}

export function resolveReplayFootholdId(nodes = [], replayStep = null) {
  if (!replayStep) return null;

  const sourceNeedle = replayStep.sourceIdentity;

  const sourceNode =
    nodes.find((node) => node.data?.label === sourceNeedle) ||
    nodes.find((node) => node.data?.title === sourceNeedle) ||
    nodes.find((node) => node.data?.raw?.username === sourceNeedle) ||
    nodes.find((node) => node.data?.raw?.name === sourceNeedle);

  return sourceNode?.id || null;
}

export function getCrownTargetIds(nodes = []) {
  return new Set(
    nodes
      .filter((node) => {
        const label = node.data?.label;
        const criticality = node.data?.raw?.criticality;

        return (
          node.data?.entityType === "system" &&
          (label === "DC-01" ||
            label === "DB-SRV-01" ||
            label === "SRV-DB-01" ||
            criticality === "critical")
        );
      })
      .map((node) => node.id),
  );
}
