import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Category, Difficulty, GameSession, PlayerProgress, WordEntry } from '../game/types';
import { applyResult, levelFromXp, liveStreak, type Achievement, type LevelInfo, type ResultEffects } from '../game/progression';
import { loadProgress, resetAll, saveProgress } from '../game/storage';
import { useToday } from './useToday';
import { ALL_CATEGORIES } from '../data/topics';

export type FxEvent =
  | { id: number; kind: 'achievement'; achievement: Achievement }
  | { id: number; kind: 'level'; level: number; title: string };

interface PlayerContextValue {
  progress: PlayerProgress;
  level: LevelInfo;
  streak: number;
  today: string;
  events: FxEvent[];
  recordResult: (session: GameSession, word: WordEntry) => ResultEffects;
  setPreferredDifficulty: (d: Difficulty) => void;
  setTopics: (topics: Category[]) => void;
  dismissEvent: (id: number) => void;
  resetProgress: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

let eventId = 1;

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);
  const [events, setEvents] = useState<FxEvent[]>([]);
  const ref = useRef(progress);
  const today = useToday();

  useEffect(() => saveProgress(progress), [progress]);

  const commit = useCallback((next: PlayerProgress) => {
    ref.current = next;
    setProgress(next);
  }, []);

  const recordResult = useCallback(
    (session: GameSession, word: WordEntry) => {
      const effects = applyResult(ref.current, session, word);
      commit(effects.progress);
      const fx: FxEvent[] = effects.unlocked.map((achievement) => ({ id: eventId++, kind: 'achievement', achievement }));
      if (effects.levelAfter > effects.levelBefore) {
        const info = levelFromXp(effects.progress.totalXp);
        fx.unshift({ id: eventId++, kind: 'level', level: info.level, title: info.title });
      }
      if (fx.length) {
        // Let the reveal animation play before celebrating.
        window.setTimeout(() => setEvents((e) => [...e, ...fx]), 1400);
      }
      return effects;
    },
    [commit],
  );

  const setPreferredDifficulty = useCallback(
    (d: Difficulty) => {
      if (ref.current.preferredDifficulty !== d) commit({ ...ref.current, preferredDifficulty: d });
    },
    [commit],
  );

  const setTopics = useCallback(
    (topics: Category[]) => {
      if (!topics.length) return;
      const all = ALL_CATEGORIES.every((c) => topics.includes(c));
      commit({ ...ref.current, topics: [...topics], topicsAll: all });
    },
    [commit],
  );

  const dismissEvent = useCallback((id: number) => setEvents((e) => e.filter((x) => x.id !== id)), []);

  const resetProgress = useCallback(() => {
    resetAll();
    window.location.reload();
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({
      progress,
      level: levelFromXp(progress.totalXp),
      streak: liveStreak(progress, today),
      today,
      events,
      recordResult,
      setPreferredDifficulty,
      setTopics,
      dismissEvent,
      resetProgress,
    }),
    [progress, today, events, recordResult, setPreferredDifficulty, setTopics, dismissEvent, resetProgress],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return ctx;
}
