# AlgoGarden

AlgoGarden is an interactive algorithms learning website built with React and TypeScript. It combines animated diagrams, step-by-step explanations, synchronized C++17, C11, Elixir, Go, Python 3, and Rust examples, and short practice questions.

## Lessons

| Category        | Lessons                                                   |
| --------------- | --------------------------------------------------------- |
| Sorting         | Bubble, Selection, Insertion, Merge, Quick Sort           |
| Searching       | Linear Search, Binary Search                              |
| Graphs          | Breadth-first Search, Depth-first Search, Dijkstra, A*    |
| Data structures | Stack, Queue, Linked List, Binary Search Tree, Hash Table |

Each lesson includes:

- An interactive visualization with playback, step navigation, speed control, and a timeline.
- Equivalent C++17, C11, Elixir, Go, Python 3, and Rust implementations with the current operation highlighted.
- Explanations of the main idea, complexity, common pitfalls, and practical uses.
- A multiple-choice knowledge check.

Array lessons accept custom or randomized inputs. Graph lessons support selecting start and goal nodes on a fixed weighted graph. Learned lessons are saved in the browser with `localStorage`.

Select Elixir from the Code menu for functional examples using immutable collections. Highlights link equivalent operations; recursion and memory costs can differ from the animation. Copy a module into an `.exs` file, add calls to its public functions, and run it with `elixir example.exs`.

## Run locally

Requirements:

- Node.js 22.13.0 or later and npm.
- Optional: `g++` with C++17 support for the C++ example checks.
- Optional: `gcc` with C11 support for the C example checks.
- Optional: Elixir with Erlang/OTP for the Elixir example checks.
- Optional: Go for the Go example checks.
- Optional: Python 3 for the Python example checks.
- Optional: `rustc` and `rustfmt` for the Rust example checks.

Install dependencies and start the Vite development server:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Commands

| Command               | Purpose                             |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Start the Vite development server   |
| `npm run build`       | Build the static GitHub Pages site  |
| `npm run preview`     | Preview the production build        |
| `npm run typecheck`   | Check TypeScript                    |
| `npm run lint`        | Check code with Oxlint              |
| `npm test`            | Run algorithm and curriculum tests  |
| `npm run test:cpp`    | Compile and run all C++17 examples  |
| `npm run test:c`      | Compile and run all C11 examples    |
| `npm run test:elixir` | Compile and run all Elixir examples |
| `npm run test:go`     | Format and run all Go examples      |
| `npm run test:python` | Run all Python 3 examples           |
| `npm run test:rust`   | Format and run all Rust examples    |
| `npm run format`      | Format project files with Oxfmt     |

## Technology

AlgoGarden uses React 19, TypeScript, Vite, Tailwind CSS, Base UI/shadcn primitives, and Lucide icons. It is a fully static application with no backend, database, account, or API key requirement.

## GitHub Pages

The deployment workflow is manual. Configure GitHub Pages to use GitHub Actions, then run **Deploy GitHub Pages** from the repository's Actions tab. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for local preview and publishing details.
