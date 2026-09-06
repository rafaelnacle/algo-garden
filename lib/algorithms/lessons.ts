import { code } from './code.ts';
import type { Lesson } from './types.ts';

export const lessons: Lesson[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    category: 'Sorting',
    subtitle: 'Small swaps. A little more order, every pass.',
    time: 'O(n²)',
    space: 'O(1)',
    difficulty: 'Foundation',
    idea: 'Compare neighboring values and swap them when the left one is larger. With each pass, the largest remaining value bubbles to the right.',
    tricky:
      'Why j < end? The comparison reads a[j + 1], so j must stop one position before end. The values beyond end are already in their final positions. A pass with no swaps proves the whole array is sorted.',
    use: 'A clear first look at comparisons, swaps, and loop invariants. For large real-world arrays, prefer std::sort.',
    complexity:
      'Average and worst time: O(n²). Best time: O(n) with the early-exit flag. Extra space: O(1). Stable because equal neighbors are never swapped.',
    code: code.bubble,
    question: 'A complete pass makes no swaps. What can you conclude?',
    answers: [
      'Only the last value is sorted.',
      'The entire array is sorted.',
      'The array contains no duplicates.',
    ],
    correct: 1,
    explanation:
      'Every adjacent pair is already ordered. That means the entire array is ordered, so another pass cannot change it.',
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    category: 'Sorting',
    subtitle: 'Find the smallest. Give it a permanent home.',
    time: 'O(n²)',
    space: 'O(1)',
    difficulty: 'Foundation',
    idea: 'Scan the unsorted region for its minimum, then swap that minimum into the first unsorted position. Grow the finished region from left to right.',
    tricky:
      'min is an index, not a value. Update the index while scanning, then swap once after the scan. Long-distance swaps can reverse equal elements, so this implementation is not stable.',
    use: 'Useful for understanding selection and when minimizing swaps matters more than minimizing comparisons.',
    complexity:
      'Best, average, and worst time: O(n²). Extra space: O(1). At most n − 1 swaps, but roughly n(n − 1)/2 comparisons even on sorted input.',
    code: code.selection,
    question: 'What does selection sort minimize compared with bubble sort?',
    answers: [
      'The number of swaps.',
      'The number of comparisons.',
      'The size of the input.',
    ],
    correct: 0,
    explanation:
      'It finds the minimum before making a single swap per pass. It still scans the entire remaining region.',
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    category: 'Sorting',
    subtitle: 'Make room for the next piece.',
    time: 'O(n²)',
    space: 'O(1)',
    difficulty: 'Foundation',
    idea: 'Treat the left prefix as a sorted hand of cards. Hold the next value, shift larger values right, and insert it into the gap.',
    tricky:
      'The key is saved before shifting. Duplicate bars during a shift are expected: the original key is held in a separate variable. Test j >= 0 before reading a[j] to avoid indexing before the array.',
    use: 'Works particularly well on small or nearly sorted inputs. Often used inside hybrid sorting algorithms.',
    complexity:
      'Average and worst time: O(n²). Best time: O(n) on sorted input. Extra space: O(1). Stable because the shift condition is >, not >=.',
    code: code.insertion,
    question: 'Why save a[i] in a separate key variable?',
    answers: [
      'To sort in descending order.',
      'To make the algorithm recursive.',
      'Shifting would overwrite the value being inserted.',
    ],
    correct: 2,
    explanation:
      'The first shift writes into a[i]. Saving the key preserves that value until its destination is found.',
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    category: 'Sorting',
    subtitle: 'Break it down. Bring it back in order.',
    time: 'O(n log n)',
    space: 'O(n)',
    difficulty: 'Intermediate',
    idea: 'Recursively split the array into halves. Merge two sorted halves by repeatedly taking the smaller front value from temporary buffers.',
    tricky:
      'The range [lo, hi) excludes hi. A range of length zero or one is already sorted. Read from buffers while writing to the array, or you could overwrite a value you still need. Taking the left value on ties preserves stability.',
    use: 'Predictable performance and stable sorting. Useful for linked lists and external sorting when data does not fit in memory.',
    complexity:
      'Best, average, and worst time: O(n log n). Peak auxiliary space: O(n) plus O(log n) recursion. Stable with the <= tie rule.',
    code: code.merge,
    question: 'Why merge from temporary buffers?',
    answers: [
      'To preserve unread values while writing the result.',
      'To avoid all comparisons.',
      'To choose a random pivot.',
    ],
    correct: 0,
    explanation:
      'Writing directly over the original halves can destroy an element before it has been compared. Buffers keep both halves intact.',
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    category: 'Sorting',
    subtitle: 'One pivot. Two smaller problems.',
    time: 'O(n log n)',
    space: 'O(log n)',
    difficulty: 'Intermediate',
    idea: 'Partition around the final value as a pivot. Move smaller values left, put the pivot between the regions, and recursively sort each side.',
    tricky:
      'i marks the next slot for a value smaller than the pivot; j scans candidates. The pivot is fixed after partitioning and must be excluded from both recursive calls. This last-element pivot performs poorly on sorted or all-equal inputs.',
    use: 'In-place partitioning is a fundamental technique. std::sort uses a hybrid approach to avoid naive quicksort’s worst case.',
    complexity:
      'Average time: O(n log n), worst: O(n²). Recursion space averages O(log n) but is O(n) in the worst case. This partition scheme is not stable.',
    code: code.quick,
    question:
      'Which ranges should recursion process after pivot index p is fixed?',
    answers: [
      '[lo, p] and [p, hi]',
      '[lo, p − 1] and [p + 1, hi]',
      'Only [lo, p − 1]',
    ],
    correct: 1,
    explanation:
      'The pivot is already in its final position. Excluding it also guarantees that recursive subproblems shrink.',
  },
  {
    id: 'linear',
    name: 'Linear Search',
    category: 'Searching',
    subtitle: 'One honest question at a time.',
    time: 'O(n)',
    space: 'O(1)',
    difficulty: 'Foundation',
    idea: 'Visit each index in order. Return as soon as its value matches the target; return −1 if the scan ends without a match.',
    tricky:
      'The result is an index, not the matched value. Index 0 is a successful result, so do not use if (result) to test success. Use result != -1.',
    use: 'Small or unsorted collections where building an index or sorting first is unnecessary.',
    complexity:
      'Best time: O(1) if the first value matches. Average and worst time: O(n). Extra space: O(1). Returns the first matching index.',
    code: code.linear,
    question: 'The function returns 0. What does that mean?',
    answers: [
      'The target is absent.',
      'The target value equals zero.',
      'The target is at the first index.',
    ],
    correct: 2,
    explanation:
      'C++ arrays use zero-based indexing. A return value of 0 is a valid match; −1 indicates absence.',
  },
  {
    id: 'binary',
    name: 'Binary Search',
    category: 'Searching',
    subtitle: 'Every decision cuts the possibilities in half.',
    time: 'O(log n)',
    space: 'O(1)',
    difficulty: 'Foundation',
    idea: 'On sorted input, compare the middle value with the target. Discard the half that cannot contain the target and repeat on the remaining interval.',
    tricky:
      'This version uses inclusive bounds and lo <= hi. Move to mid + 1 or mid − 1, because mid has already been checked. lo + (hi − lo)/2 avoids overflow from adding the two bounds. The lab sorts input before the trace.',
    use: 'Fast lookups in sorted arrays and monotonic decision problems. C++ also provides std::lower_bound.',
    complexity:
      'Best time: O(1). Worst time: O(log n), with O(1) extra space. Sorting the input first costs additional time, which is not counted in the search trace. With duplicates, any matching index may be returned.',
    code: code.binary,
    question:
      'If a[mid] is smaller than the target, what is the new lower bound?',
    answers: ['mid', 'mid + 1', 'mid − 1'],
    correct: 1,
    explanation:
      'The target must lie strictly to the right. Keeping mid would repeat an already rejected candidate and can cause an infinite loop.',
  },
  {
    id: 'bfs',
    name: 'Breadth-first Search',
    category: 'Graphs',
    subtitle: 'Explore the neighborhood before the horizon.',
    time: 'O(V + E)',
    space: 'O(V)',
    difficulty: 'Foundation',
    idea: 'Use a queue to explore nodes layer by layer. Discover all one-edge neighbors before two-edge neighbors. Stop when the goal is visited.',
    tricky:
      'Mark nodes discovered when enqueuing, not when removing them, to avoid adding them repeatedly. BFS minimizes edge count, not weighted cost. The diagram’s weights are deliberately ignored here.',
    use: 'Shortest paths in unweighted graphs, degrees of separation, and level-order exploration.',
    complexity:
      'Worst time: O(V + E) with adjacency lists. Auxiliary space: O(V). The teaching renderer scans a small edge list; the C++ implementation uses adjacency lists.',
    code: code.bfs,
    question: 'Does BFS always find the cheapest route on a weighted graph?',
    answers: [
      'Yes, because it uses a queue.',
      'Only if every weight is different.',
      'No; it minimizes the number of edges.',
    ],
    correct: 2,
    explanation:
      'One expensive edge may cost more than several cheap ones. Use Dijkstra for nonnegative weighted costs.',
  },
  {
    id: 'dfs',
    name: 'Depth-first Search',
    category: 'Graphs',
    subtitle: 'Follow a thread. Then find your way back.',
    time: 'O(V + E)',
    space: 'O(V)',
    difficulty: 'Foundation',
    idea: 'Use a stack to follow the newest discovered branch first. When that branch runs out, return to the next pending node.',
    tricky:
      'A stack reverses processing order. The example inserts neighbors in reverse order to visit smaller labels first. Its discovery path is not necessarily a shortest path. Marking on insertion prevents duplicates.',
    use: 'Reachability, exploring connected components, and as a basis for cycle detection and topological ordering.',
    complexity:
      'Worst time: O(V + E) using adjacency lists. Auxiliary space: O(V) for visited state, parents, and the explicit stack.',
    code: code.dfs,
    question: 'Which behavior makes this traversal depth-first?',
    answers: [
      'Processing the most recently added node first.',
      'Sorting nodes by distance.',
      'Always choosing the cheapest edge.',
    ],
    correct: 0,
    explanation:
      'The last-in, first-out stack prioritizes the newest branch over older pending alternatives.',
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    category: 'Graphs',
    subtitle: 'The cheapest way forward, one node at a time.',
    time: 'O((V + E) log V)',
    space: 'O(V + E)',
    difficulty: 'Intermediate',
    idea: 'Expand the node with the smallest known distance. Relax its outgoing edges: if going through this node is cheaper, update the neighbor’s distance.',
    tricky:
      'All weights must be nonnegative. A C++ priority_queue is a max-heap by default; std::greater makes it a min-heap. Improved distances leave old entries in the queue, so skip entries whose cost is stale. The diagram also tracks parents to display the route.',
    use: 'Shortest routes on graphs with nonnegative travel costs, network latency, or movement costs.',
    complexity:
      'For simple graphs with adjacency lists and a binary heap: O((V + E) log V) time. Lazy queue entries take O(V + E) auxiliary space. The small teaching trace orders an array frontier for readability.',
    code: code.dijkstra,
    question: 'Why skip an entry when cost != dist[u]?',
    answers: [
      'It is an outdated route superseded by a cheaper one.',
      'The goal must be unreachable.',
      'The graph contains no cycles.',
    ],
    correct: 0,
    explanation:
      'A node can be queued again after a better route is discovered. The old, more expensive queue entry no longer needs expansion.',
  },
  {
    id: 'astar',
    name: 'A* Search',
    category: 'Graphs',
    subtitle: 'A shortest path with a sense of direction.',
    time: 'O((V + E) log V)',
    space: 'O(V + E)',
    difficulty: 'Intermediate',
    idea: 'Rank candidates by f = g + h: the actual cost so far plus an estimated remaining cost. A useful heuristic guides exploration toward the goal.',
    tricky:
      'This lesson uses h = Euclidean distance / 200. Every edge cost is at least that scaled geometric distance, making the heuristic consistent. A heuristic that overestimates can lose the shortest-path guarantee. With h = 0, A* becomes Dijkstra.',
    use: 'Goal-directed routing and game pathfinding when a safe lower-bound estimate is available.',
    complexity:
      'On a finite simple graph with a consistent heuristic and binary heap: O((V + E) log V) worst time and O(V + E) lazy-queue space. A heuristic can reduce work, but this small graph need not show fewer expansions.',
    code: code.astar,
    question: 'What happens if h is zero for every node?',
    answers: [
      'A* becomes DFS.',
      'A* behaves like Dijkstra.',
      'A* stops finding paths.',
    ],
    correct: 1,
    explanation:
      'Then f = g, so the frontier is ordered entirely by known distance from the start, exactly as in Dijkstra.',
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'Data structures',
    subtitle: 'The last thing in is the first thing out.',
    time: 'O(1)',
    space: 'O(n)',
    difficulty: 'Foundation',
    idea: 'Push values onto the top. Read the top value with top(), then remove it with pop(). The demo inserts every input and removes the newest value.',
    tricky:
      'std::stack::pop() returns void. Read top() before calling pop() if you need the removed value. Both require a nonempty stack, so guard with empty().',
    use: 'Undo history, parsing nested expressions, and iterative depth-first search.',
    complexity:
      'With the default deque backing: O(1) push, pop, and top. O(n) storage. Other backing containers can change operation guarantees.',
    code: code.stack,
    question: 'Push 10, then 20, then 30. Which value does pop remove?',
    answers: ['10', '20', '30'],
    correct: 2,
    explanation:
      'A stack is last in, first out. The most recently pushed value, 30, sits on top.',
  },
  {
    id: 'queue',
    name: 'Queue',
    category: 'Data structures',
    subtitle: 'A fair line: first come, first served.',
    time: 'O(1)',
    space: 'O(n)',
    difficulty: 'Foundation',
    idea: 'Add values at the back and remove them from the front. The demo enqueues the input values, then removes the oldest one.',
    tricky:
      'push() adds at the back, but pop() removes at the front. front() reads without removing. Check empty() before front() or pop().',
    use: 'Breadth-first search, task scheduling, and buffering items in arrival order.',
    complexity:
      'With the default deque backing: O(1) enqueue, dequeue, and front. O(n) total storage.',
    code: code.queue,
    question: 'Enqueue 10, then 20, then 30. What leaves first?',
    answers: ['10', '20', '30'],
    correct: 0,
    explanation:
      'A queue preserves arrival order. The oldest value, 10, is at the front.',
  },
  {
    id: 'linked',
    name: 'Linked List',
    category: 'Data structures',
    subtitle: 'Separate pieces. One connected sequence.',
    time: 'O(n)',
    space: 'O(n)',
    difficulty: 'Intermediate',
    idea: 'Each node owns a value and a link to the next node. Follow links to reach the tail and append. The demo then removes the head.',
    tricky:
      'unique_ptr expresses exclusive ownership. std::move transfers that ownership; it does not copy the node. The temporary next pointer keeps the rest of the list alive when the old head is destroyed.',
    use: 'Learning pointers and ownership, or maintaining sequences where you already have a position to insert or remove.',
    complexity:
      'This implementation traverses from the head to append: O(n) per append. Removing the head: O(1). Lookup: O(n). Storing a tail pointer would make append O(1). Storage: O(n).',
    code: code.linked,
    question: 'Why is append O(n) in this implementation?',
    answers: [
      'Every value is copied.',
      'It follows links from the head to find the tail.',
      'It sorts the list first.',
    ],
    correct: 1,
    explanation:
      'Without a stored tail pointer, reaching the last node requires traversing the list.',
  },
  {
    id: 'tree',
    name: 'Binary Search Tree',
    category: 'Data structures',
    subtitle: 'Every branch is a smaller decision.',
    time: 'O(h)',
    space: 'O(n)',
    difficulty: 'Intermediate',
    idea: 'This lesson uses a binary search tree: smaller values go left; larger or equal values go right. After insertion, an in-order traversal visits values in sorted order.',
    tricky:
      'A binary tree is not automatically a binary search tree. Ordering is an extra invariant. This tree is not balanced: sorted inputs form a chain and make its height h approach n. Duplicates go right consistently.',
    use: 'Ordered lookup and traversal. In practice, balanced containers such as std::map provide stronger performance guarantees.',
    complexity:
      'Insert or search: O(h), where h is height; O(log n) when balanced, O(n) in the worst case. Traversal: O(n). Node storage: O(n), recursion: O(h).',
    code: code.tree,
    question:
      'Insert already sorted values into this unbalanced tree. What can happen?',
    answers: [
      'The tree becomes perfectly balanced.',
      'It cannot store the values.',
      'It degenerates into a chain.',
    ],
    correct: 2,
    explanation:
      'Each larger value goes right. A chain has height proportional to n, so insertion and lookup can become linear.',
  },
  {
    id: 'hash',
    name: 'Hash Table',
    category: 'Data structures',
    subtitle: 'A small calculation. A direct destination.',
    time: 'O(1) avg.',
    space: 'O(n + B)',
    difficulty: 'Intermediate',
    idea: 'Hash each key into one of five buckets. Keys that share a bucket are stored in a chain. The demo allows duplicates, like a small multiset.',
    tricky:
      'Collisions are normal: different keys can have the same hash. Always compare the actual key in the bucket. In C++, a negative remainder stays negative, so (key % 5 + 5) % 5 normalizes the bucket index.',
    use: 'Fast key-based membership checks and maps. Production unordered containers resize their bucket arrays as they grow.',
    complexity:
      'Expected lookup is O(1 + n/B) with uniform hashing; O(1) needs a bounded load factor n/B. This fixed five-bucket example does not resize, so lookup tends toward O(n) as it grows. Insert is amortized O(1); worst-case vector growth is O(n). Storage: O(n + B).',
    code: code.hash,
    question: 'Two different keys hash to bucket 2. What should happen?',
    answers: [
      'Discard the second key.',
      'Keep both and compare keys during lookup.',
      'Treat them as the same key.',
    ],
    correct: 1,
    explanation:
      'The hash selects a bucket, not a unique identity. Chaining stores both keys so equality checks can distinguish them.',
  },
];
