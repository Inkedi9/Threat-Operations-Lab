import React, { useMemo, useState, useRef, memo } from 'react';
import SectionHeading from '../ui/SectionHeading';

const riskStyles = {
  bad: {
    node: 'border-danger/28 bg-danger/10 text-ivory shadow-[0_0_28px_rgba(255,108,95,0.24)]',
    glow: 'shadow-[0_0_36px_rgba(255,108,95,0.28)]',
    dot: 'bg-danger',
    edge: 'rgba(255,108,95,0.9)',
  },
  warn: {
    node: 'border-amber/28 bg-amber/10 text-ivory shadow-[0_0_26px_rgba(255,180,76,0.2)]',
    glow: 'shadow-[0_0_34px_rgba(255,180,76,0.24)]',
    dot: 'bg-amber',
    edge: 'rgba(255,180,76,0.88)',
  },
  info: {
    node: 'border-info/28 bg-info/10 text-ivory shadow-[0_0_24px_rgba(89,213,208,0.2)]',
    glow: 'shadow-[0_0_32px_rgba(89,213,208,0.24)]',
    dot: 'bg-info',
    edge: 'rgba(89,213,208,0.88)',
  },
  good: {
    node: 'border-success/28 bg-success/10 text-ivory shadow-[0_0_24px_rgba(83,216,168,0.2)]',
    glow: 'shadow-[0_0_32px_rgba(83,216,168,0.24)]',
    dot: 'bg-success',
    edge: 'rgba(83,216,168,0.88)',
  },
  gold: {
    node: 'border-gold/28 bg-gold/10 text-ivory shadow-[0_0_24px_rgba(221,183,106,0.2)]',
    glow: 'shadow-[0_0_32px_rgba(221,183,106,0.26)]',
    dot: 'bg-gold',
    edge: 'rgba(221,183,106,0.92)',
  },
};

const typeConfig = {
  ip: { label: 'IP', dot: 'bg-danger' },
  domain: { label: 'Domain', dot: 'bg-gold' },
  url: { label: 'URL', dot: 'bg-amber' },
  hash: { label: 'Hash', dot: 'bg-info' },
  malware: { label: 'Malware', dot: 'bg-danger' },
  actor: { label: 'Actor', dot: 'bg-danger' },
  campaign: { label: 'Campaign', dot: 'bg-gold' },
  email: { label: 'Email', dot: 'bg-amber' },
  asn: { label: 'ASN', dot: 'bg-info' },
  sector: { label: 'Sector', dot: 'bg-success' },
  cluster: { label: 'Cluster', dot: 'bg-gold' },
};

function prettifyType(type) {
  return typeConfig[type]?.label || type || 'Node';
}

function buildNodeSummary(node, connectedCount) {
  const riskLabel =
    node.risk === 'bad'
      ? 'High risk'
      : node.risk === 'warn'
        ? 'Elevated risk'
        : node.risk === 'good'
          ? 'Observed / low risk'
          : 'Correlated signal';

  return [
    `${prettifyType(node.type)} node`,
    riskLabel,
    `${connectedCount} linked relation${connectedCount > 1 ? 's' : ''}`,
  ].join(' · ');
}

export default function RelationshipMap({ result }) {
  const [activeNodeId, setActiveNodeId] = useState(result?.relations?.[0]?.id || null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const hoverTimeout = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleHover = (id) => {
    if (hoverTimeout.current) cancelAnimationFrame(hoverTimeout.current);

    hoverTimeout.current = requestAnimationFrame(() => {
      setHoveredNodeId(id);
    });
  };

  const nodeIndex = useMemo(
    () => Object.fromEntries((result?.relations || []).map((node) => [node.id, node])),
    [result],
  );

  const edgeIndex = useMemo(() => {
    const map = new Map();

    (result?.edges || []).forEach(([from, to]) => {
      if (!map.has(from)) map.set(from, []);
      if (!map.has(to)) map.set(to, []);
      map.get(from).push(to);
      map.get(to).push(from);
    });

    return map;
  }, [result]);

  const focusNodeId = hoveredNodeId || activeNodeId;
  const activeNode = nodeIndex[focusNodeId] || result?.relations?.[0] || null;
  const connectedIds = new Set(edgeIndex.get(focusNodeId) || []);

  const stats = useMemo(() => {
    const totalNodes = result?.relations?.length || 0;
    const totalEdges = result?.edges?.length || 0;
    const highRisk = (result?.relations || []).filter((node) => node.risk === 'bad').length;
    const distinctTypes = [...new Set((result?.relations || []).map((node) => node.type))].length;

    return { totalNodes, totalEdges, highRisk, distinctTypes };
  }, [result]);

  const Node = memo(function Node({
    node,
    isActive,
    isNeighbor,
    focusNodeId,
    style,
    onClick,
    onHover,
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        className={[
          'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2 text-left text-xs font-semibold transition-all duration-300',
          'backdrop-blur-sm',
          style.node,
          isActive ? `scale-[1.06] ${style.glow} z-20` : 'z-10',
          !isActive && isNeighbor ? 'scale-[1.02] opacity-100' : '',
          focusNodeId && !isActive && !isNeighbor ? 'opacity-30' : 'opacity-100',
        ].join(' ')}
        style={{ left: `${node.x}%`, top: `${node.y}%` }}
      >
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
          <span>{node.label}</span>
        </div>
      </button>
    );
  });

  const legendTypes = useMemo(() => {
    return [...new Set((result?.relations || []).map((node) => node.type))];
  }, [result]);

  if (!result || !result.relations?.length) return null;

  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading
        title="Correlation Graph / Threat Relationship Map"
        subtitle="interactive exploration layer"
      />

      <div className="mb-4 grid gap-3 lg:grid-cols-4">
        <article className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Nodes</div>
          <div className="mt-2 text-2xl font-black text-ivory">{stats.totalNodes}</div>
        </article>
        <article className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Edges</div>
          <div className="mt-2 text-2xl font-black text-ivory">{stats.totalEdges}</div>
        </article>
        <article className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">High risk</div>
          <div className="mt-2 text-2xl font-black text-danger">{stats.highRisk}</div>
        </article>
        <article className="rounded-[1.2rem] border border-white/6 bg-white/[0.03] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Types mapped</div>
          <div className="mt-2 text-2xl font-black text-gold-soft">{stats.distinctTypes}</div>
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div
          className="relative min-h-[480px] cursor-grab active:cursor-grabbing overflow-hidden rounded-[1.7rem] border border-gold/10 bg-black/60 select-none cursor-grab"
          onMouseDown={(e) => {
            isDragging.current = true;
            lastPos.current = { x: e.clientX, y: e.clientY };
          }}
          onMouseMove={(e) => {
            if (!isDragging.current) return;

            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;

            setOffset((prev) => ({
              x: prev.x + dx,
              y: prev.y + dy,
            }));

            lastPos.current = { x: e.clientX, y: e.clientY };
          }}
          onMouseUp={() => {
            isDragging.current = false;
          }}
          onMouseLeave={() => {
            isDragging.current = false;
          }}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation(); // 👈 IMPORTANT

            const delta = e.deltaY * -0.001;

            setZoom((z) => Math.min(Math.max(0.6, z + delta), 1.8));
          }}
          onDoubleClick={() => {
            setOffset({ x: 0, y: 0 });
            setZoom(1);
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: 'center',
              touchAction: 'none',
            }}
          >
            <div className="grid-fade absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(221,183,106,0.08),transparent_28%)]" />

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1000 480"
              preserveAspectRatio="none"
            >
              {(result.edges || []).map(([from, to]) => {
                const a = nodeIndex[from];
                const b = nodeIndex[to];
                if (!a || !b) return null;

                const isFocused =
                  focusNodeId &&
                  (from === focusNodeId ||
                    to === focusNodeId ||
                    (connectedIds.has(from) && connectedIds.has(to)));

                const activeColor = activeNode
                  ? riskStyles[activeNode.risk || 'info']?.edge
                  : 'rgba(221,183,106,0.9)';

                return (
                  <line
                    key={`${from}-${to}`}
                    x1={`${a.x}%`}
                    y1={`${a.y}%`}
                    x2={`${b.x}%`}
                    y2={`${b.y}%`}
                    stroke={isFocused ? activeColor : 'rgba(221,183,106,0.22)'}
                    strokeWidth={isFocused ? '2.2' : '1.2'}
                    strokeDasharray={isFocused ? '0' : '4 7'}
                    opacity={focusNodeId ? (isFocused ? 1 : 0.22) : 0.72}
                  />
                );
              })}
            </svg>

            {result.relations.map((node) => {
              const isActive = node.id === focusNodeId;
              const isNeighbor = connectedIds.has(node.id);
              const style = riskStyles[node.risk] || riskStyles.info;

              return (
                <Node
                  key={node.id}
                  node={node}
                  isActive={isActive}
                  isNeighbor={isNeighbor}
                  focusNodeId={focusNodeId}
                  style={style}
                  onClick={() => setActiveNodeId(node.id)}
                  onHover={handleHover}
                />
              );
            })}
          </div>

          <div className="absolute left-4 top-4 rounded-2xl border border-white/6 bg-black/40 px-4 py-3 backdrop-blur-sm">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Focus mode</div>
            <div className="mt-2 text-sm font-semibold text-ivory">
              {activeNode ? activeNode.label : 'No node selected'}
            </div>
            <div className="mt-1 text-xs text-muted">
              Hover to preview · click to lock selection
            </div>
          </div>

          <div className="absolute top-4 right-4 rounded-xl border border-white/6 bg-black/40 px-3 py-2 text-xs text-muted">
            Zoom: {(zoom * 100).toFixed(0)}%
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {legendTypes.map((type) => (
              <div
                key={type}
                className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-black/40 px-3 py-2 text-xs text-muted backdrop-blur-sm"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${typeConfig[type]?.dot || 'bg-gold'}`} />
                {prettifyType(type)}
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[1.7rem] border border-gold/10 bg-white/[0.03] p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-gold">Node intelligence</div>

          {activeNode ? (
            <>
              <h4 className="mt-3 text-2xl font-black tracking-[-0.03em] text-ivory">
                {activeNode.label}
              </h4>

              <div className="mt-4 grid gap-3">
                <article className="rounded-[1rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Type</div>
                  <div className="mt-2 text-sm font-semibold text-ivory">
                    {prettifyType(activeNode.type)}
                  </div>
                </article>

                <article className="rounded-[1rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Risk posture</div>
                  <div className="mt-2 text-sm font-semibold text-ivory capitalize">
                    {activeNode.risk || 'info'}
                  </div>
                </article>

                <article className="rounded-[1rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Summary</div>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {buildNodeSummary(activeNode, connectedIds.size)}
                  </p>
                </article>

                <article className="rounded-[1rem] border border-white/6 bg-black/30 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Connected nodes</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...connectedIds].length ? (
                      [...connectedIds].map((id) => {
                        const node = nodeIndex[id];
                        if (!node) return null;

                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setActiveNodeId(id)}
                            className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-xs text-ivory transition hover:border-gold/20 hover:text-gold-soft"
                          >
                            {node.label}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-sm text-muted">No linked nodes.</span>
                    )}
                  </div>
                </article>
              </div>

              <div className="mt-4 rounded-[1rem] border border-white/6 bg-black/30 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Analyst hint</div>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Use this focus state to visually understand the closest relationships first,
                  then pivot into linked nodes to reconstruct campaign, actor or artifact proximity.
                </p>
              </div>
            </>
          ) : (
            <div className="mt-4 text-sm text-muted">Select a node to inspect relationships.</div>
          )}
        </aside>
      </div>
    </section>
  );
}
