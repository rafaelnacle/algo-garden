# Algo Atlas

An interactive C++ learning website built with React and TypeScript. Explore algorithms through animated diagrams, step-by-step explanations, C++17 examples, and short practice questions.

This began as a personal project built with Codex to experiment with AI-assisted development and learn more C++. It is a learning tool with 16 foundational lessons, rather than an exhaustive algorithms reference.

## What you can explore

| Category        | Lessons                                                   |
| --------------- | --------------------------------------------------------- |
| Sorting         | Bubble, Selection, Insertion, Merge, Quick Sort           |
| Searching       | Linear Search, Binary Search                              |
| Graphs          | Breadth-first Search, Depth-first Search, Dijkstra, A*    |
| Data structures | Stack, Queue, Linked List, Binary Search Tree, Hash Table |

Each lesson includes:

- A visualization with play, pause, reset, previous/next step, speed control, and a draggable timeline.
- A C++17 implementation with relevant source lines highlighted as the trace advances.
- An explanation of the idea, common confusing details, complexity, and practical uses.
- A multiple-choice question with feedback and a retry option.

Array lessons accept custom inputs and randomized examples. Graph lessons let you choose start and goal nodes on a fixed, undirected weighted graph. Structure lessons demonstrate insertion followed by removal or traversal, as appropriate.

## Run locally

Requirements:

- **Node.js 22.13.0 or later** and npm. Node.js 24 is used for development.
- **g++ with C++17 support** only if you want to run the C++ example checks.

From the project directory:

```bash
npm ci
npm run dev
```

Open the local URL printed by the server, usually **http://localhost:3000**. Stop the server with `Ctrl+C`.

No API keys, environment variables, external accounts, or database setup are required for the learning features.

## Using the lab

1. Choose a lesson in the sidebar, or search for its name or category.
2. For array and structure lessons, enter 1–12 integers between −99 and 99, then select **Apply**. **Randomize** generates another input of the same length.
3. For searching, set the target. Binary Search automatically sorts the input before its trace begins.
4. For graph lessons, choose **Start** and **Goal**. BFS and DFS ignore edge weights; Dijkstra and A* use them.
5. Play the trace or advance one step at a time. Read the step explanation alongside the highlighted C++ code.
6. Explore **The intuition**, **Complexity**, and **Test yourself** below the visualization.
7. Use **Mark as learned** to keep track of lessons. Select it again to unmark a lesson.

Keyboard shortcuts work when focus is outside an input or interactive control:

| Key     | Action        |
| ------- | ------------- |
| `Space` | Play / pause  |
| `←`     | Previous step |
| `→`     | Next step     |

Lesson progress is stored only in this browser's `localStorage`. It is not synced between devices. If browser storage is unavailable, progress remains available for the current session. Quiz answers are session-only.

## Development commands

| Command             | Purpose                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| `npm run dev`       | Start the development server with hot reload                              |
| `npm run build`     | Create the production build in `dist/`                                    |
| `npm start`         | Serve the built application locally through Wrangler; run the build first |
| `npm run typecheck` | Check TypeScript without emitting files                                   |
| `npm run lint`      | Check application code with Oxlint                                        |
| `npm test`          | Run algorithm and lesson regression tests                                 |
| `npm run test:cpp`  | Compile all 16 C++ examples and run behavior assertions                   |
| `npm run format`    | Format project files with Oxfmt                                           |

The TypeScript tests cover sorting edge cases, duplicates, negative values, search misses, graph paths for all start/goal pairs, A* heuristic consistency, structure operations, input validation, and code highlights. The C++ checks compile each example independently with `-std=c++17 -Wall -Wextra -Werror`, then compile and execute a small test program. Temporary compiler files are cleaned up after the checks.

Lint excludes the scaffold's vendored `components/ui` files and its `use-mobile` hook; TypeScript still checks them. Browser interaction and visual regression tests are not yet included.

## Project structure

```text
app/
  page.tsx                  Lab UI, inputs, playback, quiz, and progress state
  layout.tsx                Document layout and metadata
  globals.css               Theme, layout, and responsive styles
components/
  lab/
    visualization.tsx       Array, graph, tree, and structure diagrams
    code-panel.tsx          C++ display, highlights, and clipboard control
  ui/                       Scaffolded accessible UI primitives
lib/
  algorithms/
    types.ts                Shared models and sample graph
    engine.ts               Algorithm execution and immutable trace snapshots
    lessons.ts              Lesson explanations, complexity, and questions
    code.ts                 Standalone C++17 source examples
  use-lab-tools.ts           Optional WebMCP browser integration
  utils.ts                  Shared UI utilities
tests/
  algorithms.test.ts        Trace and curriculum regression tests
  check-cpp.ts              C++ compilation and behavior checks
```

The frontend uses **React 19**, **TypeScript**, **Vinext/Vite**, **Tailwind CSS**, **Base UI/shadcn**, and **Lucide** icons. The scaffold includes Sites and Cloudflare tooling; running the lab locally does not publish it.

Algorithm traces run in TypeScript in the browser. The displayed C++ is educational source code, not a browser compiler or executable editor. Trace snapshots use additional memory so playback can rewind; the displayed complexity bounds describe the C++ implementation, not the renderer.

## Current scope and limitations

- Graph topology and edge weights are fixed. A* uses a consistent heuristic: Euclidean diagram distance divided by 200.
- The binary search tree is intentionally unbalanced, with duplicates inserted to the right.
- The hash table uses five fixed buckets with separate chaining and does not resize. Constant expected lookup requires a bounded load factor; this demo does not maintain one as it grows.
- Negative array values use striped bars whose heights represent absolute magnitude; the labels retain their signs.
- C++ examples are functions/types without a `main()`. Add a driver to run a copied example; the C++ test script demonstrates this.
- Optional WebMCP tools are feature-detected. Unsupported browsers use the normal interface. The integration has not yet been verified in a WebMCP-enabled browser.

To add a lesson, extend `AlgorithmId`, add the lesson and C++ source, implement its trace and any new diagram, then add algorithm tests and a C++ behavior check.

## Privacy

The learning features do not require private data or credentials. Keep credentials out of source code, public assets, screenshots, and commits. `.gitignore` excludes environment files, common credential files, dependencies, build output, and machine-local agent state; it is still important to review staged changes.
