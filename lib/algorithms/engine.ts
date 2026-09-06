import {
  graphEdges,
  graphNodes,
  type AlgorithmId,
  type TraceStep,
} from './types.ts';

export const DEFAULT_VALUES = [42, 18, 67, 31, 85, 54, 23, 73];

/** Every frame is a detached snapshot, so rewinding cannot mutate the algorithm. */
export function createTrace(
  id: AlgorithmId,
  input: number[],
  target = 31,
  source = 0,
  goal = 5,
): TraceStep[] {
  const a = [...input];
  const frames: TraceStep[] = [];
  let comparisons = 0;
  let writes = 0;
  const emit = (
    message: string,
    line: number,
    active: number[] = [],
    settled: number[] = [],
    extra: Partial<TraceStep> = {},
  ) => {
    frames.push({
      values: [...a],
      active: [...active],
      settled: [...settled],
      message,
      line,
      comparisons,
      writes,
      ...extra,
    });
  };
  const all = () => a.map((_, i) => i);
  if (['bfs', 'dfs', 'dijkstra', 'astar'].includes(id))
    return graphTrace(id, source, goal);
  if (['stack', 'queue', 'linked', 'tree', 'hash'].includes(id))
    return structureTrace(id, a);
  emit(
    id === 'binary'
      ? 'Start with a sorted array. Binary search needs this precondition.'
      : 'Ready to explore. Advance one step to see the first operation.',
    1,
  );
  const swap = (i: number, j: number) => {
    [a[i], a[j]] = [a[j], a[i]];
    writes += 2;
  };
  if (id === 'bubble') {
    for (let end = a.length - 1; end > 0; end--) {
      let swapped = false;
      for (let j = 0; j < end; j++) {
        comparisons++;
        emit(
          `Compare ${a[j]} and ${a[j + 1]}. ${a[j] > a[j + 1] ? 'The left value is larger, so swap them.' : 'They are in order; keep them here.'}`,
          8,
          [j, j + 1],
          all().filter((i) => i > end),
        );
        if (a[j] > a[j + 1]) {
          swap(j, j + 1);
          swapped = true;
          emit(
            'Swap the adjacent values. The larger value moves right.',
            9,
            [j, j + 1],
            all().filter((i) => i > end),
          );
        }
      }
      emit(
        `${a[end]} is now in its final position. The next pass can stop earlier.`,
        5,
        [],
        all().filter((i) => i >= end),
      );
      if (!swapped) {
        emit(
          'No swaps in this pass: every remaining pair is ordered. Stop early.',
          13,
          [],
          all(),
        );
        break;
      }
    }
  } else if (id === 'selection') {
    for (let i = 0; i < a.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) {
        comparisons++;
        emit(
          `Compare candidate ${a[j]} with the current minimum ${a[min]}.`,
          7,
          [min, j],
          all().filter((k) => k < i),
        );
        if (a[j] < a[min]) {
          min = j;
          emit(
            `${a[min]} becomes the new minimum.`,
            7,
            [min],
            all().filter((k) => k < i),
          );
        }
      }
      if (min !== i) swap(i, min);
      emit(
        `Place the smallest remaining value, ${a[i]}, at index ${i}.`,
        8,
        [i],
        all().filter((k) => k <= i),
      );
    }
  } else if (id === 'insertion') {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      emit(`Hold ${key} as the key. Find its place in the sorted prefix.`, 4, [
        i,
      ]);
      while (j >= 0) {
        comparisons++;
        emit(`Compare ${a[j]} with the held key ${key}.`, 6, [j]);
        if (a[j] <= key) break;
        a[j + 1] = a[j];
        writes++;
        emit(
          `Shift ${a[j]} right. The key ${key} is still held separately.`,
          7,
          [j, j + 1],
        );
        j--;
      }
      a[j + 1] = key;
      writes++;
      emit(
        `Insert ${key} at index ${j + 1}. The prefix through ${i} is ordered, but may still move.`,
        10,
        [j + 1],
      );
    }
  } else if (id === 'merge') {
    const merge = (lo: number, hi: number) => {
      if (hi - lo <= 1) return;
      const mid = Math.floor((lo + hi) / 2);
      emit(
        `Split [${lo}, ${hi}) into [${lo}, ${mid}) and [${mid}, ${hi}). The right boundary is excluded.`,
        5,
        all().filter((i) => i >= lo && i < hi),
      );
      merge(lo, mid);
      merge(mid, hi);
      const left = a.slice(lo, mid),
        right = a.slice(mid, hi);
      let i = 0,
        j = 0,
        k = lo;
      while (i < left.length || j < right.length) {
        if (i < left.length && j < right.length) comparisons++;
        const takeLeft =
          j === right.length || (i < left.length && left[i] <= right[j]);
        a[k] = takeLeft ? left[i++] : right[j++];
        writes++;
        emit(
          `Write ${a[k]} from the ${takeLeft ? 'left' : 'right'} buffer into index ${k}. Buffers preserve unread values.`,
          takeLeft ? 14 : 15,
          [k],
        );
        k++;
      }
    };
    merge(0, a.length);
  } else if (id === 'quick') {
    const fixed: number[] = [];
    const quick = (lo: number, hi: number) => {
      if (lo > hi) return;
      if (lo === hi) {
        fixed.push(lo);
        return;
      }
      const pivot = a[hi];
      let i = lo;
      emit(
        `Choose ${pivot} as the pivot. Grow a region of values smaller than it.`,
        4,
        [hi],
        fixed,
      );
      for (let j = lo; j < hi; j++) {
        comparisons++;
        emit(
          `Compare ${a[j]} with pivot ${pivot}. Index ${i} is the next position in the smaller region.`,
          6,
          [j, hi],
          fixed,
        );
        if (a[j] < pivot) {
          if (i !== j) swap(i, j);
          emit(
            `Move ${a[i]} into the smaller region. Advance its boundary.`,
            7,
            [i, j],
            fixed,
          );
          i++;
        }
      }
      if (i !== hi) swap(i, hi);
      fixed.push(i);
      emit(
        `Pivot ${pivot} is fixed at index ${i}. Recurse on each side, excluding the pivot.`,
        10,
        [i],
        fixed,
      );
      quick(lo, i - 1);
      quick(i + 1, hi);
    };
    quick(0, a.length - 1);
  } else if (id === 'linear' || id === 'binary') {
    let found = -1;
    if (id === 'linear') {
      for (let i = 0; i < a.length; i++) {
        comparisons++;
        emit(`Check index ${i}: is ${a[i]} equal to ${target}?`, 4, [i]);
        if (a[i] === target) {
          found = i;
          break;
        }
      }
    } else {
      let lo = 0,
        hi = a.length - 1;
      while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        comparisons++;
        emit(
          `Search [${lo}, ${hi}]. Middle index ${mid} holds ${a[mid]}; compare it with ${target}.`,
          6,
          [mid],
          [],
          { frontier: all().filter((i) => i >= lo && i <= hi) },
        );
        if (a[mid] === target) {
          found = mid;
          break;
        }
        if (a[mid] < target) {
          lo = mid + 1;
          emit(
            `Discard the left half, including index ${mid}. New lower bound: ${lo}.`,
            8,
            [],
            [],
            { frontier: all().filter((i) => i >= lo && i <= hi) },
          );
        } else {
          hi = mid - 1;
          emit(
            `Discard the right half, including index ${mid}. New upper bound: ${hi}.`,
            9,
            [],
            [],
            { frontier: all().filter((i) => i >= lo && i <= hi) },
          );
        }
      }
    }
    emit(
      found >= 0
        ? `Found ${target} at index ${found}.`
        : `${target} is not in this array. Return -1.`,
      found >= 0 ? (id === 'linear' ? 4 : 7) : id === 'linear' ? 5 : 11,
      [],
      found >= 0 ? [found] : [],
    );
    return frames;
  }
  emit('Sorted. Every value is now in nondecreasing order.', 1, [], all());
  return frames;
}

function graphTrace(
  id: AlgorithmId,
  source: number,
  goal: number,
): TraceStep[] {
  const frames: TraceStep[] = [];
  const visited: number[] = [],
    frontier = [source],
    distances = Array(6).fill(Infinity) as number[],
    parent = Array(6).fill(-1) as number[];
  distances[source] = 0;
  const weighted = id === 'dijkstra' || id === 'astar';
  const heuristic = (v: number) =>
    id === 'astar'
      ? Math.hypot(
          graphNodes[v].x - graphNodes[goal].x,
          graphNodes[v].y - graphNodes[goal].y,
        ) / 200
      : 0;
  let comparisons = 0,
    writes = 0;
  const emit = (
    message: string,
    active: number[] = [],
    path: number[] = [],
    line = 1,
  ) =>
    frames.push({
      values: [],
      active: [...active],
      settled: [...visited],
      message,
      line,
      comparisons,
      writes,
      frontier: [...frontier],
      distances: [...distances],
      path: [...path],
    });
  emit(
    `Start at ${graphNodes[source].name}. ${weighted ? 'Track the cheapest known distance to every node.' : 'Edge weights are ignored for this traversal.'}`,
  );
  while (frontier.length) {
    if (weighted)
      frontier.sort(
        (a, b) =>
          distances[a] + heuristic(a) - distances[b] - heuristic(b) || a - b,
      );
    const u = id === 'dfs' ? frontier.pop()! : frontier.shift()!;
    if (visited.includes(u)) continue;
    visited.push(u);
    emit(
      `Visit ${graphNodes[u].name}. ${weighted ? `Distance from start: ${distances[u]}.` : `${id === 'bfs' ? 'Remove from the front of the queue.' : 'Pop from the top of the stack.'}`}`,
      [u],
      [],
      weighted ? (id === 'astar' ? 15 : 13) : 9,
    );
    if (u === goal) {
      const path: number[] = [];
      for (let v = goal; v !== -1; v = parent[v]) path.unshift(v);
      emit(
        `${weighted ? 'Shortest weighted path' : id === 'bfs' ? 'Fewest-edge path' : 'DFS discovery path (not necessarily shortest)'}: ${path.map((v) => graphNodes[v].name).join(' → ')}. ${weighted ? `Total cost: ${distances[goal]}.` : `${path.length - 1} edges.`}`,
        [],
        path,
        weighted ? (id === 'astar' ? 17 : 15) : 10,
      );
      return frames;
    }
    const neighbors = graphEdges
      .flatMap(([a, b, w]) => (a === u ? [[b, w]] : b === u ? [[a, w]] : []))
      .sort((a, b) => a[0] - b[0]);
    if (id === 'dfs') neighbors.reverse();
    for (const [v, w] of neighbors) {
      comparisons++;
      const alt = distances[u] + (weighted ? w : 1);
      if (
        !visited.includes(v) &&
        (weighted ? alt < distances[v] : distances[v] === Infinity)
      ) {
        distances[v] = alt;
        parent[v] = u;
        writes++;
        if (!frontier.includes(v)) frontier.push(v);
        emit(
          `${weighted ? 'Relax' : 'Discover'} ${graphNodes[u].name} → ${graphNodes[v].name}. ${weighted ? `Update distance to ${alt}${id === 'astar' ? `; estimated total ${(alt + heuristic(v)).toFixed(1)}` : ''}.` : `Add ${graphNodes[v].name} to the ${id === 'bfs' ? 'queue' : 'stack'}.`}`,
          [u, v],
          [],
          weighted ? (id === 'astar' ? 21 : 19) : 13,
        );
      }
    }
  }
  emit('The frontier is empty. No path reaches the goal.');
  return frames;
}

function structureTrace(id: AlgorithmId, input: number[]): TraceStep[] {
  const frames: TraceStep[] = [];
  const values: number[] = [],
    edges: [number, number][] = [];
  let comparisons = 0;
  const emit = (
    message: string,
    active: number[] = [],
    settled: number[] = [],
    line = 1,
  ) =>
    frames.push({
      values: [...values],
      active,
      settled,
      message,
      line,
      comparisons,
      writes: values.length,
      edges: edges.map((e) => [...e] as [number, number]),
      labels: values.map((v) =>
        id === 'hash' ? `bucket ${((v % 5) + 5) % 5}` : '',
      ),
    });
  emit('Start with an empty structure. Insert the input values one at a time.');
  for (const value of input) {
    const next = values.length;
    if (id === 'tree' && values.length) {
      let current = 0;
      while (true) {
        comparisons++;
        emit(
          `Compare ${value} with ${values[current]}. ${value < values[current] ? 'Go left.' : 'Go right (including duplicates).'}`,
          [current],
          [],
          6,
        );
        const child = edges.find(
          ([p, c]) =>
            p === current && values[c] < values[p] === value < values[current],
        );
        if (child) current = child[1];
        else {
          edges.push([current, next]);
          break;
        }
      }
    }
    if (id === 'linked' && next) edges.push([next - 1, next]);
    values.push(value);
    emit(
      id === 'hash'
        ? `Hash ${value}: normalized remainder modulo 5 = ${((value % 5) + 5) % 5}. Append to this bucket's chain; collisions share a bucket.`
        : id === 'tree'
          ? `Insert ${value} as a new leaf.`
          : `Insert ${value} at the ${id === 'stack' ? 'top' : 'tail'}.`,
      [next],
      [],
      id === 'tree' ? 5 : id === 'hash' ? 8 : id === 'linked' ? 8 : 5,
    );
  }
  if (id === 'stack' || id === 'queue' || id === 'linked') {
    const value = id === 'stack' ? values.pop() : values.shift();
    edges.length = 0;
    if (id === 'linked')
      for (let i = 1; i < values.length; i++) edges.push([i - 1, i]);
    emit(
      value === undefined
        ? 'Nothing to remove: guard against an empty structure.'
        : `Remove ${value} from the ${id === 'stack' ? 'top: last in, first out' : 'front: first in, first out'}.`,
      [],
      [],
      id === 'linked' ? 13 : 8,
    );
  } else if (id === 'tree') {
    const ordered: number[] = [];
    const visit = (node: number) => {
      const children = edges.filter(([p]) => p === node).map(([, c]) => c);
      const left = children.find((c) => values[c] < values[node]);
      const right = children.find((c) => values[c] >= values[node]);
      if (left !== undefined) visit(left);
      ordered.push(node);
      emit(
        `In-order traversal: ${ordered.map((i) => values[i]).join(' → ')}. Left subtree, node, right subtree.`,
        [node],
        [...ordered],
        12,
      );
      if (right !== undefined) visit(right);
    };
    if (values.length) visit(0);
  }
  emit(
    'Demonstration complete. Edit the input values to explore another case.',
    [],
    values.map((_, i) => i),
  );
  return frames;
}

export function parseValues(text: string): number[] {
  const parts = text.trim().split(/[\s,]+/);
  if (
    !text.trim() ||
    parts.length > 12 ||
    parts.some((p) => !/^-?\d+$/.test(p))
  )
    throw new Error('Enter 1–12 whole numbers, separated by commas.');
  const values = parts.map(Number);
  if (values.some((n) => n < -99 || n > 99))
    throw new Error('Keep each value between -99 and 99.');
  return values;
}
