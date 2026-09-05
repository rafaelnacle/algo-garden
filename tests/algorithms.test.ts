import assert from 'node:assert/strict';
import test from 'node:test';
import { createTrace, parseValues } from '../lib/algorithms/engine.ts';
import { lessons } from '../lib/algorithms/lessons.ts';
import { graphEdges, graphNodes, type AlgorithmId } from '../lib/algorithms/types.ts';

const sorting: AlgorithmId[] = ['bubble', 'selection', 'insertion', 'merge', 'quick'];
const cases = [[], [1], [2, 1], [1, 2, 3], [5, 4, 3, 2, 1], [3, 3, 3], [0, -8, 2, -8, 99, -99], [42, 18, 67, 31, 85, 54, 23, 73]];
for (const id of sorting) test(`${id}: sorted output, permutation preserved, immutable input and frames`, () => {
  for (const input of cases) {
    const original = [...input];
    const frames = createTrace(id, input);
    assert.deepEqual(frames.at(-1)!.values, [...input].sort((a, b) => a - b));
    assert.deepEqual(input, original);
    assert.deepEqual(frames[0].values, original);
    assert.equal(frames.at(-1)!.settled.length, input.length);
    for (const frame of frames) {
      assert.ok(frame.active.every(i => i >= 0 && i < input.length));
      assert.ok(frame.settled.every(i => i >= 0 && i < input.length));
    }
  }
});

test('sorting: 100 deterministic duplicate-heavy arrays for each algorithm', () => {
  let seed = 17;
  for (let run = 0; run < 100; run++) {
    const input = Array.from({ length: run % 13 }, () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed % 19 - 9; });
    for (const id of sorting) assert.deepEqual(createTrace(id, input).at(-1)!.values, [...input].sort((a, b) => a - b));
  }
});

test('bubble sort stops early on sorted input', () => {
  const end = createTrace('bubble', [1, 2, 3, 4]).at(-1)!;
  assert.equal(end.comparisons, 3); assert.equal(end.writes, 0);
});

for (const id of ['linear', 'binary'] as const) test(`${id}: first, middle, last, missing, duplicates and empty`, () => {
  for (const input of cases) {
    const sorted = [...input].sort((a, b) => a - b);
    for (const target of [-100, -99, 0, 1, 3, 73, 99, 100]) {
      const result = createTrace(id, sorted, target).at(-1)!;
      if (sorted.includes(target)) {
        assert.equal(sorted[result.settled[0]], target);
        if (id === 'linear') assert.equal(result.settled[0], sorted.indexOf(target));
      } else { assert.deepEqual(result.settled, []); assert.match(result.message, /not in/); }
    }
  }
});

// Independent all-pairs shortest-path oracle, using Floyd–Warshall.
function distances(weighted: boolean) {
  const d = Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (_, j) => i === j ? 0 : Infinity));
  for (const [a, b, w] of graphEdges) d[a][b] = d[b][a] = weighted ? w : 1;
  for (let k = 0; k < 6; k++) for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
  return d;
}
for (const id of ['bfs', 'dfs', 'dijkstra', 'astar'] as const) test(`${id}: valid paths for every start/goal pair`, () => {
  const weighted = id === 'dijkstra' || id === 'astar';
  const shortest = distances(weighted);
  for (let start = 0; start < 6; start++) for (let goal = 0; goal < 6; goal++) {
    const frame = createTrace(id, [], 0, start, goal).at(-1)!;
    const path = frame.path!;
    assert.equal(path[0], start); assert.equal(path.at(-1), goal);
    assert.equal(new Set(path).size, path.length);
    let cost = 0;
    for (let i = 1; i < path.length; i++) {
      const edge = graphEdges.find(([a, b]) => (a === path[i - 1] && b === path[i]) || (b === path[i - 1] && a === path[i]));
      assert.ok(edge); cost += weighted ? edge[2] : 1;
    }
    if (id !== 'dfs') assert.equal(cost, shortest[start][goal]);
  }
});

test('A* heuristic is consistent for every edge and goal', () => {
  for (const goal of graphNodes) {
    const h = (i: number) => Math.hypot(graphNodes[i].x - goal.x, graphNodes[i].y - goal.y) / 100;
    for (const [a, b, w] of graphEdges) { assert.ok(h(a) <= w + h(b)); assert.ok(h(b) <= w + h(a)); }
  }
});

test('stack, queue and linked list remove the correct end including empty inputs', () => {
  for (const input of cases) {
    assert.deepEqual(createTrace('stack', input).at(-1)!.values, input.slice(0, -1));
    for (const id of ['queue', 'linked'] as const) assert.deepEqual(createTrace(id, input).at(-1)!.values, input.slice(1));
  }
});

test('BST preserves ordering and traverses duplicate values correctly', () => {
  for (const input of cases) {
    const frames = createTrace('tree', input), final = frames.at(-1)!;
    assert.deepEqual(final.values, input);
    const visits = frames.filter(f => f.message.startsWith('In-order traversal')).map(f => f.values[f.active[0]]);
    assert.deepEqual(visits, [...input].sort((a, b) => a - b));
    assert.equal(final.edges!.length, Math.max(0, input.length - 1));
  }
});

test('hash collisions and negative keys use normalized buckets', () => {
  const final = createTrace('hash', [-99, -4, 1, 6, 11]).at(-1)!;
  assert.equal(final.values.length, 5);
  assert.ok(final.labels!.every(label => label === 'bucket 1'));
});

test('custom input rejects malformed, fractional, oversized and out-of-range data', () => {
  assert.deepEqual(parseValues(' 3, -2, 0, 3 '), [3, -2, 0, 3]);
  assert.deepEqual(parseValues('3 2 1'), [3, 2, 1]);
  for (const input of ['', ' ', 'NaN', '1.5', '100', '-100', '1,,', '1e2', '1,2,3,4,5,6,7,8,9,10,11,12,13']) assert.throws(() => parseValues(input));
});

test('every lesson has a valid challenge and trace line within its C++ source', () => {
  assert.equal(lessons.length, 16);
  assert.equal(new Set(lessons.map(l => l.id)).size, 16);
  for (const lesson of lessons) {
    assert.ok(lesson.answers[lesson.correct]);
    for (const frame of createTrace(lesson.id, [2, 1, 3])) assert.ok(frame.line >= 1 && frame.line <= lesson.code.split('\n').length, `${lesson.id} line ${frame.line}`);
  }
});
