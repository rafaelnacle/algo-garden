'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  ChevronRight,
  CircleHelp,
  GitFork,
  Layers3,
  Lightbulb,
  ListFilter,
  Pause,
  Play,
  RotateCcw,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  Terminal,
  Timer,
  Waypoints,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Visualization } from '@/components/lab/visualization';
import { CodePanel } from '@/components/lab/code-panel';
import { lessons } from '@/lib/algorithms/lessons';
import {
  createTrace,
  DEFAULT_VALUES,
  parseValues,
} from '@/lib/algorithms/engine';
import {
  graphNodes,
  type AlgorithmId,
  type Category,
  type Lesson,
} from '@/lib/algorithms/types';
import { useLabTools } from '@/lib/use-lab-tools';

const categories: {
  name: Category;
  icon: typeof ArrowDownUp;
  label: string;
}[] = [
  { name: 'Sorting', icon: ArrowDownUp, label: '01' },
  { name: 'Searching', icon: Search, label: '02' },
  { name: 'Graphs', icon: Waypoints, label: '03' },
  { name: 'Data structures', icon: Layers3, label: '04' },
];

export default function Home() {
  return (
    <SidebarProvider
      style={{ '--sidebar-width': '248px' } as React.CSSProperties}
    >
      <Lab />
    </SidebarProvider>
  );
}

function Lab() {
  const [selected, setSelected] = useState<AlgorithmId>('bubble');
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [draft, setDraft] = useState(DEFAULT_VALUES.join(', '));
  const [error, setError] = useState('');
  const [target, setTarget] = useState(31);
  const [source, setSource] = useState(0);
  const [goal, setGoal] = useState(5);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tab, setTab] = useState('intuition');
  const [answers, setAnswers] = useState<Partial<Record<AlgorithmId, number>>>(
    {},
  );
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<AlgorithmId[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const { setOpenMobile } = useSidebar();
  const lesson = lessons.find((l) => l.id === selected)!;
  const array = useMemo(
    () => (selected === 'binary' ? [...values].sort((a, b) => a - b) : values),
    [selected, values],
  );
  const steps = useMemo(
    () => createTrace(selected, array, target, source, goal),
    [selected, array, target, source, goal],
  );
  const step = steps[Math.min(index, steps.length - 1)];
  const finished = index === steps.length - 1;
  const isGraph = lesson.category === 'Graphs';
  const isSearch = lesson.category === 'Searching';
  const isStructure = lesson.category === 'Data structures';
  const lessonIndex = lessons.findIndex((l) => l.id === selected);

  useEffect(() => {
    const initialization = setTimeout(() => {
      try {
        const data: unknown = JSON.parse(
          localStorage.getItem('algo-atlas-progress') || '[]',
        );
        if (Array.isArray(data))
          setSaved(
            data.filter(
              (id): id is AlgorithmId =>
                typeof id === 'string' && lessons.some((l) => l.id === id),
            ),
          );
      } catch {
        /* A blocked or damaged local store must not prevent learning. */
      }
      setStorageReady(true);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        setSpeed(0.5);
    }, 0);
    return () => clearTimeout(initialization);
  }, []);
  useEffect(() => {
    if (storageReady) {
      try {
        localStorage.setItem('algo-atlas-progress', JSON.stringify(saved));
      } catch {
        /* Progress remains available for this session. */
      }
    }
  }, [saved, storageReady]);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (finished) setPlaying(false);
      else {
        setIndex((i) => Math.min(i + 1, steps.length - 1));
        if (index + 1 === steps.length - 1) setPlaying(false);
      }
    }, 1000 / speed);
    return () => clearTimeout(timer);
  }, [playing, finished, index, speed, steps.length]);
  const reset = useCallback(() => {
    setIndex(0);
    setPlaying(false);
  }, []);
  const selectLesson = useCallback(
    (id: AlgorithmId) => {
      setSelected(id);
      setIndex(0);
      setPlaying(false);
      setTab('intuition');
      setError('');
      setOpenMobile(false);
    },
    [setOpenMobile],
  );
  const togglePlay = useCallback(() => {
    if (finished) setIndex(0);
    setPlaying((p) => !p);
  }, [finished]);
  const navigateStep = useCallback(
    (delta: number) => {
      setPlaying(false);
      setIndex((i) => Math.max(0, Math.min(steps.length - 1, i + delta)));
    },
    [steps.length],
  );
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement;
      if (
        element.closest(
          'input, select, textarea, button, [role="slider"], [role="tab"], [contenteditable]',
        ) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      if (event.code === 'Space') {
        event.preventDefault();
        togglePlay();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateStep(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateStep(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, navigateStep]);
  const applyValues = useCallback((text: string) => {
    const parsed = parseValues(text);
    setValues(parsed);
    setDraft(parsed.join(', '));
    setError('');
    setIndex(0);
    setPlaying(false);
  }, []);
  useLabTools({
    selectLesson,
    applyValues,
    setIndex,
    setPlaying,
    steps,
    selected,
  });
  const shuffle = () => {
    const next = Array.from(
      { length: values.length },
      () => Math.floor(Math.random() * 90) + 10,
    );
    applyValues(next.join(', '));
  };
  const markLearned = () =>
    setSaved((current) =>
      current.includes(selected)
        ? current.filter((id) => id !== selected)
        : [...current, selected],
    );

  return (
    <>
      <a className="skip-link" href="#workspace">
        Skip to algorithm lab
      </a>
      <Sidebar className="atlas-sidebar">
        <SidebarHeader className="brand-header">
          <Link href="/" className="brand" aria-label="Algo Atlas home">
            <span className="brand-mark">
              <Braces size={23} strokeWidth={2.4} />
            </span>
            <span>
              algo<span className="brand-light">atlas</span>
              <small>C++ IN MOTION</small>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <div className="library-label">
            <span>THE ALGORITHM LIBRARY</span>
            <span>16</span>
          </div>
          <div className="nav-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Find an algorithm"
              placeholder="Find an algorithm…"
            />
          </div>
          <nav aria-label="Algorithm lessons">
            {categories.map(({ name, icon: Icon, label }) => {
              const matches = lessons.filter(
                (l) =>
                  l.category === name &&
                  `${l.name} ${l.category} ${l.id}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
              );
              return matches.length ? (
                <div className="nav-group" key={name}>
                  <div className="nav-category">
                    <Icon size={15} />
                    <span>{name}</span>
                    <span className="category-number">{label}</span>
                  </div>
                  <SidebarMenu>
                    {matches.map((l) => (
                      <SidebarMenuItem key={l.id}>
                        <SidebarMenuButton
                          className="lesson-link"
                          isActive={selected === l.id}
                          aria-current={selected === l.id ? 'page' : undefined}
                          onClick={() => selectLesson(l.id)}
                        >
                          <span className="nav-dot" />
                          <span>{l.name}</span>
                          {saved.includes(l.id) ? (
                            <Check className="learned-check" size={14} />
                          ) : selected === l.id ? (
                            <ChevronRight size={14} />
                          ) : null}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              ) : null;
            })}
            {!lessons.some((l) =>
              `${l.name} ${l.category} ${l.id}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            ) && (
              <p className="no-results">
                No matching lessons. Try “sort” or “graph”.
              </p>
            )}
          </nav>
        </SidebarContent>
        <SidebarFooter className="sidebar-bottom">
          <div>
            <Sparkles size={16} />
            <span>Built for the curious.</span>
          </div>
          <p>
            {saved.length} / 16 lessons marked learned{' '}
            <span title="Progress is saved only in this browser">· local</span>
          </p>
        </SidebarFooter>
      </Sidebar>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <SidebarTrigger className="mobile-toggle" />
            <span>Library</span>
            <ChevronRight size={13} />
            <span>{lesson.category}</span>
            <ChevronRight size={13} />
            <strong>{lesson.name}</strong>
          </div>
          <div className="topbar-right">
            <span className="status-dot" />
            Interactive learning lab <span className="version-badge">v1.0</span>
          </div>
        </header>
        <main id="workspace" className="workspace" tabIndex={-1}>
          <div className="lesson-heading">
            <div>
              <div className="eyebrow">
                <span>
                  EXPERIMENT {String(lessonIndex + 1).padStart(2, '0')}
                </span>
                <span className="eyebrow-line" />
                <span>{lesson.category.toUpperCase()}</span>
              </div>
              <h1>
                {lesson.name}
                <span className="title-dot">.</span>
              </h1>
              <p className="subtitle">{lesson.subtitle}</p>
            </div>
            <button
              className={`learn-button ${saved.includes(selected) ? 'is-learned' : ''}`}
              onClick={markLearned}
            >
              <Check size={16} />
              {saved.includes(selected) ? 'Learned' : 'Mark as learned'}
            </button>
          </div>
          <div className="lesson-meta">
            <span className="difficulty">
              <i />
              {lesson.difficulty}
            </span>
            <span>
              <Timer size={14} />
              Time <b>{lesson.time}</b>
            </span>
            <span>
              <Layers3 size={14} />
              Space <b>{lesson.space}</b>
            </span>
            <span className="meta-last">
              <Terminal size={14} />
              C++17
            </span>
          </div>
          <div className="lab-grid">
            <section
              className="visual-panel"
              aria-label="Algorithm visualization"
            >
              <div className="panel-heading">
                <span>
                  <Waypoints size={17} />
                  The playground
                </span>
                <span className={`trace-status ${finished ? 'complete' : ''}`}>
                  <i />
                  {finished
                    ? 'Complete'
                    : playing
                      ? 'Running'
                      : index
                        ? 'Paused'
                        : 'Ready to explore'}
                </span>
              </div>
              <div className="canvas">
                <div className="canvas-top">
                  <span>
                    {isGraph
                      ? 'UNDIRECTED GRAPH'
                      : isStructure
                        ? lesson.name.toUpperCase()
                        : 'ARRAY VISUALIZATION'}
                  </span>
                  <span>
                    {isGraph
                      ? '6 nodes · 9 edges'
                      : `${array.length} input values`}
                  </span>
                </div>
                <Visualization
                  lesson={lesson}
                  step={step}
                  source={source}
                  goal={goal}
                />
                <div className="legend">
                  <span>
                    <i className="legend-idle" />
                    Unprocessed
                  </span>
                  <span>
                    <i className="legend-active" />
                    Current
                  </span>
                  <span>
                    <i className="legend-settled" />
                    {isGraph
                      ? 'Visited / path'
                      : isStructure
                        ? 'Processed'
                        : 'Confirmed'}
                  </span>
                </div>
              </div>
              <div className="step-caption">
                <span className="step-icon">
                  <GitFork size={18} />
                </span>
                <div>
                  <span className="small-label">
                    STEP {String(index + 1).padStart(2, '0')}{' '}
                    <span>OF {steps.length}</span>
                  </span>
                  <p aria-live={playing ? 'off' : 'polite'}>{step.message}</p>
                </div>
              </div>
              <div className="playback">
                <div className="play-buttons">
                  <button
                    className="icon-button"
                    onClick={reset}
                    disabled={index === 0 && !playing}
                    aria-label="Reset visualization"
                    title="Reset"
                  >
                    <RotateCcw size={17} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => navigateStep(-1)}
                    disabled={index === 0}
                    aria-label="Previous step"
                    title="Previous step (←)"
                  >
                    <SkipBack size={17} />
                  </button>
                  <button
                    className="play-button"
                    onClick={togglePlay}
                    aria-label={
                      playing
                        ? 'Pause animation'
                        : finished
                          ? 'Replay animation'
                          : 'Play animation'
                    }
                  >
                    {playing ? (
                      <Pause size={17} fill="currentColor" />
                    ) : (
                      <Play size={17} fill="currentColor" />
                    )}
                    {playing ? 'Pause' : finished ? 'Replay' : 'Play'}
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => navigateStep(1)}
                    disabled={finished}
                    aria-label="Next step"
                    title="Next step (→)"
                  >
                    <SkipForward size={17} />
                  </button>
                </div>
                <div className="speed-control">
                  <label htmlFor="speed">Speed</label>
                  <NativeSelect
                    id="speed"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                  >
                    {[0.5, 1, 1.5, 2, 4].map((s) => (
                      <NativeSelectOption key={s} value={s}>
                        {s}×
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              </div>
              <div className="timeline">
                <Slider
                  aria-label="Animation step"
                  min={0}
                  max={steps.length - 1}
                  value={[index]}
                  step={1}
                  onValueChange={(value) => {
                    setPlaying(false);
                    setIndex(Array.isArray(value) ? value[0] : value);
                  }}
                />
                <span>
                  {index + 1} / {steps.length}
                </span>
              </div>
            </section>
            <CodePanel lesson={lesson} line={step.line} />
          </div>
          <section className="input-panel" aria-label="Experiment inputs">
            <div className="input-title">
              <ListFilter size={17} />
              <span>Make it yours</span>
            </div>
            {isGraph ? (
              <div className="graph-controls">
                <label htmlFor="start-node">Start</label>
                <NativeSelect
                  id="start-node"
                  value={source}
                  onChange={(e) => {
                    setSource(Number(e.target.value));
                    reset();
                  }}
                >
                  {graphNodes.map((n, i) => (
                    <NativeSelectOption value={i} key={i}>
                      {n.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <ArrowRight size={16} />
                <label htmlFor="goal-node">Goal</label>
                <NativeSelect
                  id="goal-node"
                  value={goal}
                  onChange={(e) => {
                    setGoal(Number(e.target.value));
                    reset();
                  }}
                >
                  {graphNodes.map((n, i) => (
                    <NativeSelectOption value={i} key={i}>
                      {n.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <span className="input-hint">
                  {['bfs', 'dfs'].includes(selected)
                    ? 'Weights ignored in this traversal.'
                    : 'Nonnegative edge costs.'}
                </span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  try {
                    applyValues(draft);
                  } catch (err) {
                    setError((err as Error).message);
                  }
                }}
                className="array-form"
              >
                <label className="sr-only" htmlFor="array-input">
                  Input values
                </label>
                <input
                  id="array-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby="input-feedback"
                  spellCheck={false}
                />
                <button type="submit" className="subtle-button">
                  Apply <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  className="subtle-button shuffle-button"
                  onClick={shuffle}
                >
                  <Shuffle size={15} />
                  Randomize
                </button>
                {isSearch && (
                  <label className="target-control">
                    Target
                    <input
                      aria-label="Search target"
                      type="number"
                      min={-99}
                      max={99}
                      value={target}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        if (
                          Number.isInteger(next) &&
                          next >= -99 &&
                          next <= 99
                        ) {
                          setTarget(next);
                          reset();
                        }
                      }}
                    />
                  </label>
                )}
              </form>
            )}
          </section>
          <div
            className="input-feedback"
            id="input-feedback"
            role={error ? 'alert' : undefined}
          >
            {error ||
              (selected === 'binary'
                ? 'Input is sorted automatically before searching.'
                : !isGraph
                  ? '1–12 integers from −99 to 99. Try duplicates or an already sorted array.'
                  : 'Choose any start and goal, including the same node.')}
          </div>
          <div className="insights-grid">
            <section className="insights">
              <Tabs
                value={tab}
                onValueChange={(value) => setTab(String(value))}
              >
                <TabsList variant="line" className="lesson-tabs">
                  <TabsTrigger value="intuition">
                    <Lightbulb size={16} />
                    The intuition
                  </TabsTrigger>
                  <TabsTrigger value="complexity">
                    <Timer size={16} />
                    Complexity
                  </TabsTrigger>
                  <TabsTrigger value="challenge">
                    <CircleHelp size={16} />
                    Test yourself
                    {answers[selected] === lesson.correct && (
                      <Check size={14} />
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="intuition">
                  <div className="intuition-content">
                    <h2>What’s happening here?</h2>
                    <p>{lesson.idea}</p>
                    <div className="tricky-note">
                      <span className="note-icon">
                        <Lightbulb size={19} />
                      </span>
                      <div>
                        <h3>The part that usually trips people up</h3>
                        <p>{lesson.tricky}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="complexity">
                  <div className="intuition-content">
                    <h2>How does it scale?</h2>
                    <p>{lesson.complexity}</p>
                    <div className="complexity-facts">
                      <div>
                        <span>TIME</span>
                        <strong>{lesson.time}</strong>
                      </div>
                      <div>
                        <span>SPACE</span>
                        <strong>{lesson.space}</strong>
                      </div>
                    </div>
                    <p className="notation-note">
                      n = input size · V = vertices · E = edges · h = tree
                      height · B = buckets. Bounds describe the C++
                      implementation; the visualization stores extra snapshots
                      for rewinding.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="challenge">
                  <Challenge
                    lesson={lesson}
                    answer={answers[selected]}
                    onAnswer={(answer) =>
                      setAnswers((a) => ({ ...a, [selected]: answer }))
                    }
                    onRetry={() =>
                      setAnswers((a) => ({ ...a, [selected]: undefined }))
                    }
                  />
                </TabsContent>
              </Tabs>
            </section>
            <aside className="field-notes">
              <div className="field-title">
                <span>FIELD NOTES</span>
                <ArrowDownUp size={16} />
              </div>
              <h3>Where it comes in handy</h3>
              <p>{lesson.use}</p>
              <div className="run-metrics">
                <div>
                  <strong>{step.comparisons}</strong>
                  <span>{isGraph ? 'Edges checked' : 'Comparisons'}</span>
                </div>
                <div>
                  <strong>{step.writes}</strong>
                  <span>
                    {isGraph
                      ? 'Discoveries / updates'
                      : isStructure
                        ? 'Stored values'
                        : 'Array writes'}
                  </span>
                </div>
              </div>
            </aside>
          </div>
          <footer className="lesson-footer">
            <span>
              <kbd>space</kbd> play / pause <kbd>←</kbd>
              <kbd>→</kbd> step through
            </span>
            <div>
              <button
                className="icon-button"
                aria-label="Previous lesson"
                disabled={lessonIndex === 0}
                onClick={() => selectLesson(lessons[lessonIndex - 1].id)}
              >
                <ArrowLeft size={17} />
              </button>
              <button
                className="next-lesson"
                disabled={lessonIndex === lessons.length - 1}
                onClick={() => selectLesson(lessons[lessonIndex + 1].id)}
              >
                {lessonIndex === lessons.length - 1
                  ? 'End of the atlas'
                  : `Next: ${lessons[lessonIndex + 1].name}`}
                <ArrowRight size={16} />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

function Challenge({
  lesson,
  answer,
  onAnswer,
  onRetry,
}: {
  lesson: Lesson;
  answer?: number;
  onAnswer: (value: number) => void;
  onRetry: () => void;
}) {
  return (
    <div className="challenge">
      <span className="small-label">A QUICK MENTAL CHECK</span>
      <h2>{lesson.question}</h2>
      <div className="answer-options">
        {lesson.answers.map((text, i) => (
          <button
            key={text}
            onClick={() => onAnswer(i)}
            disabled={answer !== undefined}
            className={`answer-option ${answer !== undefined && i === lesson.correct ? 'answer-correct' : answer === i ? 'answer-incorrect' : ''}`}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {text}
            {answer !== undefined && i === lesson.correct && (
              <Check size={17} />
            )}
          </button>
        ))}
      </div>
      {answer !== undefined && (
        <div className="answer-feedback" aria-live="polite">
          <strong>
            {answer === lesson.correct
              ? 'Exactly right.'
              : 'Not quite — here’s why.'}
          </strong>
          <p>{lesson.explanation}</p>
          <button className="subtle-button" onClick={onRetry}>
            Try again <RotateCcw size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
