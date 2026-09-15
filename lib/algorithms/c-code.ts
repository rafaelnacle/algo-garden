import type { AlgorithmId } from './types.ts';

/** Self-contained C11 examples. Arrays are passed with their lengths explicitly. */
export const cCode: Record<AlgorithmId, string> = {
  bubble: `#include <stdbool.h>
#include <stddef.h>
void bubble_sort(int a[], size_t n) {
  for (size_t end = n; end > 1; --end) {
    bool swapped = false;
    for (size_t j = 0; j + 1 < end; ++j) {
      if (a[j] > a[j + 1]) {
        int temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  selection: `#include <stddef.h>
void selection_sort(int a[], size_t n) {
  for (size_t i = 0; i + 1 < n; ++i) {
    size_t minimum = i;
    for (size_t j = i + 1; j < n; ++j)
      if (a[j] < a[minimum]) minimum = j;
    if (minimum != i) {
      int temp = a[i];
      a[i] = a[minimum];
      a[minimum] = temp;
    }
  }
}`,
  insertion: `#include <stddef.h>
void insertion_sort(int a[], size_t n) {
  for (size_t i = 1; i < n; ++i) {
    int key = a[i];
    size_t j = i;
    while (j > 0 && a[j - 1] > key) {
      a[j] = a[j - 1];
      --j;
    }
    a[j] = key;
  }
}`,
  merge: `#include <stdbool.h>
#include <stddef.h>
#include <stdlib.h>
static void sort_range(int a[], int buffer[], size_t lo, size_t hi) {
  if (hi - lo <= 1) return;
  size_t mid = lo + (hi - lo) / 2;
  sort_range(a, buffer, lo, mid);
  sort_range(a, buffer, mid, hi);
  size_t i = lo, j = mid, k = lo;
  while (i < mid || j < hi) {
    if (j == hi || (i < mid && a[i] <= a[j]))
      buffer[k++] = a[i++];
    else buffer[k++] = a[j++];
  }
  for (k = lo; k < hi; ++k) a[k] = buffer[k];
}
bool merge_sort(int a[], size_t n) {
  int *buffer = malloc(n * sizeof *buffer);
  if (n > 0 && buffer == NULL) return false;
  sort_range(a, buffer, 0, n);
  free(buffer);
  return true;
}`,
  quick: `#include <stddef.h>
static void swap(int *a, int *b) {
  int temp = *a; *a = *b; *b = temp;
}
static size_t partition(int a[], size_t lo, size_t hi) {
  int pivot = a[hi];
  size_t i = lo;
  for (size_t j = lo; j < hi; ++j) {
    if (a[j] < pivot) swap(&a[i++], &a[j]);
  }
  swap(&a[i], &a[hi]);
  return i;
}
static void sort_range(int a[], size_t lo, size_t hi) {
  if (lo >= hi) return;
  size_t p = partition(a, lo, hi);
  if (p > 0) sort_range(a, lo, p - 1);
  sort_range(a, p + 1, hi);
}
void quick_sort(int a[], size_t n) {
  if (n > 1) sort_range(a, 0, n - 1);
}`,
  linear: `#include <stddef.h>
#include <stdint.h>
ptrdiff_t linear_search(const int a[], size_t n, int target) {
  for (size_t i = 0; i < n; ++i)
    if (a[i] == target) return (ptrdiff_t)i;
  return -1;
}`,
  binary: `#include <stddef.h>
#include <stdint.h>
// Precondition: a is sorted in ascending order.
ptrdiff_t binary_search(const int a[], size_t n, int target) {
  size_t lo = 0, hi = n;
  while (lo < hi) {
    size_t mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return (ptrdiff_t)mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return -1;
}`,
  bfs: `#include <stdbool.h>
#include <stddef.h>
#include <stdlib.h>
typedef struct { const int *neighbors; size_t count; } GraphNode;
bool bfs(const GraphNode graph[], size_t n, int start, int goal,
         int parent[]) {
  bool *seen = calloc(n, sizeof *seen);
  int *queue = malloc(n * sizeof *queue);
  if ((n > 0 && seen == NULL) || (n > 0 && queue == NULL)) {
    free(seen); free(queue); return false;
  }
  for (size_t i = 0; i < n; ++i) parent[i] = -1;
  size_t head = 0, tail = 0;
  queue[tail++] = start; seen[start] = true;
  while (head < tail) {
    int u = queue[head++];
    if (u == goal) break;
    for (size_t i = 0; i < graph[u].count; ++i) {
      int v = graph[u].neighbors[i];
      if (seen[v]) continue;
      seen[v] = true; parent[v] = u; queue[tail++] = v;
    }
  }
  free(queue); free(seen); return true;
}`,
  dfs: `#include <stdbool.h>
#include <stddef.h>
#include <stdlib.h>
typedef struct { const int *neighbors; size_t count; } GraphNode;
bool dfs(const GraphNode graph[], size_t n, int start, int goal,
         int parent[]) {
  bool *seen = calloc(n, sizeof *seen);
  int *stack = malloc(n * sizeof *stack);
  if ((n > 0 && seen == NULL) || (n > 0 && stack == NULL)) {
    free(seen); free(stack); return false;
  }
  for (size_t i = 0; i < n; ++i) parent[i] = -1;
  size_t top = 0;
  stack[top++] = start; seen[start] = true;
  while (top > 0) {
    int u = stack[--top];
    if (u == goal) break;
    for (size_t i = graph[u].count; i > 0; --i) {
      int v = graph[u].neighbors[i - 1];
      if (seen[v]) continue;
      seen[v] = true; parent[v] = u; stack[top++] = v;
    }
  }
  free(stack); free(seen); return true;
}`,
  dijkstra: `#include <stdbool.h>
#include <limits.h>
#include <stddef.h>
typedef struct { int to, weight; } Edge;
typedef struct { const Edge *edges; size_t count; } GraphNode;
void dijkstra(const GraphNode graph[], size_t n, int start, int goal,
              long long distance[]) {
  bool visited[n];
  for (size_t i = 0; i < n; ++i) {
    distance[i] = LLONG_MAX; visited[i] = false;
  }
  distance[start] = 0;
  for (size_t step = 0; step < n; ++step) {
    int u = -1;
    for (size_t i = 0; i < n; ++i)
      if (!visited[i] && distance[i] != LLONG_MAX &&
          (u < 0 || distance[i] < distance[u])) u = (int)i;
    if (u < 0) break;
    visited[u] = true;
    if (u == goal) break;
    for (size_t i = 0; i < graph[u].count; ++i) {
      Edge edge = graph[u].edges[i];
      long long next = distance[u] + edge.weight;
      if (next < distance[edge.to]) distance[edge.to] = next;
    }
  }
}`,
  astar: `#include <stdbool.h>
#include <float.h>
#include <stddef.h>
typedef struct { int to, weight; } Edge;
typedef struct { const Edge *edges; size_t count; } GraphNode;
double astar(const GraphNode graph[], size_t n, int start, int goal,
             const double heuristic[]) {
  double distance[n];
  bool visited[n];
  for (size_t i = 0; i < n; ++i) {
    distance[i] = DBL_MAX; visited[i] = false;
  }
  distance[start] = 0.0;
  for (size_t step = 0; step < n; ++step) {
    int u = -1;
    for (size_t i = 0; i < n; ++i)
      if (!visited[i] && distance[i] != DBL_MAX &&
          (u < 0 || distance[i] + heuristic[i] <
                    distance[u] + heuristic[u])) u = (int)i;
    if (u < 0) break;
    if (u == goal) return distance[u];
    visited[u] = true;
    for (size_t i = 0; i < graph[u].count; ++i) {
      Edge edge = graph[u].edges[i];
      double next = distance[u] + edge.weight;
      if (next < distance[edge.to]) distance[edge.to] = next;
    }
  }
  return DBL_MAX;
}`,
  stack: `#include <stdbool.h>
#include <stddef.h>
#define CAPACITY 32
typedef struct { int values[CAPACITY]; size_t size; } Stack;
bool stack_push(Stack *stack, int value) {
  if (stack->size == CAPACITY) return false;
  stack->values[stack->size++] = value;
  return true;
}
bool stack_pop(Stack *stack, int *removed) {
  if (stack->size == 0) return false;
  *removed = stack->values[--stack->size];
  return true;
}`,
  queue: `#include <stdbool.h>
#include <stddef.h>
#define CAPACITY 32
typedef struct {
  int values[CAPACITY];
  size_t head, size;
} Queue;
bool queue_push(Queue *queue, int value) {
  if (queue->size == CAPACITY) return false;
  size_t tail = (queue->head + queue->size) % CAPACITY;
  queue->values[tail] = value;
  ++queue->size;
  return true;
}
bool queue_pop(Queue *queue, int *removed) {
  if (queue->size == 0) return false;
  *removed = queue->values[queue->head];
  queue->head = (queue->head + 1) % CAPACITY;
  --queue->size;
  return true;
}`,
  linked: `#include <stdbool.h>
#include <stdlib.h>
typedef struct Node { int value; struct Node *next; } Node;
bool append(Node **head, int value) {
  Node *node = malloc(sizeof *node);
  if (node == NULL) return false;
  node->value = value; node->next = NULL;
  if (*head == NULL) { *head = node; return true; }
  Node *tail = *head;
  while (tail->next != NULL) tail = tail->next;
  tail->next = node;
  return true;
}
bool pop_front(Node **head, int *removed) {
  if (*head == NULL) return false;
  Node *old_head = *head;
  *removed = old_head->value;
  *head = old_head->next;
  free(old_head);
  return true;
}`,
  tree: `#include <stdbool.h>
#include <stddef.h>
#include <stdlib.h>
typedef struct Node { int value; struct Node *left, *right; } Node;
bool insert(Node **root, int value) {
  if (*root == NULL) {
    *root = malloc(sizeof **root);
    if (*root == NULL) return false;
    **root = (Node){value, NULL, NULL};
    return true;
  }
  if (value < (*root)->value) return insert(&(*root)->left, value);
  return insert(&(*root)->right, value);
}
void inorder(const Node *root, int output[], size_t *size) {
  if (root == NULL) return;
  inorder(root->left, output, size);
  output[(*size)++] = root->value;
  inorder(root->right, output, size);
}`,
  hash: `#include <stdbool.h>
#include <stddef.h>
#define BUCKET_COUNT 5
#define BUCKET_CAPACITY 16
typedef struct {
  int values[BUCKET_COUNT][BUCKET_CAPACITY];
  size_t sizes[BUCKET_COUNT];
} HashTable;
static size_t hash(int key) {
  int bucket = key % BUCKET_COUNT;
  return (size_t)(bucket < 0 ? bucket + BUCKET_COUNT : bucket);
}
bool hash_insert(HashTable *table, int key) {
  size_t bucket = hash(key);
  if (table->sizes[bucket] == BUCKET_CAPACITY) return false;
  table->values[bucket][table->sizes[bucket]++] = key;
  return true;
}
bool hash_contains(const HashTable *table, int key) {
  size_t bucket = hash(key);
  for (size_t i = 0; i < table->sizes[bucket]; ++i)
    if (table->values[bucket][i] == key) return true;
  return false;
}`,
};

const cLineMap: Record<AlgorithmId, Record<number, number>> = {
  bubble: { 1: 3, 5: 4, 8: 7, 9: 8, 13: 14 },
  selection: { 1: 2, 7: 6, 8: 7 },
  insertion: { 1: 2, 4: 4, 6: 6, 7: 7, 10: 10 },
  merge: { 1: 17, 5: 6, 14: 12, 15: 13 },
  quick: { 1: 20, 4: 6, 6: 9, 7: 9, 10: 11 },
  linear: { 1: 3, 4: 5 },
  binary: { 1: 4, 6: 7, 7: 8, 8: 9 },
  bfs: { 1: 5, 9: 16, 10: 17, 13: 22 },
  dfs: { 1: 5, 9: 16, 10: 17, 13: 22 },
  dijkstra: { 1: 6, 13: 19, 15: 20, 19: 24 },
  astar: { 1: 6, 15: 20, 17: 21, 21: 26 },
  stack: { 1: 4, 5: 7, 8: 12 },
  queue: { 1: 7, 5: 11, 8: 17 },
  linked: { 1: 3, 8: 10, 13: 18 },
  tree: { 1: 4, 5: 6, 6: 12, 12: 18 },
  hash: { 1: 5, 8: 15 },
};

export function cLineFor(id: AlgorithmId, cppLine: number) {
  return cLineMap[id][cppLine] ?? 1;
}
