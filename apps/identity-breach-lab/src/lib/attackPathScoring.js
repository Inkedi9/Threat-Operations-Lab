function scoreGraphNode(node) {
  if (!node) return 0;

  const entityType = node.data?.entityType;
  const raw = node.data?.raw;

  if (entityType === "user") {
    if (raw?.status === "privileged-compromised") return 45;
    if (raw?.status === "compromised") return 30;
    if (raw?.privilege === "privileged") return 22;
    if (raw?.privilege === "elevated") return 14;
    return 5;
  }

  if (entityType === "group") {
    if (raw?.tier === "privileged") return 24;
    if (raw?.tier === "elevated") return 14;
    return 6;
  }

  if (entityType === "system") {
    if (raw?.criticality === "critical") return 45;
    if (raw?.criticality === "high") return 24;
    return 10;
  }

  return 0;
}

function scorePathLength(path) {
  return path.length * -4;
}

function scoreObjective(node) {
  if (node?.data?.entityType !== "system") return 0;

  const label = node.data?.label;
  const criticality = node.data?.raw?.criticality;

  if (label === "DC-01" || label === "DB-SRV-01") return 55;
  if (criticality === "critical") return 40;

  return 0;
}

export function computeAttackPathScore(path, nodesMap) {
  if (!path?.length) return 0;

  let score = 0;

  for (const nodeId of path) {
    score += scoreGraphNode(nodesMap[nodeId]);
  }

  const finalNode = nodesMap[path[path.length - 1]];
  score += scoreObjective(finalNode);
  score += scorePathLength(path);

  return Math.max(Math.round(score), 0);
}
