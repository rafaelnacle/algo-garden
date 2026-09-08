'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, Copy, FileCode2 } from 'lucide-react';
import { pythonCode, pythonLineFor } from '@/lib/algorithms/python-code';
import type { Lesson, ProgrammingLanguage } from '@/lib/algorithms/types';

function highlight(line: string) {
  const tokens = line.split(
    /(\/\/.*$|#include|#.*$|"[^"]*"|'[^']*'|\b(?:void|int|bool|const|auto|if|else|for|while|return|break|continue|class|public|using|double|long|true|false|nullptr|struct|def|from|import|in|is|not|and|or|None|True|False)\b|\b\d+(?:\.\d+)?\b)/g,
  );
  return tokens.map((token, i) => (
    <span
      key={i}
      className={
        token.startsWith('//') ||
        (token.startsWith('#') && token !== '#include')
          ? 'syntax-comment'
          : token.startsWith('"') || token.startsWith("'")
            ? 'syntax-string'
            : /^(void|int|bool|const|auto|if|else|for|while|return|break|continue|class|public|using|double|long|true|false|nullptr|struct|def|from|import|in|is|not|and|or|None|True|False|#include)$/.test(
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
  const source = language === 'cpp' ? lesson.code : pythonCode[lesson.id];
  const activeLine = language === 'cpp' ? line : pythonLineFor(lesson.id, line);
  const languageName = language === 'cpp' ? 'C++17' : 'Python 3';
  const extension = language === 'cpp' ? 'cpp' : 'py';
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
