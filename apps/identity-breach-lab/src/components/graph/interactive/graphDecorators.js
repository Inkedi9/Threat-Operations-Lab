export function decorateEdges(
  edges = [],
  selectedNode,
  selectedEdge,
  showLabels,
  animatedLinks,
) {
  return edges.map((edge) => {
    const isSelectedEdge = selectedEdge && edge.id === selectedEdge.id;

    if (isSelectedEdge) {
      return {
        ...edge,
        animated: animatedLinks,
        label: showLabels ? edge.label : "",
        style: {
          ...(edge.style || {}),
          stroke: "rgba(245,158,11,0.82)",
          strokeWidth: 3.2,
        },
        labelStyle: {
          ...(edge.labelStyle || {}),
          fill: "#fde68a",
          fontSize: 10,
        },
      };
    }

    const isConnected =
      selectedNode &&
      (edge.source === selectedNode.id || edge.target === selectedNode.id);

    if (!isConnected) {
      return {
        ...edge,
        animated: animatedLinks ? edge.animated : false,
        label: showLabels ? edge.label : "",
      };
    }

    return {
      ...edge,
      animated: animatedLinks,
      label: showLabels ? edge.label : "",
      style: {
        ...(edge.style || {}),
        stroke: "rgba(239,68,68,0.72)",
        strokeWidth: 2.8,
      },
      labelStyle: {
        ...(edge.labelStyle || {}),
        fill: "#fecaca",
        fontSize: 10,
      },
    };
  });
}

export function buildAttackFocusGraph(nodes = [], edges = []) {
  const importantNodeIds = new Set();

  nodes.forEach((node) => {
    if (node.data?.compromised || node.data?.privileged) {
      importantNodeIds.add(node.id);
    }
  });

  edges.forEach((edge) => {
    const sourceImportant = importantNodeIds.has(edge.source);
    const targetImportant = importantNodeIds.has(edge.target);

    if (sourceImportant || targetImportant) {
      importantNodeIds.add(edge.source);
      importantNodeIds.add(edge.target);
    }
  });

  const focusedNodes = nodes.filter((node) => importantNodeIds.has(node.id));
  const focusedEdges = edges.filter(
    (edge) => importantNodeIds.has(edge.source) && importantNodeIds.has(edge.target),
  );

  return { focusedNodes, focusedEdges };
}

export function buildCrownJewelGraph(nodes = [], edges = []) {
  const crownIds = new Set(
    nodes
      .filter((node) => {
        const label = node.data?.label;
        return label === "DC-01" || label === "DB-SRV-01";
      })
      .map((node) => node.id),
  );

  const importantNodeIds = new Set(crownIds);

  edges.forEach((edge) => {
    if (crownIds.has(edge.source) || crownIds.has(edge.target)) {
      importantNodeIds.add(edge.source);
      importantNodeIds.add(edge.target);
    }
  });

  edges.forEach((edge) => {
    const sourceImportant = importantNodeIds.has(edge.source);
    const targetImportant = importantNodeIds.has(edge.target);

    if (sourceImportant || targetImportant) {
      importantNodeIds.add(edge.source);
      importantNodeIds.add(edge.target);
    }
  });

  const focusedNodes = nodes.filter((node) => importantNodeIds.has(node.id));
  const focusedEdges = edges.filter(
    (edge) => importantNodeIds.has(edge.source) && importantNodeIds.has(edge.target),
  );

  return { focusedNodes, focusedEdges, crownIds };
}

export function decorateCrownEdges(edges = [], crownIds = new Set()) {
  return edges.map((edge) => {
    const touchesCrown = crownIds.has(edge.source) || crownIds.has(edge.target);

    if (!touchesCrown) {
      return edge;
    }

    return {
      ...edge,
      animated: true,
      style: {
        ...(edge.style || {}),
        stroke: "rgba(245,158,11,0.70)",
        strokeWidth: 3,
      },
      labelStyle: {
        ...(edge.labelStyle || {}),
        fill: "#fde68a",
        fontSize: 10,
      },
    };
  });
}

export function decorateNodesWithPath(nodes = [], highlightedPath = []) {
  const highlightedIds = new Set(highlightedPath);

  return nodes.map((node) => {
    const isInPath = highlightedIds.has(node.id);

    if (!isInPath) {
      return node;
    }

    return {
      ...node,
      data: {
        ...node.data,
        pathHighlighted: true,
      },
    };
  });
}

export function decoratePathEdges(edges = [], highlightedPath = []) {
  if (!highlightedPath.length) return edges;

  const pathPairs = new Set();

  for (let index = 0; index < highlightedPath.length - 1; index += 1) {
    const current = highlightedPath[index];
    const next = highlightedPath[index + 1];

    pathPairs.add(`${current}->${next}`);
    pathPairs.add(`${next}->${current}`);
  }

  return edges.map((edge) => {
    const isInPath = pathPairs.has(`${edge.source}->${edge.target}`);

    if (!isInPath) {
      return edge;
    }

    return {
      ...edge,
      animated: true,
      style: {
        ...(edge.style || {}),
        stroke: "rgba(239,68,68,0.92)",
        strokeWidth: 3.6,
      },
      labelStyle: {
        ...(edge.labelStyle || {}),
        fill: "#ffffff",
        fontSize: 10,
      },
    };
  });
}

export function filterNodesToPath(nodes = [], highlightedPath = []) {
  if (!highlightedPath.length) return nodes;

  const highlightedIds = new Set(highlightedPath);
  return nodes.filter((node) => highlightedIds.has(node.id));
}

export function filterEdgesToPath(edges = [], highlightedPath = []) {
  if (!highlightedPath.length) return edges;

  const pathPairs = new Set();

  for (let index = 0; index < highlightedPath.length - 1; index += 1) {
    const current = highlightedPath[index];
    const next = highlightedPath[index + 1];

    pathPairs.add(`${current}->${next}`);
    pathPairs.add(`${next}->${current}`);
  }

  return edges.filter((edge) => pathPairs.has(`${edge.source}->${edge.target}`));
}

export function decorateNodesWithReplayStep(nodes = [], replayStep) {
  if (!replayStep) return nodes;

  const sourceNeedle = replayStep.sourceIdentity;
  const targetNeedle = replayStep.targetSystem;

  return nodes.map((node) => {
    const matchesReplay =
      node.data?.label === sourceNeedle ||
      node.data?.label === targetNeedle ||
      node.data?.title === sourceNeedle ||
      node.data?.title === targetNeedle ||
      node.data?.raw?.username === sourceNeedle ||
      node.data?.raw?.name === sourceNeedle ||
      node.data?.raw?.name === targetNeedle;

    if (!matchesReplay) return node;

    return {
      ...node,
      data: {
        ...node.data,
        replayHighlighted: true,
      },
    };
  });
}
