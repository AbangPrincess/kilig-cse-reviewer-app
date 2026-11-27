import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppState } from './types';

/** Saved under the app's original name on purpose: renaming it would wipe everyone's progress. */
const KEY = 'kilig-cse:v1';

export function initialState(): AppState {
  return {
    version: 1,
    profile: { onboarded: false, examDate: null, dailyGoal: 20 },
    topics: {},
    answers: [],
    days: {},
    mistakes: [],
    mocks: [],
    diagnostic: null,
    exam: null,
    plan: null,
    speedBest: 0,
    seen: {},
  };
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (parsed.version !== 1) return initialState();
    return { ...initialState(), ...parsed, profile: { ...initialState().profile, ...parsed.profile } };
  } catch {
    return initialState();
  }
}

export function exportState(s: AppState): string {
  return JSON.stringify({ app: 'kilig-cse', exportedAt: new Date().toISOString(), state: s });
}

export function parseBackup(text: string): AppState | null {
  try {
    const data = JSON.parse(text);
    const s = data?.state ?? data;
    if (!s || s.version !== 1 || typeof s.profile !== 'object') return null;
    return { ...initialState(), ...s };
  } catch {
    return null;
  }
}

interface StoreValue {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  saveError: boolean;
}

const StoreCtx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);
  const [saveError, setSaveError] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);
  const value = useMemo(() => ({ state, update, saveError }), [state, update, saveError]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const v = useContext(StoreCtx);
  if (!v) throw new Error('useStore outside provider');
  return v;
}
