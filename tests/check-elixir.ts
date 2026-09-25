import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { elixirCode } from '../lib/algorithms/elixir-code.ts';

function sortChecks(module: string) {
  return `for values <- [[], [1], [2, 1], [1, 2, 3], [3, 2, 1], [4, -2, 0, 4, 1], [3, 3, 3]] do
    assert ${module}.sort(values) == Enum.sort(values)
  end`;
}

const graph = '%{0 => [1, 2], 1 => [0, 3], 2 => [0, 3], 3 => [1, 2], 4 => []}';
const weighted =
  '%{0 => [{1, 8}, {2, 2}], 1 => [{0, 8}, {2, 1}], 2 => [{0, 2}, {1, 1}], 3 => []}';
const checks: Record<keyof typeof elixirCode, string> = {
  bubble: sortChecks('BubbleSort'),
  selection: sortChecks('SelectionSort'),
  insertion: sortChecks('InsertionSort'),
  merge: sortChecks('MergeSort'),
  quick: sortChecks('QuickSort'),
  linear: `assert LinearSearch.search([], 2) == nil
    assert LinearSearch.search([1, 2, 2, 3], 2) == 1
    assert LinearSearch.search([1, 2, 3], 3) == 2
    assert LinearSearch.search([1, 2, 3], 4) == nil`,
  binary: `for values <- [[], [1], [1, 2, 2, 3], [-3, 0, 4]], target <- -4..5 do
      result = BinarySearch.search(List.to_tuple(values), target)
      if target in values, do: assert(Enum.at(values, result) == target), else: assert(result == nil)
    end`,
  bfs: `assert BFS.search(${graph}, 0, 3)[3] == 1
    assert BFS.search(${graph}, 0, 3)[1] == 0
    refute Map.has_key?(BFS.search(${graph}, 0, 4), 4)
    assert BFS.search(${graph}, 0, 0) == %{0 => nil}`,
  dfs: `assert DFS.search(${graph}, 0, 3)[3] == 1
    refute Map.has_key?(DFS.search(${graph}, 0, 4), 4)
    assert DFS.search(${graph}, 0, 0) == %{0 => nil}`,
  dijkstra: `assert Dijkstra.search(${weighted}, 0, 1)[1] == 3
    assert Dijkstra.search(${weighted}, 0, 0)[0] == 0
    refute Map.has_key?(Dijkstra.search(${weighted}, 0, 3), 3)
    assert Dijkstra.search(%{0 => [{1, 0}], 1 => []}, 0, 1)[1] == 0`,
  astar: `assert AStar.search(${weighted}, 0, 1, fn _ -> 0 end) == 3
    assert AStar.search(${weighted}, 0, 1, fn node -> %{0 => 3, 1 => 0, 2 => 1, 3 => 0}[node] end) == 3
    assert AStar.search(${weighted}, 0, 0, fn _ -> 0 end) == 0
    assert AStar.search(${weighted}, 0, 3, fn _ -> 0 end) == :unreachable`,
  stack: `assert Stack.demo([10, 20, 30]) == [10, 20]
    assert Stack.demo([]) == []
    assert Stack.demo([1]) == []
    assert Stack.pop(Stack.push([], 5)) == {5, []}`,
  queue: `assert Queue.demo([10, 20, 30]) == [20, 30]
    assert Queue.demo([]) == []
    assert Queue.demo([1]) == []`,
  linked: `head = LinkedList.append([], 10)
    next = LinkedList.append(head, 20)
    assert head == [10]
    assert LinkedList.pop_front(next) == [20]
    assert LinkedList.pop_front([10]) == []
    assert LinkedList.pop_front([]) == []`,
  tree: `tree = Enum.reduce([3, 1, 4, 3, 2], nil, fn value, tree -> BinaryTree.insert(tree, value) end)
    assert BinaryTree.inorder(tree) == [1, 2, 3, 3, 4]
    assert BinaryTree.inorder(nil) == []`,
  hash: `empty = HashTable.new()
    table = Enum.reduce([-4, 1, 6, 6], empty, fn value, table -> HashTable.insert(table, value) end)
    assert HashTable.contains?(table, -4)
    assert HashTable.contains?(table, 6)
    refute HashTable.contains?(table, 11)
    refute HashTable.contains?(empty, 6)
    assert elem(table, 1) == [6, 6, 1, -4]`,
};

const directory = mkdtempSync(join(tmpdir(), 'algo-garden-elixir-'));
try {
  for (const [id, source] of Object.entries(elixirCode)) {
    const filename = join(directory, `${id}.exs`);
    writeFileSync(
      filename,
      `${source}\nimport ExUnit.Assertions\n${checks[id as keyof typeof checks]}\n`,
    );
    try {
      execFileSync('elixir', [filename], { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`${id}: Elixir example failed`, { cause: error });
    }
    console.log(`PASS ${id}: standalone Elixir compilation and behavior`);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
