import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pythonCode } from '../lib/algorithms/python-code.ts';

const checks: Record<keyof typeof pythonCode, string> = {
  bubble: `assert bubble_sort([4, -2, 0, 4, 1]) == [-2, 0, 1, 4, 4]
assert bubble_sort([]) == []`,
  selection: `assert selection_sort([4, -2, 0, 4, 1]) == [-2, 0, 1, 4, 4]
assert selection_sort([]) == []`,
  insertion: `assert insertion_sort([4, -2, 0, 4, 1]) == [-2, 0, 1, 4, 4]
assert insertion_sort([]) == []`,
  merge: `assert merge_sort([4, -2, 0, 4, 1]) == [-2, 0, 1, 4, 4]
assert merge_sort([]) == []`,
  quick: `assert quick_sort([4, -2, 0, 4, 1]) == [-2, 0, 1, 4, 4]
assert quick_sort([]) == []`,
  linear: `assert linear_search([1, 2, 3], 1) == 0
assert linear_search([], 2) == -1
assert linear_search([1, 2, 3], 4) == -1`,
  binary: `assert binary_search([1, 2, 3], 1) == 0
assert binary_search([], 2) == -1
assert binary_search([1, 2, 3], 4) == -1`,
  bfs: `graph = [[1, 2], [0, 3], [0, 3], [1, 2]]
parent = bfs(graph, 0, 3)
assert parent[3] == 1 and parent[1] == 0`,
  dfs: `graph = [[1, 2], [0, 3], [0, 3], [1, 2]]
parent = dfs(graph, 0, 3)
assert parent[3] == 1`,
  dijkstra: `graph = [[(1, 8), (2, 2)], [(0, 8), (2, 1)], [(0, 2), (1, 1)]]
assert dijkstra(graph, 0, 1)[1] == 3`,
  astar: `graph = [[(1, 8), (2, 2)], [(0, 8), (2, 1)], [(0, 2), (1, 1)]]
assert astar(graph, 0, 1, [0, 0, 0]) == 3`,
  stack: `assert stack_demo([10, 20, 30]) == [10, 20]
assert stack_demo([]) == []`,
  queue: `assert list(queue_demo([10, 20, 30])) == [20, 30]
assert not queue_demo([])`,
  linked: `head = None
head = append(head, 10)
head = append(head, 20)
head = pop_front(head)
assert head.value == 20
head = pop_front(head)
head = pop_front(head)
assert head is None`,
  tree: `root = None
for value in [3, 1, 4, 3, 2]:
    root = insert(root, value)
output = []
inorder(root, output)
assert output == [1, 2, 3, 3, 4]`,
  hash: `table = HashTable()
for value in [-4, 1, 6]:
    table.insert(value)
assert table.contains(-4) and table.contains(6)
assert not table.contains(11)`,
};

const directory = mkdtempSync(join(tmpdir(), 'algo-garden-python-'));
try {
  for (const [id, source] of Object.entries(pythonCode)) {
    const filename = join(directory, `${id}.py`);
    writeFileSync(
      filename,
      `${source}\n\n${checks[id as keyof typeof checks]}\n`,
    );
    execFileSync('python3', [filename], { stdio: 'pipe' });
    console.log(`PASS ${id}: standalone Python 3 syntax and behavior`);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
