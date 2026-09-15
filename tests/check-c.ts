import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cCode } from '../lib/algorithms/c-code.ts';

const checks: Record<keyof typeof cCode, string> = {
  bubble: `int a[] = {4, -2, 0, 4, 1}; bubble_sort(a, 5); assert(memcmp(a, (int[]){-2, 0, 1, 4, 4}, sizeof a) == 0); bubble_sort(NULL, 0);`,
  selection: `int a[] = {4, -2, 0, 4, 1}; selection_sort(a, 5); assert(memcmp(a, (int[]){-2, 0, 1, 4, 4}, sizeof a) == 0); selection_sort(NULL, 0);`,
  insertion: `int a[] = {4, -2, 0, 4, 1}; insertion_sort(a, 5); assert(memcmp(a, (int[]){-2, 0, 1, 4, 4}, sizeof a) == 0); insertion_sort(NULL, 0);`,
  merge: `int a[] = {4, -2, 0, 4, 1}; assert(merge_sort(a, 5)); assert(memcmp(a, (int[]){-2, 0, 1, 4, 4}, sizeof a) == 0); assert(merge_sort(NULL, 0));`,
  quick: `int a[] = {4, -2, 0, 4, 1}; quick_sort(a, 5); assert(memcmp(a, (int[]){-2, 0, 1, 4, 4}, sizeof a) == 0); quick_sort(NULL, 0);`,
  linear: `int a[] = {1, 2, 3}; assert(linear_search(a, 3, 1) == 0); assert(linear_search(NULL, 0, 2) == -1); assert(linear_search(a, 3, 4) == -1);`,
  binary: `int a[] = {1, 2, 3}; assert(binary_search(a, 3, 1) == 0); assert(binary_search(NULL, 0, 2) == -1); assert(binary_search(a, 3, 4) == -1);`,
  bfs: `int a[] = {1, 2}, b[] = {0, 3}, c[] = {0, 3}, d[] = {1, 2}; GraphNode g[] = {{a, 2}, {b, 2}, {c, 2}, {d, 2}}; int parent[4]; assert(bfs(g, 4, 0, 3, parent)); assert(parent[3] == 1 && parent[1] == 0);`,
  dfs: `int a[] = {1, 2}, b[] = {0, 3}, c[] = {0, 3}, d[] = {1, 2}; GraphNode g[] = {{a, 2}, {b, 2}, {c, 2}, {d, 2}}; int parent[4]; assert(dfs(g, 4, 0, 3, parent)); assert(parent[3] == 1);`,
  dijkstra: `Edge a[] = {{1, 8}, {2, 2}}, b[] = {{0, 8}, {2, 1}}, c[] = {{0, 2}, {1, 1}}; GraphNode g[] = {{a, 2}, {b, 2}, {c, 2}}; long long distance[3]; dijkstra(g, 3, 0, 1, distance); assert(distance[1] == 3);`,
  astar: `Edge a[] = {{1, 8}, {2, 2}}, b[] = {{0, 8}, {2, 1}}, c[] = {{0, 2}, {1, 1}}; GraphNode g[] = {{a, 2}, {b, 2}, {c, 2}}; double h[] = {0, 0, 0}; assert(astar(g, 3, 0, 1, h) == 3);`,
  stack: `Stack stack = {0}; int removed; assert(stack_push(&stack, 10)); assert(stack_push(&stack, 20)); assert(stack_push(&stack, 30)); assert(stack_pop(&stack, &removed)); assert(removed == 30 && stack.size == 2); stack.size = 0; assert(!stack_pop(&stack, &removed));`,
  queue: `Queue queue = {0}; int removed; assert(queue_push(&queue, 10)); assert(queue_push(&queue, 20)); assert(queue_push(&queue, 30)); assert(queue_pop(&queue, &removed)); assert(removed == 10 && queue.size == 2 && queue.values[queue.head] == 20); queue.size = 0; assert(!queue_pop(&queue, &removed));`,
  linked: `Node *head = NULL; int removed; assert(append(&head, 10)); assert(append(&head, 20)); assert(pop_front(&head, &removed)); assert(removed == 10 && head->value == 20); assert(pop_front(&head, &removed)); assert(!pop_front(&head, &removed));`,
  tree: `Node *root = NULL; int values[] = {3, 1, 4, 3, 2}; for (size_t i = 0; i < 5; ++i) assert(insert(&root, values[i])); int output[5]; size_t n = 0; inorder(root, output, &n); assert(n == 5); assert(memcmp(output, (int[]){1, 2, 3, 3, 4}, sizeof output) == 0);`,
  hash: `HashTable table = {0}; assert(hash_insert(&table, -4)); assert(hash_insert(&table, 1)); assert(hash_insert(&table, 6)); assert(hash_contains(&table, -4)); assert(hash_contains(&table, 6)); assert(!hash_contains(&table, 11));`,
};

const directory = mkdtempSync(join(tmpdir(), 'algo-garden-c-'));
try {
  for (const [id, source] of Object.entries(cCode)) {
    const filename = join(directory, `${id}.c`);
    const executable = join(directory, id);
    writeFileSync(filename, source);
    execFileSync(
      'gcc',
      [
        '-std=c11',
        '-Wall',
        '-Wextra',
        '-Werror',
        '-c',
        filename,
        '-o',
        `${executable}.o`,
      ],
      { stdio: 'pipe' },
    );
    writeFileSync(
      filename,
      `${source}\n#include <assert.h>\n#include <string.h>\nint main(void) { ${checks[id as keyof typeof checks]} return 0; }\n`,
    );
    execFileSync(
      'gcc',
      ['-std=c11', '-Wall', '-Wextra', '-Werror', filename, '-o', executable],
      { stdio: 'pipe' },
    );
    execFileSync(executable, [], { stdio: 'pipe' });
    console.log(`PASS ${id}: standalone C11 compilation and behavior`);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
