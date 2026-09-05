import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lessons } from '../lib/algorithms/lessons.ts';

const checks: Record<string, string> = {
  bubble: 'std::vector<int> a={4,-2,0,4,1}; bubbleSort(a); assert(std::is_sorted(a.begin(),a.end())); a.clear(); bubbleSort(a);',
  selection: 'std::vector<int> a={4,-2,0,4,1}; selectionSort(a); assert(std::is_sorted(a.begin(),a.end())); a.clear(); selectionSort(a);',
  insertion: 'std::vector<int> a={4,-2,0,4,1}; insertionSort(a); assert(std::is_sorted(a.begin(),a.end())); a.clear(); insertionSort(a);',
  merge: 'std::vector<int> a={4,-2,0,4,1}; mergeSort(a,0,int(a.size())); assert(std::is_sorted(a.begin(),a.end())); a.clear(); mergeSort(a,0,0);',
  quick: 'std::vector<int> a={4,-2,0,4,1}; quickSort(a,0,int(a.size())-1); assert(std::is_sorted(a.begin(),a.end())); a.clear(); quickSort(a,0,-1);',
  linear: 'assert(linearSearch({1,2,3},1)==0); assert(linearSearch({},2)==-1); assert(linearSearch({1,2,3},4)==-1);',
  binary: 'assert(binarySearch({1,2,3},1)==0); assert(binarySearch({},2)==-1); assert(binarySearch({1,2,3},4)==-1);',
  bfs: 'std::vector<std::vector<int>> g={{1,2},{0,3},{0,3},{1,2}}; auto p=bfs(g,0,3); assert(p[3]==1); assert(p[1]==0);',
  dfs: 'std::vector<std::vector<int>> g={{1,2},{0,3},{0,3},{1,2}}; auto p=dfs(g,0,3); assert(p[3]==1);',
  dijkstra: 'std::vector<std::vector<Edge>> g={{{1,8},{2,2}},{{0,8},{2,1}},{{0,2},{1,1}}}; auto d=dijkstra(g,0,1); assert(d[1]==3);',
  astar: 'std::vector<std::vector<Edge>> g={{{1,8},{2,2}},{{0,8},{2,1}},{{0,2},{1,1}}}; assert(astar(g,0,1,{0,0,0})==3);',
  stack: 'auto s=stackDemo({10,20,30}); assert(s.top()==20); assert(s.size()==2); assert(stackDemo({}).empty());',
  queue: 'auto q=queueDemo({10,20,30}); assert(q.front()==20); assert(q.size()==2); assert(queueDemo({}).empty());',
  linked: 'std::unique_ptr<Node> h; append(h,10); append(h,20); popFront(h); assert(h->value==20); popFront(h); popFront(h); assert(!h);',
  tree: 'std::unique_ptr<Node> r; for(int v:{3,1,4,3,2}) insert(r,v); std::vector<int> out; inorder(r,out); assert((out==std::vector<int>{1,2,3,3,4}));',
  hash: 'HashTable h; for(int v:{-4,1,6}) h.insert(v); assert(h.contains(-4)); assert(h.contains(6)); assert(!h.contains(11));',
};
const directory = mkdtempSync(join(tmpdir(), 'algo-atlas-cpp-'));
try {
  for (const lesson of lessons) {
    const source = join(directory, `${lesson.id}.cpp`), executable = join(directory, lesson.id);
    // The snippet itself is compiled separately first: no hidden includes can rescue it.
    writeFileSync(source, lesson.code);
    execFileSync('g++', ['-std=c++17', '-Wall', '-Wextra', '-Werror', '-c', source, '-o', `${executable}.o`], { stdio: 'pipe' });
    writeFileSync(source, `${lesson.code}\n#include <cassert>\n#include <algorithm>\nint main() { ${checks[lesson.id]} }\n`);
    execFileSync('g++', ['-std=c++17', '-Wall', '-Wextra', '-Werror', source, '-o', executable], { stdio: 'pipe' });
    execFileSync(executable, [], { stdio: 'pipe' });
    console.log(`PASS ${lesson.name}: standalone C++17 compilation and behavior`);
  }
} finally { rmSync(directory, { recursive: true, force: true }); }
