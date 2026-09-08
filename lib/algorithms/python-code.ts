import type { AlgorithmId } from './types.ts';

/** Self-contained Python 3 examples. */
export const pythonCode: Record<AlgorithmId, string> = {
  bubble: `def bubble_sort(values):
    a = list(values)
    for end in range(len(a) - 1, 0, -1):
        swapped = False
        for j in range(end):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
    return a`,
  selection: `def selection_sort(values):
    a = list(values)
    for i in range(len(a) - 1):
        minimum = i
        for j in range(i + 1, len(a)):
            if a[j] < a[minimum]:
                minimum = j
        if minimum != i:
            a[i], a[minimum] = a[minimum], a[i]
    return a`,
  insertion: `def insertion_sort(values):
    a = list(values)
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a`,
  merge: `def merge_sort(values):
    a = list(values)

    def sort(lo, hi):
        if hi - lo <= 1:
            return
        mid = lo + (hi - lo) // 2
        sort(lo, mid)
        sort(mid, hi)
        left, right = a[lo:mid], a[mid:hi]
        i = j = 0
        for k in range(lo, hi):
            if j == len(right) or (i < len(left) and left[i] <= right[j]):
                a[k] = left[i]
                i += 1
            else:
                a[k] = right[j]
                j += 1

    sort(0, len(a))
    return a`,
  quick: `def quick_sort(values):
    a = list(values)

    def partition(lo, hi):
        pivot, i = a[hi], lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        return i

    def sort(lo, hi):
        if lo >= hi:
            return
        p = partition(lo, hi)
        sort(lo, p - 1)
        sort(p + 1, hi)

    sort(0, len(a) - 1)
    return a`,
  linear: `def linear_search(a, target):
    for i, value in enumerate(a):
        if value == target:
            return i
    return -1`,
  binary: `def binary_search(a, target):
    # Precondition: a is sorted in ascending order.
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
  bfs: `from collections import deque

def bfs(graph, start, goal):
    parent = [-1] * len(graph)
    seen = [False] * len(graph)
    queue = deque([start])
    seen[start] = True
    while queue:
        u = queue.popleft()
        if u == goal:
            break
        for v in graph[u]:
            if seen[v]:
                continue
            seen[v] = True
            parent[v] = u
            queue.append(v)
    return parent  # Follow parent[goal] back to start.`,
  dfs: `def dfs(graph, start, goal):
    parent = [-1] * len(graph)
    seen = [False] * len(graph)
    stack = [start]
    seen[start] = True
    while stack:
        u = stack.pop()
        if u == goal:
            break
        for v in reversed(graph[u]):
            if seen[v]:
                continue
            seen[v] = True
            parent[v] = u
            stack.append(v)
    return parent  # Discovery path; not always shortest.`,
  dijkstra: `from heapq import heappop, heappush
from math import inf

def dijkstra(graph, start, goal):
    distances = [inf] * len(graph)
    distances[start] = 0
    queue = [(0, start)]
    while queue:
        cost, u = heappop(queue)
        if cost != distances[u]:
            continue
        if u == goal:
            break
        for v, weight in graph[u]:
            new_cost = cost + weight
            if new_cost < distances[v]:
                distances[v] = new_cost
                heappush(queue, (new_cost, v))
    return distances`,
  astar: `from heapq import heappop, heappush
from math import inf

def astar(graph, start, goal, heuristic):
    distances = [inf] * len(graph)
    distances[start] = 0
    queue = [(heuristic[start], 0, start)]
    while queue:
        _, cost, u = heappop(queue)
        if cost != distances[u]:
            continue
        if u == goal:
            return cost
        for v, weight in graph[u]:
            new_cost = cost + weight
            if new_cost < distances[v]:
                distances[v] = new_cost
                estimate = new_cost + heuristic[v]
                heappush(queue, (estimate, new_cost, v))
    return inf`,
  stack: `def stack_demo(values):
    stack = []
    for value in values:
        stack.append(value)
    if stack:
        removed = stack.pop()
        _ = removed
    return stack`,
  queue: `from collections import deque

def queue_demo(values):
    queue = deque()
    for value in values:
        queue.append(value)
    if queue:
        removed = queue.popleft()
        _ = removed
    return queue`,
  linked: `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

def append(head, value):
    node = Node(value)
    if head is None:
        return node
    tail = head
    while tail.next is not None:
        tail = tail.next
    tail.next = node
    return head

def pop_front(head):
    return None if head is None else head.next`,
  tree: `class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root

def inorder(root, output):
    if root is None:
        return
    inorder(root.left, output)
    output.append(root.value)
    inorder(root.right, output)`,
  hash: `class HashTable:
    def __init__(self):
        self.buckets = [[] for _ in range(5)]

    def _hash(self, key):
        return key % len(self.buckets)

    def insert(self, key):
        self.buckets[self._hash(key)].append(key)

    def contains(self, key):
        chain = self.buckets[self._hash(key)]
        return key in chain`,
};

const pythonLineMap: Record<AlgorithmId, Record<number, number>> = {
  bubble: { 1: 1, 5: 3, 8: 6, 9: 7, 13: 9 },
  selection: { 1: 1, 7: 6, 8: 9 },
  insertion: { 1: 1, 4: 4, 6: 6, 7: 7, 10: 9 },
  merge: { 1: 1, 5: 7, 14: 14, 15: 17 },
  quick: { 1: 1, 4: 5, 6: 7, 7: 8, 10: 10 },
  linear: { 1: 1, 4: 3 },
  binary: { 1: 2, 6: 5, 7: 6, 8: 9 },
  bfs: { 1: 3, 9: 9, 10: 10, 13: 15 },
  dfs: { 1: 1, 9: 7, 10: 8, 13: 13 },
  dijkstra: { 1: 4, 13: 9, 15: 12, 19: 17 },
  astar: { 1: 4, 15: 9, 17: 12, 21: 17 },
  stack: { 1: 1, 5: 4, 8: 6 },
  queue: { 1: 3, 5: 6, 8: 8 },
  linked: { 1: 1, 8: 13, 13: 17 },
  tree: { 1: 1, 5: 9, 6: 10, 12: 21 },
  hash: { 1: 1, 8: 9 },
};

export function pythonLineFor(id: AlgorithmId, cppLine: number) {
  return pythonLineMap[id][cppLine] ?? 1;
}
