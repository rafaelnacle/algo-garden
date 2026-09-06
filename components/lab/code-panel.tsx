'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, Copy, FileCode2 } from 'lucide-react';
import type { Lesson } from '@/lib/algorithms/types';

function highlight(line: string) {
  const tokens = line.split(
    /(\/\/.*$|"[^"]*"|\b(?:void|int|bool|const|auto|if|else|for|while|return|break|continue|class|public|using|double|long|true|false|nullptr|struct)\b|\b\d+\b|#include)/g,
  );
  return tokens.map((token, i) => (
    <span
      key={i}
      className={
        token.startsWith('//')
          ? 'syntax-comment'
          : token.startsWith('"')
            ? 'syntax-string'
            : /^(void|int|bool|const|auto|if|else|for|while|return|break|continue|class|public|using|double|long|true|false|nullptr|struct|#include)$/.test(
                  token,
                )
              ? 'syntax-keyword'
              : /^\d+$/.test(token)
                ? 'syntax-number'
                : undefined
      }
    >
      {token}
    </span>
  ));
}

export function CodePanel({ lesson, line }: { lesson: Lesson; line: number }) {
  const [status, setStatus] = useState('');
  const highlighted = useRef<HTMLDivElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
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
  }, [line, lesson.id]);
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(''), 2400);
    return () => clearTimeout(timer);
  }, [status]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lesson.code);
      setStatus('Copied');
    } catch {
      setStatus('Select code to copy');
    }
  };
  return (
    <section className="code-panel" aria-label="C++ implementation">
      <div className="panel-heading">
        <span>
          <FileCode2 size={16} />
          Implementation
        </span>
        <span className="language-label">C++17</span>
      </div>
      <div className="file-tab">
        <span>
          <i />
          {lesson.id === 'astar' ? 'a_star' : lesson.id}_demo.cpp
        </span>
        <button
          className="icon-button"
          onClick={copy}
          aria-label="Copy C++ code"
          title="Copy C++ code"
        >
          {status === 'Copied' ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      <div className="code-scroll" ref={scrollArea}>
        <pre>
          <code>
            {lesson.code.split('\n').map((text, i) => (
              <div
                key={i}
                ref={i + 1 === line ? highlighted : undefined}
                className={`code-line ${i + 1 === line ? 'current-line' : ''}`}
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
