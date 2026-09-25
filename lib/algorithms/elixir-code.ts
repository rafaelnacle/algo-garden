import type { AlgorithmId } from './types.ts';

/** Standalone modules: immutable collections return updated values. */
export const elixirCode: Record<AlgorithmId, string> = {
  bubble: `defmodule BubbleSort do
  def sort(values) do
    {next, swapped} = pass(values)
    if swapped, do: sort(next), else: next
  end

  defp pass([]), do: {[], false}
  defp pass([x]), do: {[x], false}
  defp pass([a, b | tail]) when a > b do
    {rest, _} = pass([a | tail])
    {[b | rest], true}
  end
  defp pass([a, b | tail]) do
    {rest, swapped} = pass([b | tail])
    {[a | rest], swapped}
  end
end`,
  selection: `defmodule SelectionSort do
  def sort([]), do: []
  def sort(values) do
    minimum = Enum.reduce(values, hd(values), fn value, best ->
      if value < best, do: value, else: best
    end)
    # Delete only one occurrence, preserving duplicates.
    [minimum | sort(List.delete(values, minimum))]
  end
end`,
  insertion: `defmodule InsertionSort do
  def sort(values), do: Enum.reduce(values, [], &insert/2)

  defp insert(value, []), do: [value]
  defp insert(value, [head | _] = sorted) when value <= head do
    [value | sorted]
  end
  defp insert(value, [head | tail]) do
    [head | insert(value, tail)]
  end
end`,
  merge: `defmodule MergeSort do
  def sort([]), do: []
  def sort([x]), do: [x]
  def sort(values) do
    {left, right} = Enum.split(values, div(length(values), 2))
    merge(sort(left), sort(right))
  end

  defp merge([], right), do: right
  defp merge(left, []), do: left
  defp merge([a | left], [b | _] = right) when a <= b do
    [a | merge(left, right)]
  end
  defp merge(left, [b | right]) do
    [b | merge(left, right)]
  end
end`,
  quick: `defmodule QuickSort do
  def sort([]), do: []
  def sort(values) do
    # Match the playground's choice of the last element as pivot.
    {rest, [pivot]} = Enum.split(values, -1)
    {left, right} = Enum.split_with(rest, fn value -> value < pivot end)
    # Lists are immutable: partition into new lists instead of swapping.
    sort(left) ++ [pivot | sort(right)]
  end
end`,
  linear: `defmodule LinearSearch do
  def search(values, target), do: find(values, target, 0)

  defp find([], _target, _index), do: nil
  defp find([value | _], target, index) when value == target, do: index
  defp find([_ | tail], target, index), do: find(tail, target, index + 1)
end`,
  binary: `defmodule BinarySearch do
  # Supply a sorted tuple for O(1) indexing and O(log n) search.
  # List.to_tuple(values) is an optional O(n) conversion before searching.
  def search(values, target), do: find(values, target, 0, tuple_size(values))

  defp find(_values, _target, lo, hi) when lo >= hi, do: nil
  defp find(values, target, lo, hi) do
    mid = lo + div(hi - lo, 2)
    cond do
      elem(values, mid) == target -> mid
      elem(values, mid) < target -> find(values, target, mid + 1, hi)
      true -> find(values, target, lo, mid)
    end
  end
end`,
  bfs: `defmodule BFS do
  # graph is a map from node IDs to lists of neighbor IDs.
  def search(graph, start, goal) do
    visit(graph, :queue.from_list([start]), %{start => nil}, goal)
  end

  defp visit(graph, queue, parents, goal) do
    case :queue.out(queue) do
      {:empty, _} -> parents
      {{:value, u}, rest} ->
        if u == goal do
          parents
        else
          {queue, parents} = Enum.reduce(Map.get(graph, u, []), {rest, parents}, fn v, {q, p} ->
            if Map.has_key?(p, v) do
              {q, p}
            else
              {:queue.in(v, q), Map.put(p, v, u)}
            end
          end)
          visit(graph, queue, parents, goal)
        end
    end
  end
end`,
  dfs: `defmodule DFS do
  def search(graph, start, goal), do: visit(graph, [start], %{start => nil}, goal)

  defp visit(_graph, [], parents, _goal), do: parents
  defp visit(graph, [u | rest], parents, goal) do
    if u == goal do
      parents
    else
      neighbors = graph |> Map.get(u, []) |> Enum.reverse()
      {stack, parents} = Enum.reduce(neighbors, {rest, parents}, fn v, {s, p} ->
        if Map.has_key?(p, v) do
          {s, p}
        else
          {[v | s], Map.put(p, v, u)}
        end
      end)
      visit(graph, stack, parents, goal)
    end
  end
end`,
  dijkstra: `defmodule Dijkstra do
  # Edges are {neighbor, nonnegative_weight}. Missing distances are unreachable.
  # A gb_sets ordered set serves as a priority queue of {cost, node} pairs.
  def search(graph, start, goal) do
    visit(graph, :gb_sets.singleton({0, start}), %{start => 0}, goal)
  end

  defp visit(graph, queue, distances, goal) do
    if :gb_sets.is_empty(queue) do
      distances
    else
      {{cost, u}, queue} = :gb_sets.take_smallest(queue)
      cond do
        cost != distances[u] -> visit(graph, queue, distances, goal)
        u == goal -> distances
        true ->
          {queue, distances} = Enum.reduce(Map.get(graph, u, []), {queue, distances}, fn {v, weight}, {q, d} ->
            next = cost + weight
            if not Map.has_key?(d, v) or next < d[v] do
              {:gb_sets.add({next, v}, q), Map.put(d, v, next)}
            else
              {q, d}
            end
          end)
          visit(graph, queue, distances, goal)
      end
    end
  end
  # With early exit only the goal's distance is guaranteed final.
end`,
  astar: `defmodule AStar do
  # Nonnegative weights; h is consistent, nonnegative, and zero at the goal.
  def search(graph, start, goal, h) do
    visit(graph, :gb_sets.singleton({h.(start), 0, start}), %{start => 0}, goal, h)
  end

  defp visit(graph, queue, distances, goal, h) do
    if :gb_sets.is_empty(queue) do
      :unreachable
    else
      {{_estimate, cost, u}, queue} = :gb_sets.take_smallest(queue)
      cond do
        cost != distances[u] -> visit(graph, queue, distances, goal, h)
        u == goal -> cost
        true ->
          {queue, distances} = Enum.reduce(Map.get(graph, u, []), {queue, distances}, fn {v, weight}, {q, d} ->
            next = cost + weight
            if not Map.has_key?(d, v) or next < d[v] do
              {:gb_sets.add({next + h.(v), next, v}, q), Map.put(d, v, next)}
            else
              {q, d}
            end
          end)
          visit(graph, queue, distances, goal, h)
      end
    end
  end
end`,
  stack: `defmodule Stack do
  # Head is the top: push and pop are O(1).
  def push(stack, value), do: [value | stack]
  def pop([]), do: :empty
  def pop([value | rest]), do: {value, rest}

  def demo(values) do
    stack = Enum.reduce(values, [], fn value, stack -> push(stack, value) end)
    case pop(stack) do
      :empty -> []
      {_removed, rest} -> Enum.reverse(rest)
    end
  end
  # Reverse only for display in the playground's bottom-to-top order.
end`,
  queue: `defmodule Queue do
  # Erlang's two-list queue supports amortized O(1) enqueue/dequeue.
  def demo(values) do
    queue = Enum.reduce(values, :queue.new(), fn value, q -> :queue.in(value, q) end)
    case :queue.out(queue) do
      {:empty, _} -> []
      {{:value, _removed}, rest} -> :queue.to_list(rest)
    end
  end
end`,
  linked: `defmodule LinkedList do
  # Elixir lists are already linked lists. [head | tail] splits one node.
  def append([], value), do: [value]
  def append([head | tail], value), do: [head | append(tail, value)]

  def pop_front([]), do: []
  def pop_front([_head | tail]), do: tail
  # Append rebuilds the prefix in O(n); pop_front shares the tail in O(1).
end`,
  tree: `defmodule BinaryTree do
  # A node is {value, left, right}; nil is an empty tree.
  def insert(nil, value), do: {value, nil, nil}
  def insert({key, left, right}, value) when value < key do
    {key, insert(left, value), right}
  end
  def insert({key, left, right}, value) do
    {key, left, insert(right, value)}
  end

  def inorder(tree), do: walk(tree, [])
  defp walk(nil, acc), do: acc
  defp walk({value, left, right}, acc) do
    walk(left, [value | walk(right, acc)])
  end
  # Accumulator avoids repeatedly concatenating lists; duplicates go right.
end`,
  hash: `defmodule HashTable do
  # Teaching multiset with 5 buckets; use Map/MapSet in production.
  def new, do: {[], [], [], [], []}
  defp bucket(key), do: Integer.mod(key, 5)

  def insert(table, key) do
    index = bucket(key)
    put_elem(table, index, [key | elem(table, index)])
  end

  def contains?(table, key), do: key in elem(table, bucket(key))
  # Return and retain the new table: the old tuple is unchanged.
end`,
};

const elixirLineMap: Record<AlgorithmId, Record<number, number>> = {
  bubble: { 1: 2, 5: 3, 8: 9, 9: 11, 13: 4 },
  selection: { 1: 3, 7: 5, 8: 8 },
  insertion: { 1: 2, 4: 2, 6: 5, 7: 9, 10: 6 },
  merge: { 1: 4, 5: 5, 14: 12, 15: 15 },
  quick: { 1: 3, 4: 5, 6: 6, 7: 6, 10: 8 },
  linear: { 1: 2, 4: 5, 5: 4 },
  binary: { 1: 4, 6: 8, 7: 10, 8: 11, 11: 6 },
  bfs: { 1: 3, 9: 8, 10: 11, 13: 18 },
  dfs: { 1: 2, 9: 5, 10: 6, 13: 14 },
  dijkstra: { 1: 4, 13: 12, 15: 15, 19: 20 },
  astar: { 1: 3, 15: 11, 17: 14, 21: 19 },
  stack: { 1: 7, 5: 8, 8: 9 },
  queue: { 1: 3, 5: 4, 8: 5 },
  linked: { 1: 3, 8: 4, 13: 7 },
  tree: { 1: 3, 5: 3, 6: 4, 12: 14 },
  hash: { 1: 3, 8: 8 },
};

export function elixirLineFor(id: AlgorithmId, cppLine: number) {
  return elixirLineMap[id][cppLine] ?? 1;
}
