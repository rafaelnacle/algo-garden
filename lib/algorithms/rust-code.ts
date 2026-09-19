import type { AlgorithmId } from './types.ts';

/** Self-contained Rust examples. Slices are modified in place unless noted. */
export const rustCode: Record<AlgorithmId, string> = {
  bubble: `fn bubble_sort(a: &mut [i32]) {
    for end in (2..=a.len()).rev() {
        let mut swapped = false;
        for j in 0..end - 1 {
            if a[j] > a[j + 1] {
                a.swap(j, j + 1);
                swapped = true;
            }
        }
        if !swapped {
            break;
        }
    }
}`,
  selection: `fn selection_sort(a: &mut [i32]) {
    for i in 0..a.len().saturating_sub(1) {
        let mut minimum = i;
        for j in i + 1..a.len() {
            if a[j] < a[minimum] {
                minimum = j;
            }
        }
        if minimum != i {
            a.swap(i, minimum);
        }
    }
}`,
  insertion: `fn insertion_sort(a: &mut [i32]) {
    for i in 1..a.len() {
        let key = a[i];
        let mut j = i;
        while j > 0 && a[j - 1] > key {
            a[j] = a[j - 1];
            j -= 1;
        }
        a[j] = key;
    }
}`,
  merge: `fn merge_sort(a: &mut [i32]) {
    let mut buffer = a.to_vec();
    sort_range(a, &mut buffer, 0, a.len());
}

fn sort_range(a: &mut [i32], buffer: &mut [i32], lo: usize, hi: usize) {
    if hi - lo <= 1 {
        return;
    }
    let mid = lo + (hi - lo) / 2;
    sort_range(a, buffer, lo, mid);
    sort_range(a, buffer, mid, hi);
    let (mut i, mut j, mut k) = (lo, mid, lo);
    while i < mid || j < hi {
        if j == hi || (i < mid && a[i] <= a[j]) {
            buffer[k] = a[i];
            i += 1;
        } else {
            buffer[k] = a[j];
            j += 1;
        }
        k += 1;
    }
    a[lo..hi].copy_from_slice(&buffer[lo..hi]);
}`,
  quick: `fn quick_sort(a: &mut [i32]) {
    if a.len() > 1 {
        sort_range(a, 0, a.len() - 1);
    }
}

fn sort_range(a: &mut [i32], lo: usize, hi: usize) {
    if lo >= hi {
        return;
    }
    let pivot = a[hi];
    let mut i = lo;
    for j in lo..hi {
        if a[j] < pivot {
            a.swap(i, j);
            i += 1;
        }
    }
    a.swap(i, hi);
    if i > 0 {
        sort_range(a, lo, i - 1);
    }
    sort_range(a, i + 1, hi);
}`,
  linear: `fn linear_search(a: &[i32], target: i32) -> Option<usize> {
    for (i, &value) in a.iter().enumerate() {
        if value == target {
            return Some(i);
        }
    }
    None
}`,
  binary: `// Precondition: a is sorted in ascending order.
fn binary_search(a: &[i32], target: i32) -> Option<usize> {
    let (mut lo, mut hi) = (0, a.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if a[mid] == target {
            return Some(mid);
        }
        if a[mid] < target {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    None
}`,
  bfs: `use std::collections::VecDeque;

fn bfs(graph: &[Vec<usize>], start: usize, goal: usize) -> Vec<Option<usize>> {
    let mut parent = vec![None; graph.len()];
    let mut seen = vec![false; graph.len()];
    let mut queue = VecDeque::from([start]);
    seen[start] = true;
    while let Some(u) = queue.pop_front() {
        if u == goal {
            break;
        }
        for &v in &graph[u] {
            if seen[v] {
                continue;
            }
            seen[v] = true;
            parent[v] = Some(u);
            queue.push_back(v);
        }
    }
    parent
}`,
  dfs: `fn dfs(graph: &[Vec<usize>], start: usize, goal: usize) -> Vec<Option<usize>> {
    let mut parent = vec![None; graph.len()];
    let mut seen = vec![false; graph.len()];
    let mut stack = vec![start];
    seen[start] = true;
    while let Some(u) = stack.pop() {
        if u == goal {
            break;
        }
        for &v in graph[u].iter().rev() {
            if seen[v] {
                continue;
            }
            seen[v] = true;
            parent[v] = Some(u);
            stack.push(v);
        }
    }
    parent
}`,
  dijkstra: `#[derive(Clone, Copy)]
struct Edge {
    to: usize,
    weight: usize,
}

fn dijkstra(graph: &[Vec<Edge>], start: usize, goal: usize) -> Vec<usize> {
    let mut distance = vec![usize::MAX; graph.len()];
    let mut visited = vec![false; graph.len()];
    distance[start] = 0;
    for _ in graph {
        let u = (0..graph.len())
            .filter(|&i| !visited[i] && distance[i] != usize::MAX)
            .min_by_key(|&i| distance[i]);
        let Some(u) = u else {
            break;
        };
        visited[u] = true;
        if u == goal {
            break;
        }
        for edge in &graph[u] {
            let next = distance[u] + edge.weight;
            if next < distance[edge.to] {
                distance[edge.to] = next;
            }
        }
    }
    distance
}`,
  astar: `#[derive(Clone, Copy)]
struct Edge {
    to: usize,
    weight: usize,
}

fn astar(graph: &[Vec<Edge>], start: usize, goal: usize, heuristic: &[f64]) -> f64 {
    let mut distance = vec![f64::INFINITY; graph.len()];
    let mut visited = vec![false; graph.len()];
    distance[start] = 0.0;
    for _ in graph {
        let u = (0..graph.len())
            .filter(|&i| !visited[i] && distance[i] != f64::INFINITY)
            .min_by(|&a, &b| {
                (distance[a] + heuristic[a]).total_cmp(&(distance[b] + heuristic[b]))
            });
        let Some(u) = u else {
            break;
        };
        if u == goal {
            return distance[u];
        }
        visited[u] = true;
        for edge in &graph[u] {
            let next = distance[u] + edge.weight as f64;
            if next < distance[edge.to] {
                distance[edge.to] = next;
            }
        }
    }
    f64::INFINITY
}`,
  stack: `fn stack_demo(values: &[i32]) -> Vec<i32> {
    let mut stack = values.to_vec();
    if let Some(removed) = stack.pop() {
        let _ = removed;
    }
    stack
}`,
  queue: `use std::collections::VecDeque;

fn queue_demo(values: &[i32]) -> VecDeque<i32> {
    let mut queue = VecDeque::from(values.to_vec());
    if let Some(removed) = queue.pop_front() {
        let _ = removed;
    }
    queue
}`,
  linked: `struct Node {
    value: i32,
    next: Option<Box<Node>>,
}

fn append(head: &mut Option<Box<Node>>, value: i32) {
    match head {
        Some(node) => append(&mut node.next, value),
        None => *head = Some(Box::new(Node { value, next: None })),
    }
}

fn pop_front(head: &mut Option<Box<Node>>) -> Option<i32> {
    head.take().map(|node| {
        *head = node.next;
        node.value
    })
}`,
  tree: `struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn insert(root: &mut Option<Box<Node>>, value: i32) {
    match root {
        None => {
            *root = Some(Box::new(Node { value, left: None, right: None }));
        }
        Some(node) if value < node.value => insert(&mut node.left, value),
        Some(node) => insert(&mut node.right, value),
    }
}

fn inorder(root: &Option<Box<Node>>, output: &mut Vec<i32>) {
    if let Some(node) = root {
        inorder(&node.left, output);
        output.push(node.value);
        inorder(&node.right, output);
    }
}`,
  hash: `const BUCKET_COUNT: usize = 5;

struct HashTable {
    buckets: [Vec<i32>; BUCKET_COUNT],
}

impl HashTable {
    fn new() -> Self {
        Self { buckets: std::array::from_fn(|_| Vec::new()) }
    }

    fn hash(key: i32) -> usize {
        key.rem_euclid(BUCKET_COUNT as i32) as usize
    }

    fn insert(&mut self, key: i32) {
        self.buckets[Self::hash(key)].push(key);
    }

    fn contains(&self, key: i32) -> bool {
        self.buckets[Self::hash(key)].contains(&key)
    }
}`,
};

const rustLineMap: Record<AlgorithmId, Record<number, number>> = {
  bubble: { 1: 1, 5: 2, 8: 5, 9: 6, 13: 10 },
  selection: { 1: 1, 7: 5, 8: 10 },
  insertion: { 1: 1, 4: 3, 6: 5, 7: 6, 10: 9 },
  merge: { 1: 1, 5: 10, 14: 16, 15: 19 },
  quick: { 1: 1, 4: 12, 6: 14, 7: 15, 10: 19 },
  linear: { 1: 1, 4: 3 },
  binary: { 1: 2, 6: 5, 7: 6, 8: 9 },
  bfs: { 1: 3, 9: 8, 10: 9, 13: 18 },
  dfs: { 1: 1, 9: 6, 10: 7, 13: 16 },
  dijkstra: { 1: 7, 13: 15, 15: 20, 19: 25 },
  astar: { 1: 7, 15: 17, 17: 20, 21: 27 },
  stack: { 1: 1, 5: 2, 8: 3 },
  queue: { 1: 3, 5: 4, 8: 5 },
  linked: { 1: 1, 8: 8, 13: 16 },
  tree: { 1: 1, 5: 10, 6: 12, 12: 20 },
  hash: { 1: 1, 8: 17 },
};

export function rustLineFor(id: AlgorithmId, cppLine: number) {
  return rustLineMap[id][cppLine] ?? 1;
}
