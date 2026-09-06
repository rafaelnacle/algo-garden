'use client';
import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { lessons } from './algorithms/lessons';
import type { AlgorithmId, TraceStep } from './algorithms/types';

interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean };
  execute: (input: unknown) => unknown;
}
interface ModelContext {
  registerTool: (
    tool: Tool,
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
}
interface LabActions {
  selectLesson: (id: AlgorithmId) => void;
  applyValues: (values: string) => void;
  setIndex: (index: number) => void;
  setPlaying: (playing: boolean) => void;
  steps: TraceStep[];
  selected: AlgorithmId;
}

/** Optional browser integration. The normal UI works without modelContext. */
export function useLabTools(actions: LabActions) {
  const current = useRef(actions);
  useEffect(() => {
    current.current = actions;
  });
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Tool) => {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {
        /* Optional integration unavailable. */
      }
    };
    register({
      name: 'configure_algorithm_lab',
      description:
        'Select an algorithm and optionally apply array input. Resets the visible trace to its first step.',
      inputSchema: {
        type: 'object',
        properties: {
          algorithm: { type: 'string', enum: lessons.map((l) => l.id) },
          values: {
            type: 'string',
            description: '1–12 comma-separated integers between -99 and 99.',
          },
        },
        required: ['algorithm'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute(input) {
        const data = input as { algorithm?: unknown; values?: unknown } | null;
        const lesson = lessons.find((l) => l.id === data?.algorithm);
        if (
          !lesson ||
          (data?.values !== undefined && typeof data.values !== 'string')
        )
          throw new Error(
            'Provide a valid algorithm and an optional values string.',
          );
        // Validation in applyValues occurs before any mutation, including lesson selection.
        flushSync(() => {
          if (typeof data?.values === 'string')
            current.current.applyValues(data.values);
          current.current.selectLesson(lesson.id);
        });
        return { algorithm: lesson.id, step: 1 };
      },
    });
    register({
      name: 'seek_algorithm_step',
      description:
        'Pause playback and seek to a one-based step in the current algorithm trace.',
      inputSchema: {
        type: 'object',
        properties: { step: { type: 'integer', minimum: 1 } },
        required: ['step'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute(input) {
        const step = (input as { step?: unknown } | null)?.step;
        if (
          typeof step !== 'number' ||
          !Number.isInteger(step) ||
          step < 1 ||
          step > current.current.steps.length
        )
          throw new Error(
            `Step must be between 1 and ${current.current.steps.length}.`,
          );
        const frame = current.current.steps[step - 1];
        flushSync(() => {
          current.current.setPlaying(false);
          current.current.setIndex(step - 1);
        });
        return {
          algorithm: current.current.selected,
          step,
          message: frame.message,
          values: frame.values,
        };
      },
    });
    return () => lifecycle.abort();
  }, []);
}
