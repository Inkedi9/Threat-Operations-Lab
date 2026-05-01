export function findAttackPaths(startId, targetIds, edges, maxDepth = 6) {
  if (!startId || !targetIds?.size) return [];

  const adjacency = new Map();

  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);

    adjacency.get(edge.source).push(edge.target);
    adjacency.get(edge.target).push(edge.source);
  });

  const paths = [];
  const queue = [[startId]];

  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (path.length > maxDepth) continue;

    if (targetIds.has(current) && path.length > 1) {
      paths.push(path);
      continue;
    }

    const neighbors = adjacency.get(current) || [];

    neighbors.forEach((neighbor) => {
      if (!path.includes(neighbor)) {
        queue.push([...path, neighbor]);
      }
    });
  }

  return paths;
}
