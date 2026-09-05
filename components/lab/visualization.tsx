/* SVG and composed diagrams need role="img"; an HTML img cannot contain this geometry. */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
'use client';

import { graphNodes, graphEdges, type Lesson, type TraceStep } from '@/lib/algorithms/types';

const color = (step: TraceStep, i: number) => step.active.includes(i) ? 'active' : step.settled.includes(i) || step.path?.includes(i) ? 'settled' : 'idle';

export function Visualization({ lesson, step, source, goal }: { lesson: Lesson; step: TraceStep; source: number; goal: number }) {
  if (lesson.category === 'Graphs') return <GraphDiagram step={step} source={source} goal={goal} weighted={['dijkstra', 'astar'].includes(lesson.id)} />;
  if (lesson.category === 'Data structures') return <StructureDiagram lesson={lesson} step={step} />;
  const max = Math.max(...step.values.map(Math.abs), 1);
  return <div className="bar-chart" role="img" aria-label={`Array: ${step.values.join(', ')}. ${step.message}`}>
    <div className="chart-axis"><span>{max}</span><span>{Math.round(max / 2)}</span><span>0</span></div>
    <div className="bars">{step.values.map((value, i) => <div key={i} className={`bar-column ${color(step, i)} ${step.frontier && !step.frontier.includes(i) && !step.settled.includes(i) ? 'eliminated' : ''}`}>
      <div className={`bar ${value < 0 ? 'negative' : ''}`} style={{ height: `${Math.max(9, Math.abs(value) / max * 83)}%` }}><span>{value}</span>{step.active.includes(i) && <span className="bar-marker">↓</span>}</div>
      <span className="bar-index">{i}</span>
    </div>)}</div>
    <span className="axis-label">INDEX</span>
  </div>;
}

function GraphDiagram({ step, source, goal, weighted }: { step: TraceStep; source: number; goal: number; weighted: boolean }) {
  const onPath = (a: number, b: number) => step.path?.some((node, i, p) => i > 0 && ((p[i - 1] === a && node === b) || (p[i - 1] === b && node === a)));
  return <div className="graph-wrap"><svg viewBox="0 0 585 340" role="img" aria-label={`Graph with six nodes. ${step.message}`}>
    {graphEdges.map(([a, b, weight]) => <g key={`${a}-${b}`} className={onPath(a, b) ? 'path-edge' : 'graph-edge'}>
      <line x1={graphNodes[a].x} y1={graphNodes[a].y} x2={graphNodes[b].x} y2={graphNodes[b].y} />
      <rect x={(graphNodes[a].x + graphNodes[b].x) / 2 - 12} y={(graphNodes[a].y + graphNodes[b].y) / 2 - 12} width="24" height="24" rx="7" />
      <text x={(graphNodes[a].x + graphNodes[b].x) / 2} y={(graphNodes[a].y + graphNodes[b].y) / 2 + 5}>{weight}</text>
    </g>)}
    {graphNodes.map((node, i) => <g key={node.name} className={`graph-node ${color(step, i)} ${step.frontier?.includes(i) ? 'queued' : ''}`}>
      <circle cx={node.x} cy={node.y} r="24" /><text x={node.x} y={node.y + 6}>{node.name}</text>
      <text className="node-caption" x={node.x} y={node.y + 47}>{i === source ? 'START' : i === goal ? 'GOAL' : ''}{weighted ? ` ${step.distances?.[i] === Infinity ? '∞' : step.distances?.[i] ?? '∞'}` : ''}</text>
    </g>)}
  </svg><div className="frontier"><span>{weighted ? 'FRONTIER' : 'PENDING'}</span>{step.frontier?.length ? step.frontier.map(i => <b key={i}>{graphNodes[i].name}</b>) : <span>empty</span>}</div></div>;
}

function StructureDiagram({ lesson, step }: { lesson: Lesson; step: TraceStep }) {
  if (lesson.id === 'tree') {
    const positions = new Map<number, { x: number; y: number }>();
    const layout = (i: number, lo: number, hi: number, depth: number) => {
      const x = (lo + hi) / 2; positions.set(i, { x, y: 38 + depth * 60 });
      for (const [p, c] of step.edges ?? []) if (p === i) layout(c, step.values[c] < step.values[p] ? lo : x, step.values[c] < step.values[p] ? x : hi, depth + 1);
    };
    if (step.values.length) layout(0, 25, 575, 0);
    // In-order x positions keep a degenerate 12-node tree readable without overlap.
    const ordered = [...positions.keys()].sort((a, b) => positions.get(a)!.x - positions.get(b)!.x);
    ordered.forEach((i, rank) => { const position = positions.get(i); if (position) position.x = 35 + rank * 530 / Math.max(1, ordered.length - 1); });
    const height = Math.max(280, ...[...positions.values()].map(p => p.y + 50));
    return <div className="tree-wrap">{!step.values.length && <p className="empty-structure">An empty tree. Ready for its first root.</p>}<svg viewBox={`0 0 610 ${height}`} role="img" aria-label={`Binary search tree. ${step.message}`}>
      {step.edges?.map(([a, b]) => <line className="tree-edge" key={`${a}-${b}`} x1={positions.get(a)?.x} y1={positions.get(a)?.y} x2={positions.get(b)?.x} y2={positions.get(b)?.y} />)}
      {step.values.map((v, i) => <g key={i} className={`graph-node ${color(step, i)}`}><circle cx={positions.get(i)?.x} cy={positions.get(i)?.y} r="21" /><text x={positions.get(i)?.x} y={(positions.get(i)?.y ?? 0) + 6}>{v}</text></g>)}
    </svg></div>;
  }
  if (lesson.id === 'hash') return <div className="hash-table" role="img" aria-label={`Five buckets with separate chaining. ${step.message}`}>{Array.from({ length: 5 }, (_, bucket) => <div key={bucket} className="hash-row"><span className="bucket-label">{bucket}</span><span className="link-arrow">→</span>{step.values.map((v, i) => ((v % 5) + 5) % 5 === bucket && <span key={i} className={`structure-node ${color(step, i)}`}>{v}</span>)}{!step.values.some(v => ((v % 5) + 5) % 5 === bucket) && <span className="null-label">empty</span>}</div>)}</div>;
  return <div className={`structure-wrap ${lesson.id === 'stack' ? 'stack-wrap' : ''}`} role="img" aria-label={`${lesson.name}: ${step.values.join(', ')}. ${step.message}`}>
    {!step.values.length && <p className="empty-structure">Empty. Let’s add the first value.</p>}
    {step.values.map((v, i) => <div className="structure-piece" key={i}><span className={`structure-node ${color(step, i)}`}>{v}</span>{lesson.id === 'linked' && <span className="link-arrow">→</span>}{i === 0 && lesson.id !== 'stack' && <small>HEAD</small>}{i === step.values.length - 1 && <small>{lesson.id === 'stack' ? 'TOP' : i > 0 ? 'TAIL' : ''}</small>}</div>)}
    {lesson.id === 'linked' && step.values.length > 0 && <span className="null-label">nullptr</span>}
  </div>;
}
