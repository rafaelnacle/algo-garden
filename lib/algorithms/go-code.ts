import type { AlgorithmId } from './types.ts';

/** Self-contained Go examples. Slices are modified in place unless noted. */
export const goCode: Record<AlgorithmId, string> = {
  bubble: `package main

func bubbleSort(a []int) {
	for end := len(a); end > 1; end-- {
		swapped := false
		for j := 0; j+1 < end; j++ {
			if a[j] > a[j+1] {
				a[j], a[j+1] = a[j+1], a[j]
				swapped = true
			}
		}
		if !swapped {
			break
		}
	}
}`,
  selection: `package main

func selectionSort(a []int) {
	for i := 0; i+1 < len(a); i++ {
		minimum := i
		for j := i + 1; j < len(a); j++ {
			if a[j] < a[minimum] {
				minimum = j
			}
		}
		if minimum != i {
			a[i], a[minimum] = a[minimum], a[i]
		}
	}
}`,
  insertion: `package main

func insertionSort(a []int) {
	for i := 1; i < len(a); i++ {
		key := a[i]
		j := i
		for j > 0 && a[j-1] > key {
			a[j] = a[j-1]
			j--
		}
		a[j] = key
	}
}`,
  merge: `package main

func mergeSort(a []int) {
	buffer := make([]int, len(a))
	var sortRange func(int, int)
	sortRange = func(lo, hi int) {
		if hi-lo <= 1 {
			return
		}
		mid := lo + (hi-lo)/2
		sortRange(lo, mid)
		sortRange(mid, hi)
		i, j, k := lo, mid, lo
		for i < mid || j < hi {
			if j == hi || (i < mid && a[i] <= a[j]) {
				buffer[k] = a[i]
				i++
			} else {
				buffer[k] = a[j]
				j++
			}
			k++
		}
		copy(a[lo:hi], buffer[lo:hi])
	}
	sortRange(0, len(a))
}`,
  quick: `package main

func quickSort(a []int) {
	var sortRange func(int, int)
	sortRange = func(lo, hi int) {
		if lo >= hi {
			return
		}
		pivot := a[hi]
		i := lo
		for j := lo; j < hi; j++ {
			if a[j] < pivot {
				a[i], a[j] = a[j], a[i]
				i++
			}
		}
		a[i], a[hi] = a[hi], a[i]
		sortRange(lo, i-1)
		sortRange(i+1, hi)
	}
	sortRange(0, len(a)-1)
}`,
  linear: `package main

func linearSearch(a []int, target int) int {
	for i, value := range a {
		if value == target {
			return i
		}
	}
	return -1
}`,
  binary: `package main

// Precondition: a is sorted in ascending order.
func binarySearch(a []int, target int) int {
	lo, hi := 0, len(a)
	for lo < hi {
		mid := lo + (hi-lo)/2
		if a[mid] == target {
			return mid
		}
		if a[mid] < target {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return -1
}`,
  bfs: `package main

func bfs(graph [][]int, start, goal int) []int {
	parent := make([]int, len(graph))
	for i := range parent {
		parent[i] = -1
	}
	seen := make([]bool, len(graph))
	queue := []int{start}
	seen[start] = true
	for len(queue) > 0 {
		u := queue[0]
		queue = queue[1:]
		if u == goal {
			break
		}
		for _, v := range graph[u] {
			if seen[v] {
				continue
			}
			seen[v] = true
			parent[v] = u
			queue = append(queue, v)
		}
	}
	return parent
}`,
  dfs: `package main

func dfs(graph [][]int, start, goal int) []int {
	parent := make([]int, len(graph))
	for i := range parent {
		parent[i] = -1
	}
	seen := make([]bool, len(graph))
	stack := []int{start}
	seen[start] = true
	for len(stack) > 0 {
		last := len(stack) - 1
		u := stack[last]
		stack = stack[:last]
		if u == goal {
			break
		}
		for i := len(graph[u]) - 1; i >= 0; i-- {
			v := graph[u][i]
			if seen[v] {
				continue
			}
			seen[v] = true
			parent[v] = u
			stack = append(stack, v)
		}
	}
	return parent
}`,
  dijkstra: `package main

type Edge struct {
	To     int
	Weight int
}

func dijkstra(graph [][]Edge, start, goal int) []int {
	const infinity = int(^uint(0) >> 1)
	distance := make([]int, len(graph))
	visited := make([]bool, len(graph))
	for i := range distance {
		distance[i] = infinity
	}
	distance[start] = 0
	for range graph {
		u := -1
		for i := range graph {
			if !visited[i] && distance[i] != infinity &&
				(u == -1 || distance[i] < distance[u]) {
				u = i
			}
		}
		if u == -1 {
			break
		}
		visited[u] = true
		if u == goal {
			break
		}
		for _, edge := range graph[u] {
			next := distance[u] + edge.Weight
			if next < distance[edge.To] {
				distance[edge.To] = next
			}
		}
	}
	return distance
}`,
  astar: `package main

type Edge struct {
	To     int
	Weight int
}

func astar(graph [][]Edge, start, goal int, heuristic []float64) float64 {
	const infinity = 1.7976931348623157e+308
	distance := make([]float64, len(graph))
	visited := make([]bool, len(graph))
	for i := range distance {
		distance[i] = infinity
	}
	distance[start] = 0
	for range graph {
		u := -1
		for i := range graph {
			if !visited[i] && distance[i] != infinity &&
				(u == -1 || distance[i]+heuristic[i] < distance[u]+heuristic[u]) {
				u = i
			}
		}
		if u == -1 {
			break
		}
		if u == goal {
			return distance[u]
		}
		visited[u] = true
		for _, edge := range graph[u] {
			next := distance[u] + float64(edge.Weight)
			if next < distance[edge.To] {
				distance[edge.To] = next
			}
		}
	}
	return infinity
}`,
  stack: `package main

func stackDemo(values []int) []int {
	stack := append([]int(nil), values...)
	if len(stack) > 0 {
		removed := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		_ = removed
	}
	return stack
}`,
  queue: `package main

func queueDemo(values []int) []int {
	queue := append([]int(nil), values...)
	if len(queue) > 0 {
		removed := queue[0]
		queue = queue[1:]
		_ = removed
	}
	return queue
}`,
  linked: `package main

type Node struct {
	Value int
	Next  *Node
}

func appendNode(head *Node, value int) *Node {
	node := &Node{Value: value}
	if head == nil {
		return node
	}
	tail := head
	for tail.Next != nil {
		tail = tail.Next
	}
	tail.Next = node
	return head
}

func popFront(head *Node) (*Node, int, bool) {
	if head == nil {
		return nil, 0, false
	}
	return head.Next, head.Value, true
}`,
  tree: `package main

type Node struct {
	Value       int
	Left, Right *Node
}

func insert(root *Node, value int) *Node {
	if root == nil {
		return &Node{Value: value}
	}
	if value < root.Value {
		root.Left = insert(root.Left, value)
	} else {
		root.Right = insert(root.Right, value)
	}
	return root
}

func inorder(root *Node, output *[]int) {
	if root == nil {
		return
	}
	inorder(root.Left, output)
	*output = append(*output, root.Value)
	inorder(root.Right, output)
}`,
  hash: `package main

const bucketCount = 5

type HashTable [bucketCount][]int

func hash(key int) int {
	bucket := key % bucketCount
	if bucket < 0 {
		bucket += bucketCount
	}
	return bucket
}

func (table *HashTable) Insert(key int) {
	bucket := hash(key)
	table[bucket] = append(table[bucket], key)
}

func (table *HashTable) Contains(key int) bool {
	for _, value := range table[hash(key)] {
		if value == key {
			return true
		}
	}
	return false
}`,
};

const goLineMap: Record<AlgorithmId, Record<number, number>> = {
  bubble: { 1: 3, 5: 4, 8: 7, 9: 8, 13: 12 },
  selection: { 1: 3, 7: 7, 8: 12 },
  insertion: { 1: 3, 4: 5, 6: 7, 7: 8, 10: 11 },
  merge: { 1: 3, 5: 10, 14: 16, 15: 19 },
  quick: { 1: 3, 4: 10, 6: 12, 7: 13, 10: 17 },
  linear: { 1: 3, 4: 5 },
  binary: { 1: 4, 6: 7, 7: 8, 8: 11 },
  bfs: { 1: 3, 9: 12, 10: 14, 13: 23 },
  dfs: { 1: 3, 9: 13, 10: 15, 13: 25 },
  dijkstra: { 1: 8, 13: 21, 15: 28, 19: 34 },
  astar: { 1: 8, 15: 21, 17: 27, 21: 34 },
  stack: { 1: 3, 5: 4, 8: 7 },
  queue: { 1: 3, 5: 4, 8: 7 },
  linked: { 1: 3, 8: 17, 13: 25 },
  tree: { 1: 3, 5: 10, 6: 12, 12: 25 },
  hash: { 1: 3, 8: 17 },
};

export function goLineFor(id: AlgorithmId, cppLine: number) {
  return goLineMap[id][cppLine] ?? 1;
}
