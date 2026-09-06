/** Self-contained C++17 examples. Each snippet compiles as a translation unit. */
export const code = {
  bubble: `#include <vector>
#include <utility>
void bubbleSort(std::vector<int>& a) {
  int n = static_cast<int>(a.size());
  for (int end = n - 1; end > 0; --end) {
    bool swapped = false;
    for (int j = 0; j < end; ++j) {
      if (a[j] > a[j + 1]) {
        std::swap(a[j], a[j + 1]);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  selection: `#include <vector>
#include <utility>
void selectionSort(std::vector<int>& a) {
  for (int i = 0; i + 1 < int(a.size()); ++i) {
    int min = i;
    for (int j = i + 1; j < int(a.size()); ++j)
      if (a[j] < a[min]) min = j;
    if (min != i) std::swap(a[i], a[min]);
  }
}`,
  insertion: `#include <vector>
void insertionSort(std::vector<int>& a) {
  for (int i = 1; i < int(a.size()); ++i) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      --j;
    }
    a[j + 1] = key;
  }
}`,
  merge: `#include <vector>
// Call mergeSort(a, 0, int(a.size())).
void mergeSort(std::vector<int>& a, int lo, int hi) {
  if (hi - lo <= 1) return;
  int mid = lo + (hi - lo) / 2;
  mergeSort(a, lo, mid);
  mergeSort(a, mid, hi);
  std::vector<int> left(a.begin()+lo, a.begin()+mid);
  std::vector<int> right(a.begin()+mid, a.begin()+hi);
  int i = 0, j = 0, k = lo;
  while (i < int(left.size()) || j < int(right.size())) {
    if (j == int(right.size()) ||
        (i < int(left.size()) && left[i] <= right[j]))
      a[k++] = left[i++];
    else a[k++] = right[j++];
  }
}`,
  quick: `#include <vector>
#include <utility>
int partition(std::vector<int>& a, int lo, int hi) {
  int pivot = a[hi], i = lo;
  for (int j = lo; j < hi; ++j) {
    if (a[j] < pivot) {
      std::swap(a[i++], a[j]);
    }
  }
  std::swap(a[i], a[hi]);
  return i;
}
// Call quickSort(a, 0, int(a.size()) - 1).
void quickSort(std::vector<int>& a, int lo, int hi) {
  if (lo >= hi) return;
  int p = partition(a, lo, hi);
  quickSort(a, lo, p - 1);
  quickSort(a, p + 1, hi);
}`,
  linear: `#include <vector>
int linearSearch(const std::vector<int>& a, int target) {
  for (int i = 0; i < int(a.size()); ++i)
    if (a[i] == target) return i;
  return -1;
}`,
  binary: `#include <vector>
// Precondition: a is sorted in ascending order.
int binarySearch(const std::vector<int>& a, int target) {
  int lo = 0, hi = int(a.size()) - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  bfs: `#include <vector>
#include <queue>
std::vector<int> bfs(const std::vector<std::vector<int>>& g,
                     int start, int goal) {
  std::vector<int> parent(g.size(), -1);
  std::vector<bool> seen(g.size());
  std::queue<int> q; q.push(start); seen[start] = true;
  while (!q.empty()) {
    int u = q.front(); q.pop();
    if (u == goal) break;
    for (int v : g[u]) {
      if (seen[v]) continue;
      seen[v] = true; parent[v] = u; q.push(v);
    }
  }
  return parent; // Follow parent[goal] back to start.
}`,
  dfs: `#include <vector>
#include <stack>
std::vector<int> dfs(const std::vector<std::vector<int>>& g,
                     int start, int goal) {
  std::vector<int> parent(g.size(), -1);
  std::vector<bool> seen(g.size());
  std::stack<int> s; s.push(start); seen[start] = true;
  while (!s.empty()) {
    int u = s.top(); s.pop();
    if (u == goal) break;
    for (auto it = g[u].rbegin(); it != g[u].rend(); ++it) {
      int v = *it; if (seen[v]) continue;
      seen[v] = true; parent[v] = u; s.push(v);
    }
  }
  return parent; // Discovery path; not a shortest-path guarantee.
}`,
  dijkstra: `#include <vector>
#include <queue>
#include <functional>
#include <limits>
using Edge = std::pair<int, int>; // neighbor, nonnegative cost
std::vector<long long> dijkstra(const std::vector<std::vector<Edge>>& g,
                                int start, int goal) {
  using Item = std::pair<long long, int>;
  std::vector<long long> dist(g.size(), std::numeric_limits<long long>::max());
  std::priority_queue<Item, std::vector<Item>, std::greater<Item>> q;
  dist[start] = 0; q.push({0, start});
  while (!q.empty()) {
    auto [cost, u] = q.top(); q.pop();
    if (cost != dist[u]) continue; // Skip outdated entries.
    if (u == goal) break;
    for (auto [v, weight] : g[u]) {
      long long next = cost + weight;
      if (next < dist[v]) {
        dist[v] = next;
        q.push({next, v});
      }
    }
  }
  return dist; // Only the goal distance is guaranteed final at early exit.
}`,
  astar: `#include <vector>
#include <queue>
#include <tuple>
#include <functional>
#include <limits>
using Edge = std::pair<int, int>; // neighbor, nonnegative cost
// h must be consistent, nonnegative, and h(goal) == 0.
double astar(const std::vector<std::vector<Edge>>& g, int start,
             int goal, const std::vector<double>& h) {
  using Item = std::tuple<double, double, int>; // f, g, node
  std::vector<double> dist(g.size(), std::numeric_limits<double>::infinity());
  std::priority_queue<Item, std::vector<Item>, std::greater<Item>> q;
  dist[start] = 0; q.push({h[start], 0, start});
  while (!q.empty()) {
    auto [f, cost, u] = q.top(); q.pop();
    if (cost != dist[u]) continue;
    if (u == goal) return cost;
    for (auto [v, weight] : g[u]) {
      double next = cost + weight;
      if (next < dist[v]) {
        dist[v] = next;
        q.push({next + h[v], next, v});
      }
    }
  }
  return std::numeric_limits<double>::infinity();
}`,
  stack: `#include <stack>
#include <vector>
std::stack<int> stackDemo(const std::vector<int>& input) {
  std::stack<int> s;
  for (int value : input) s.push(value);
  if (!s.empty()) {
    int removed = s.top(); // Read before removing.
    s.pop(); // pop() returns void, not the removed value.
    (void)removed;
  }
  return s;
}`,
  queue: `#include <queue>
#include <vector>
std::queue<int> queueDemo(const std::vector<int>& input) {
  std::queue<int> q;
  for (int value : input) q.push(value);
  if (!q.empty()) {
    int removed = q.front();
    q.pop(); // Removes the oldest value.
    (void)removed;
  }
  return q;
}`,
  linked: `#include <memory>
struct Node { int value; std::unique_ptr<Node> next; };
void append(std::unique_ptr<Node>& head, int value) {
  auto node = std::make_unique<Node>(Node{value, nullptr});
  if (!head) { head = std::move(node); return; }
  Node* tail = head.get(); // Non-owning pointer used to traverse.
  while (tail->next) tail = tail->next.get();
  tail->next = std::move(node);
}
void popFront(std::unique_ptr<Node>& head) {
  if (head) {
    auto next = std::move(head->next);
    head = std::move(next); // Old head is destroyed automatically.
  }
}`,
  tree: `#include <memory>
#include <vector>
struct Node { int value; std::unique_ptr<Node> left, right; };
void insert(std::unique_ptr<Node>& root, int value) {
  if (!root) { root = std::make_unique<Node>(Node{value, nullptr, nullptr}); return; }
  if (value < root->value) insert(root->left, value);
  else insert(root->right, value); // Duplicates go right.
}
void inorder(const std::unique_ptr<Node>& root, std::vector<int>& out) {
  if (!root) return;
  inorder(root->left, out);
  out.push_back(root->value);
  inorder(root->right, out);
}`,
  hash: `#include <array>
#include <vector>
#include <algorithm>
class HashTable {
  std::array<std::vector<int>, 5> buckets;
  int hash(int key) const { return (key % 5 + 5) % 5; }
public:
  void insert(int key) { buckets[hash(key)].push_back(key); }
  bool contains(int key) const {
    const auto& chain = buckets[hash(key)];
    return std::find(chain.begin(), chain.end(), key) != chain.end();
  }
}; // Teaching multiset: fixed bucket count, duplicates allowed.
// Production: consider std::unordered_set or std::unordered_map.`,
} as const;
