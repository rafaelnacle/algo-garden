import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { goCode } from '../lib/algorithms/go-code.ts';

const checks: Record<keyof typeof goCode, string> = {
  bubble: `a := []int{4, -2, 0, 4, 1}; bubbleSort(a); assert(equalInts(a, []int{-2, 0, 1, 4, 4})); bubbleSort(nil)`,
  selection: `a := []int{4, -2, 0, 4, 1}; selectionSort(a); assert(equalInts(a, []int{-2, 0, 1, 4, 4})); selectionSort(nil)`,
  insertion: `a := []int{4, -2, 0, 4, 1}; insertionSort(a); assert(equalInts(a, []int{-2, 0, 1, 4, 4})); insertionSort(nil)`,
  merge: `a := []int{4, -2, 0, 4, 1}; mergeSort(a); assert(equalInts(a, []int{-2, 0, 1, 4, 4})); mergeSort(nil)`,
  quick: `a := []int{4, -2, 0, 4, 1}; quickSort(a); assert(equalInts(a, []int{-2, 0, 1, 4, 4})); quickSort(nil)`,
  linear: `a := []int{1, 2, 3}; assert(linearSearch(a, 1) == 0); assert(linearSearch(nil, 2) == -1); assert(linearSearch(a, 4) == -1)`,
  binary: `a := []int{1, 2, 3}; assert(binarySearch(a, 1) == 0); assert(binarySearch(nil, 2) == -1); assert(binarySearch(a, 4) == -1)`,
  bfs: `graph := [][]int{{1, 2}, {0, 3}, {0, 3}, {1, 2}}; parent := bfs(graph, 0, 3); assert(parent[3] == 1 && parent[1] == 0)`,
  dfs: `graph := [][]int{{1, 2}, {0, 3}, {0, 3}, {1, 2}}; parent := dfs(graph, 0, 3); assert(parent[3] == 1)`,
  dijkstra: `graph := [][]Edge{{{To: 1, Weight: 8}, {To: 2, Weight: 2}}, {{To: 0, Weight: 8}, {To: 2, Weight: 1}}, {{To: 0, Weight: 2}, {To: 1, Weight: 1}}}; distance := dijkstra(graph, 0, 1); assert(distance[1] == 3)`,
  astar: `graph := [][]Edge{{{To: 1, Weight: 8}, {To: 2, Weight: 2}}, {{To: 0, Weight: 8}, {To: 2, Weight: 1}}, {{To: 0, Weight: 2}, {To: 1, Weight: 1}}}; assert(astar(graph, 0, 1, []float64{0, 0, 0}) == 3)`,
  stack: `values := []int{10, 20, 30}; result := stackDemo(values); assert(equalInts(result, []int{10, 20})); assert(equalInts(values, []int{10, 20, 30})); assert(len(stackDemo(nil)) == 0)`,
  queue: `values := []int{10, 20, 30}; result := queueDemo(values); assert(equalInts(result, []int{20, 30})); assert(equalInts(values, []int{10, 20, 30})); assert(len(queueDemo(nil)) == 0)`,
  linked: `var head *Node; head = appendNode(head, 10); head = appendNode(head, 20); var removed int; var ok bool; head, removed, ok = popFront(head); assert(ok && removed == 10 && head.Value == 20); head, removed, ok = popFront(head); assert(ok && removed == 20 && head == nil); head, _, ok = popFront(head); assert(!ok)`,
  tree: `var root *Node; for _, value := range []int{3, 1, 4, 3, 2} { root = insert(root, value) }; output := []int{}; inorder(root, &output); assert(equalInts(output, []int{1, 2, 3, 3, 4}))`,
  hash: `var table HashTable; table.Insert(-4); table.Insert(1); table.Insert(6); assert(table.Contains(-4)); assert(table.Contains(6)); assert(!table.Contains(11))`,
};

const helpers = `
func assert(ok bool) {
	if !ok {
		panic("assertion failed")
	}
}

func equalInts(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}`;

const directory = mkdtempSync(join(tmpdir(), 'algo-garden-go-'));
try {
  for (const [id, source] of Object.entries(goCode)) {
    const filename = join(directory, `${id}.go`);
    writeFileSync(
      filename,
      `${source}\n${helpers}\nfunc main() { ${checks[id as keyof typeof checks]} }\n`,
    );
    execFileSync('gofmt', ['-w', filename], { stdio: 'pipe' });
    execFileSync('go', ['run', filename], { stdio: 'pipe' });
    console.log(
      `PASS ${id}: standalone Go formatting, compilation, and behavior`,
    );
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
