'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, Copy, FileCode2 } from 'lucide-react';
import { cCode, cLineFor } from '@/lib/algorithms/c-code';
import { goCode, goLineFor } from '@/lib/algorithms/go-code';
import { pythonCode, pythonLineFor } from '@/lib/algorithms/python-code';
import { rustCode, rustLineFor } from '@/lib/algorithms/rust-code';
import type { Lesson, ProgrammingLanguage } from '@/lib/algorithms/types';

function highlight(line: string) {
  const tokens = line.split(
    /(\/\/.*$|\/\*.*?\*\/|#(?:include|define)|#.*$|"[^"]*"|'[^']*'|\b(?:void|int|bool|const|auto|if|else|for|while|return|break|continue|class|public|using|double|long|true|false|nullptr|struct|static|typedef|sizeof|def|from|import|in|is|not|and|or|None|True|False|NULL|package|func|var|type|range|map|make|append|len|nil|float64|uint|fn|let|mut|impl|self|Self|pub|enum|match|Some|usize|i32|f64|Vec|Box|Option)\b|\b\d+(?:\.\d+)?\b)/g,
  );
  return tokens.map((token, i) => (
    <span
      key={i}
      className={
        token.startsWith('//') || token.startsWith('/*')
          ? 'syntax-comment'
          : token.startsWith('"') || token.startsWith("'")
            ? 'syntax-string'
            : /^(void|int|bool|const|auto|if|else|for|while|return|break|continue|class|public|using|double|long|true|false|nullptr|struct|static|typedef|sizeof|def|from|import|in|is|not|and|or|None|True|False|NULL|package|func|var|type|range|map|make|append|len|nil|float64|uint|fn|let|mut|impl|self|Self|pub|enum|match|Some|usize|i32|f64|Vec|Box|Option|#include|#define)$/.test(
                  token,
                )
              ? 'syntax-keyword'
              : /^\d+(?:\.\d+)?$/.test(token)
                ? 'syntax-number'
                : undefined
      }
    >
      {token}
    </span>
  ));
}

export function CodePanel({
  lesson,
  line,
  language,
}: {
  lesson: Lesson;
  line: number;
  language: ProgrammingLanguage;
}) {
  const [status, setStatus] = useState('');
  const highlighted = useRef<HTMLDivElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const languageConfig: Record<
    ProgrammingLanguage,
    { source: string; activeLine: number; name: string; extension: string }
  > = {
    cpp: {
      source: lesson.code,
      activeLine: line,
      name: 'C++17',
      extension: 'cpp',
    },
    c: {
      source: cCode[lesson.id],
      activeLine: cLineFor(lesson.id, line),
      name: 'C11',
      extension: 'c',
    },
    go: {
      source: goCode[lesson.id],
      activeLine: goLineFor(lesson.id, line),
      name: 'Go',
      extension: 'go',
    },
    python: {
      source: pythonCode[lesson.id],
      activeLine: pythonLineFor(lesson.id, line),
      name: 'Python 3',
      extension: 'py',
    },
    rust: {
      source: rustCode[lesson.id],
      activeLine: rustLineFor(lesson.id, line),
      name: 'Rust',
      extension: 'rs',
    },
  };
  const {
    source,
    activeLine,
    name: languageName,
    extension,
  } = languageConfig[language];
  useEffect(() => {
    const row = highlighted.current,
      area = scrollArea.current;
    if (!row || !area) return;
    const top = row.offsetTop - area.offsetTop;
    if (
      top < area.scrollTop ||
      top + row.offsetHeight > area.scrollTop + area.clientHeight
    )
      area.scrollTop = Math.max(0, top - area.clientHeight / 2);
  }, [activeLine, language, lesson.id]);
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(''), 2400);
    return () => clearTimeout(timer);
  }, [status]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setStatus('Copied');
    } catch {
      setStatus('Select code to copy');
    }
  };
  return (
    <section
      className="code-panel"
      aria-label={`${languageName} implementation`}
    >
      <div className="panel-heading">
        <span>
          <FileCode2 size={16} />
          Implementation
        </span>
        <span className="language-label">{languageName}</span>
      </div>
      <div className="file-tab">
        <span>
          <i />
          {lesson.id === 'astar' ? 'a_star' : lesson.id}_demo.{extension}
        </span>
        <button
          className="icon-button"
          onClick={copy}
          aria-label={`Copy ${languageName} code`}
          title={`Copy ${languageName} code`}
        >
          {status === 'Copied' ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      <div className="code-scroll" ref={scrollArea}>
        <pre>
          <code>
            {source.split('\n').map((text, i) => (
              <div
                key={i}
                ref={i + 1 === activeLine ? highlighted : undefined}
                className={`code-line ${i + 1 === activeLine ? 'current-line' : ''}`}
              >
                <span className="line-number" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{highlight(text) || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
      <div className="code-footer">
        <span>
          <i />
          Linked to the current step
        </span>
        <output>{status || 'Read • trace • understand'}</output>
      </div>
    </section>
  );
}
