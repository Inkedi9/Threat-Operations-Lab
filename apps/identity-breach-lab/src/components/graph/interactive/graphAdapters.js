function buildLanePositions(count, top = 80, minSpacing = 130) {
  if (count <= 0) {
    return { positions: [], laneHeight: 820 };
  }

  if (count === 1) {
    return {
      positions: [160],
      laneHeight: 820,
    };
  }

  const laneHeight = Math.max(820, top * 2 + (count - 1) * minSpacing + 140);

  const positions = Array.from({ length: count }, (_, index) => {
    return top + index * minSpacing;
  });

  return { positions, laneHeight };
}

function edgeStyleByRelation(relation) {
  switch (relation) {
    case "compromised-session":
    case "attack-pivot":
    case "attack-path":
    case "domain-admin-path":
      return {
        stroke: "rgba(239,68,68,0.62)",
        strokeWidth: 2.6,
      };

    case "admin-access":
      return {
        stroke: "rgba(239,68,68,0.48)",
        strokeWidth: 2.2,
      };

    case "trusted-link":
      return {
        stroke: "rgba(245,158,11,0.38)",
        strokeWidth: 2,
      };

    case "member-of":
      return {
        stroke: "rgba(255,255,255,0.18)",
        strokeWidth: 1.4,
      };

    case "logged-on":
      return {
        stroke: "rgba(248,113,113,0.26)",
        strokeWidth: 1.6,
      };

    default:
      return {
        stroke: "rgba(239,68,68,0.28)",
        strokeWidth: 1.6,
      };
  }
}

export function buildInteractiveGraph(
  users = [],
  groups = [],
  systems = [],
  links = [],
) {
  const { positions: userY, laneHeight: userLaneHeight } = buildLanePositions(
    users.length,
    90,
    136,
  );
  const { positions: groupY, laneHeight: groupLaneHeight } = buildLanePositions(
    groups.length,
    110,
    118,
  );
  const { positions: systemY, laneHeight: systemLaneHeight } =
    buildLanePositions(systems.length, 90, 136);

  const graphHeight = Math.max(
    userLaneHeight,
    groupLaneHeight,
    systemLaneHeight,
  );

  const userNodes = users.map((user, index) => ({
    id: user.id,
    type: "userNode",
    position: {
      x: 40,
      y: userY[index],
    },
    data: {
      id: user.id,
      label: user.username,
      title: user.name,
      subtitle: user.role,
      entityType: "user",
      compromised: ["compromised", "privileged-compromised"].includes(
        user.status,
      ),
      privileged: ["elevated", "privileged"].includes(user.privilege),
      raw: user,
    },
  }));

  const groupNodes = groups.map((group, index) => ({
    id: group.id,
    type: "groupNode",
    position: {
      x: 400,
      y: groupY[index],
    },
    data: {
      id: group.id,
      label: group.name,
      title: group.name,
      subtitle: group.tier,
      entityType: "group",
      compromised: false,
      privileged: group.tier === "privileged",
      raw: group,
    },
  }));

  const systemNodes = systems.map((system, index) => ({
    id: system.id,
    type: "systemNode",
    position: {
      x: 820,
      y: systemY[index],
    },
    data: {
      id: system.id,
      label: system.name,
      title: system.name,
      subtitle: system.type,
      entityType: "system",
      compromised: system.status === "impacted",
      privileged: system.criticality === "critical",
      raw: system,
    },
  }));

  const nodes = [...userNodes, ...groupNodes, ...systemNodes];
  const validNodeIds = new Set(nodes.map((node) => node.id));

  const inferredAttackLinks = [];
  const addInferredLink = (from, to, relation) => {
    if (!from || !to) return;

    const exists = inferredAttackLinks.some(
      (link) => link.from === from && link.to === to && link.relation === relation,
    );

    if (!exists) {
      inferredAttackLinks.push({ from, to, relation });
    }
  };

  const compromisedUsers = users.filter((user) =>
    ["compromised", "privileged-compromised"].includes(user.status),
  );

  compromisedUsers.forEach((user) => {
    if (user.machineId) {
      addInferredLink(user.id, user.machineId, "compromised-session");
    }

    if (user.machineId === "ws-04") {
      addInferredLink("ws-04", "srv-file-02", "attack-pivot");
      addInferredLink("srv-file-02", "srv-db-01", "attack-path");
    }

    if (user.machineId === "ws-02" || user.groups?.includes("grp-local-admins")) {
      addInferredLink(user.machineId, "adm-01", "attack-pivot");
      addInferredLink("adm-01", "dc-01", "domain-admin-path");
    }

    if (user.machineId === "adm-01" || user.status === "privileged-compromised") {
      addInferredLink("adm-01", "dc-01", "domain-admin-path");
      addInferredLink("adm-01", "srv-file-02", "attack-pivot");
      addInferredLink("srv-file-02", "srv-db-01", "attack-path");
    }
  });

  systems
    .filter((system) => system.status === "impacted")
    .forEach((system) => {
      if (system.id === "ws-04") {
        addInferredLink("ws-04", "srv-file-02", "attack-pivot");
      }

      if (system.id === "srv-file-02") {
        addInferredLink("srv-file-02", "srv-db-01", "attack-path");
      }

      if (system.id === "adm-01") {
        addInferredLink("adm-01", "dc-01", "domain-admin-path");
      }
    });

  const allLinks = [...links, ...inferredAttackLinks];

  const edges = allLinks
    .filter((link) => validNodeIds.has(link.from) && validNodeIds.has(link.to))
    .map((link, index) => ({
      id: `edge-${index}-${link.from}-${link.to}`,
      source: link.from,
      target: link.to,
      animated:
        link.relation === "admin-access" ||
        link.relation === "trusted-link" ||
        link.relation?.startsWith("attack") ||
        link.relation === "compromised-session" ||
        link.relation === "domain-admin-path",
      label: link.relation,
      data: {
        relation: link.relation,
      },
      style: edgeStyleByRelation(link.relation),
      labelStyle: {
        fill: "#a1a1aa",
        fontSize: 10,
      },
    }));

  return { nodes, edges, graphHeight };
}
