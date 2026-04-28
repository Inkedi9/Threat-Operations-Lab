import { motion } from 'framer-motion';
import { graphEdges, graphNodes } from '../data/mockData';
import { toneMap, cn } from '../lib/utils';
import SectionHeading from './ui/SectionHeading';

const nodeMap = Object.fromEntries(graphNodes.map((node) => [node.id, node]));

export default function CorrelationGraph() {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Correlation Graph · Threat Relationship Map" subtitle="Mocked exploration layer · cluster preview" />
      <div className="grid-fade relative min-h-[26rem] overflow-hidden rounded-[1.7rem] border border-gold/12 bg-[radial-gradient(circle_at_center,rgba(221,183,106,0.06),transparent_24%),radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%),linear-gradient(180deg,rgba(10,10,10,0.88),rgba(7,7,8,0.94))]">
        <svg className="absolute inset-0 h-full w-full">
          {graphEdges.map(([startId, endId]) => {
            const start = nodeMap[startId];
            const end = nodeMap[endId];
            return (
              <line
                key={`${startId}-${endId}`}
                x1={`${start.x}%`}
                y1={`${start.y}%`}
                x2={`${end.x}%`}
                y2={`${end.y}%`}
                stroke="rgba(226,190,118,0.45)"
                strokeWidth="1.6"
                strokeDasharray={startId === 'ip' ? '0' : '5 7'}
              />
            );
          })}
        </svg>

        {graphNodes.map((node, index) => {
          const toneClasses = toneMap[node.tone] ?? toneMap.gold;
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-black/85 px-4 py-2 text-xs text-ivory',
                toneClasses.border,
                toneClasses.glow,
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {node.label}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
