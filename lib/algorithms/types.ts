export type Category = 'Sorting' | 'Searching' | 'Graphs' | 'Data structures';
export type ProgrammingLanguage = 'c' | 'cpp' | 'go' | 'python';
export type AlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'linear'
  | 'binary'
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'
  | 'stack'
  | 'queue'
  | 'linked'
  | 'tree'
  | 'hash';
export interface Lesson {
  id: AlgorithmId;
  name: string;
  category: Category;
  subtitle: string;
  time: string;
  space: string;
  difficulty: 'Foundation' | 'Intermediate';
  idea: string;
  tricky: string;
  use: string;
  complexity: string;
  code: string;
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}
export interface TraceStep {
  values: number[];
  active: number[];
  settled: number[];
  message: string;
  line: number;
  comparisons: number;
  writes: number;
  frontier?: number[];
  distances?: number[];
  path?: number[];
  edges?: [number, number][];
  labels?: string[];
}
export interface GraphNode {
  name: string;
  x: number;
  y: number;
}
export const graphNodes: GraphNode[] = [
  { name: 'A', x: 65, y: 170 },
  { name: 'B', x: 205, y: 65 },
  { name: 'C', x: 205, y: 275 },
  { name: 'D', x: 365, y: 105 },
  { name: 'E', x: 365, y: 260 },
  { name: 'F', x: 520, y: 170 },
];
// Integer edge costs dominate Euclidean distance / 200: A*'s heuristic is consistent.
export const graphEdges: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 2],
  [1, 2, 2],
  [1, 3, 5],
  [2, 3, 3],
  [2, 4, 6],
  [3, 4, 1],
  [3, 5, 5],
  [4, 5, 2],
];
