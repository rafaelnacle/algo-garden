import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rustCode } from '../lib/algorithms/rust-code.ts';

const checks: Record<keyof typeof rustCode, string> = {
  bubble: `let mut a = [4, -2, 0, 4, 1]; bubble_sort(&mut a); assert_eq!(a, [-2, 0, 1, 4, 4]); bubble_sort(&mut []);`,
  selection: `let mut a = [4, -2, 0, 4, 1]; selection_sort(&mut a); assert_eq!(a, [-2, 0, 1, 4, 4]); selection_sort(&mut []);`,
  insertion: `let mut a = [4, -2, 0, 4, 1]; insertion_sort(&mut a); assert_eq!(a, [-2, 0, 1, 4, 4]); insertion_sort(&mut []);`,
  merge: `let mut a = [4, -2, 0, 4, 1]; merge_sort(&mut a); assert_eq!(a, [-2, 0, 1, 4, 4]); merge_sort(&mut []);`,
  quick: `let mut a = [4, -2, 0, 4, 1]; quick_sort(&mut a); assert_eq!(a, [-2, 0, 1, 4, 4]); quick_sort(&mut []);`,
  linear: `let a = [1, 2, 3]; assert_eq!(linear_search(&a, 1), Some(0)); assert_eq!(linear_search(&[], 2), None); assert_eq!(linear_search(&a, 4), None);`,
  binary: `let a = [1, 2, 3]; assert_eq!(binary_search(&a, 1), Some(0)); assert_eq!(binary_search(&[], 2), None); assert_eq!(binary_search(&a, 4), None);`,
  bfs: `let graph = vec![vec![1, 2], vec![0, 3], vec![0, 3], vec![1, 2]]; let parent = bfs(&graph, 0, 3); assert_eq!(parent[3], Some(1)); assert_eq!(parent[1], Some(0));`,
  dfs: `let graph = vec![vec![1, 2], vec![0, 3], vec![0, 3], vec![1, 2]]; let parent = dfs(&graph, 0, 3); assert_eq!(parent[3], Some(1));`,
  dijkstra: `let graph = vec![vec![Edge { to: 1, weight: 8 }, Edge { to: 2, weight: 2 }], vec![Edge { to: 0, weight: 8 }, Edge { to: 2, weight: 1 }], vec![Edge { to: 0, weight: 2 }, Edge { to: 1, weight: 1 }]]; assert_eq!(dijkstra(&graph, 0, 1)[1], 3);`,
  astar: `let graph = vec![vec![Edge { to: 1, weight: 8 }, Edge { to: 2, weight: 2 }], vec![Edge { to: 0, weight: 8 }, Edge { to: 2, weight: 1 }], vec![Edge { to: 0, weight: 2 }, Edge { to: 1, weight: 1 }]]; assert_eq!(astar(&graph, 0, 1, &[0.0; 3]), 3.0);`,
  stack: `let values = [10, 20, 30]; assert_eq!(stack_demo(&values), vec![10, 20]); assert_eq!(values, [10, 20, 30]); assert!(stack_demo(&[]).is_empty());`,
  queue: `let values = [10, 20, 30]; assert_eq!(queue_demo(&values), VecDeque::from([20, 30])); assert_eq!(values, [10, 20, 30]); assert!(queue_demo(&[]).is_empty());`,
  linked: `let mut head = None; append(&mut head, 10); append(&mut head, 20); assert_eq!(pop_front(&mut head), Some(10)); assert_eq!(head.as_ref().map(|node| node.value), Some(20)); assert_eq!(pop_front(&mut head), Some(20)); assert_eq!(pop_front(&mut head), None);`,
  tree: `let mut root = None; for value in [3, 1, 4, 3, 2] { insert(&mut root, value); } let mut output = Vec::new(); inorder(&root, &mut output); assert_eq!(output, vec![1, 2, 3, 3, 4]);`,
  hash: `let mut table = HashTable::new(); table.insert(-4); table.insert(1); table.insert(6); assert!(table.contains(-4)); assert!(table.contains(6)); assert!(!table.contains(11));`,
};

const directory = mkdtempSync(join(tmpdir(), 'algo-garden-rust-'));
try {
  for (const [id, source] of Object.entries(rustCode)) {
    const filename = join(directory, `${id}.rs`);
    const executable = join(directory, id);
    writeFileSync(
      filename,
      `${source}\nfn main() { ${checks[id as keyof typeof checks]} }\n`,
    );
    execFileSync('rustfmt', ['--edition', '2021', filename], { stdio: 'pipe' });
    execFileSync(
      'rustc',
      ['--edition', '2021', '-D', 'warnings', filename, '-o', executable],
      { stdio: 'pipe' },
    );
    execFileSync(executable, [], { stdio: 'pipe' });
    console.log(
      `PASS ${id}: standalone Rust formatting, compilation, and behavior`,
    );
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
