import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category, Difficulty, GameMode, GameSession, WordEntry } from '../game/types';
import { createSession, evaluateGuess, isLocked, letterTiles, type GuessOutcome } from '../game/engine';
import { dailyWord, randomWord, wordPool } from '../game/selection';
import { TEXT_HINTS, TOTAL_HINTS } from '../game/scoring';
import { loadSession, saveSession } from '../game/storage';
import { getWord } from '../data/words';
import { usePlayer } from './PlayerContext';

export interface Feedback {
  type: GuessOutcome['type'] | 'hint';
  message: string;
  key: number;
}

function initialSession(mode: GameMode, today: string, recent: string[], difficulty: Difficulty, topics: Category[] | null): GameSession {
  const stored = loadSession(mode);
  if (mode === 'daily') {
    if (stored && stored.date === today) return stored;
    return createSession('daily', dailyWord(today, topics), difficulty, today);
  }
  if (stored) return stored;
  return createSession('unlimited', randomWord(recent, undefined, topics), difficulty);
}

/** Letter tiles that are still hidden. */
export function hiddenLetters(session: GameSession, word: WordEntry) {
  return letterTiles(word).filter((t) => !session.revealed.includes(t.index));
}

/** Whether the next hint can be used right now. */
export function canUseHint(session: GameSession, word: WordEntry): boolean {
  if (session.status !== 'playing' || session.hintsUsed >= TOTAL_HINTS) return false;
  // Letter hints may never give away the final hidden letter.
  if (session.hintsUsed >= TEXT_HINTS) return hiddenLetters(session, word).length > 1;
  return true;
}

/** All game-session state and actions for one mode. UI components stay presentational. */
export function useGame(mode: GameMode) {
  const { progress, today, recordResult, setPreferredDifficulty } = usePlayer();
  const topics = progress.topics;
  const [session, setSessionState] = useState<GameSession>(() =>
    initialSession(mode, today, progress.unlimited.recent, progress.preferredDifficulty, topics),
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const ref = useRef(session);
  const feedbackKey = useRef(0);

  const setSession = useCallback(
    (s: GameSession) => {
      ref.current = s;
      setSessionState(s);
      saveSession(mode, s);
    },
    [mode],
  );

  // New calendar day → new daily word.
  useEffect(() => {
    if (mode === 'daily' && ref.current.date !== today) {
      setSession(createSession('daily', dailyWord(today, topics), ref.current.difficulty, today));
      setFeedback(null);
    }
  }, [mode, today, topics, setSession]);

  // Topics changed → swap the word if the round has not really started yet.
  const topicsKey = topics ? [...topics].sort().join('|') : '*';
  useEffect(() => {
    const current = ref.current;
    if (isLocked(current)) return;
    if (mode === 'daily') {
      const next = dailyWord(today, topics);
      if (next.id !== current.wordId) setSession(createSession('daily', next, current.difficulty, today));
    } else if (!wordPool(topics).some((w) => w.id === current.wordId)) {
      setSession(createSession('unlimited', randomWord(progress.unlimited.recent, current.wordId, topics), current.difficulty));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsKey]);

  const word = getWord(session.wordId) as WordEntry;
  const dailyRecord = mode === 'daily' ? progress.daily.history[today] : undefined;

  const say = (type: Feedback['type'], message: string) => setFeedback({ type, message, key: ++feedbackKey.current });

  const guess = useCallback(
    (raw: string): GuessOutcome => {
      const current = ref.current;
      const w = getWord(current.wordId) as WordEntry;
      const outcome = evaluateGuess(current, w, raw);
      if ('session' in outcome) {
        let next = outcome.session;
        if (next.status !== 'playing') {
          const effects = recordResult(next, w);
          next = { ...next, xpEarned: effects.xp.total, xp: effects.xp };
        }
        setSession(next);
      }
      say(outcome.type, outcome.message);
      return outcome;
    },
    [recordResult, setSession],
  );

  const changeDifficulty = useCallback(
    (d: Difficulty) => {
      const current = ref.current;
      if (isLocked(current) || current.difficulty === d) return;
      setPreferredDifficulty(d);
      setSession({ ...current, difficulty: d });
      setFeedback(null);
    },
    [setPreferredDifficulty, setSession],
  );

  /** Hints 1–3 reveal text; hints 4–5 uncover one random hidden letter. */
  const revealHint = useCallback(() => {
    const current = ref.current;
    const w = getWord(current.wordId) as WordEntry;
    if (!canUseHint(current, w)) return;
    if (current.hintsUsed < TEXT_HINTS) {
      setSession({ ...current, hintsUsed: current.hintsUsed + 1 });
      return;
    }
    const hidden = hiddenLetters(current, w);
    const pick = hidden[Math.floor(Math.random() * hidden.length)];
    setSession({
      ...current,
      hintsUsed: current.hintsUsed + 1,
      revealed: [...current.revealed, pick.index].sort((a, b) => a - b),
      hintLetters: [...(current.hintLetters ?? []), pick.index],
    });
    say('hint', `Hint decrypted letter "${pick.char}".`);
  }, [setSession]);

  /** Give up the current round: counts as a loss and reveals the answer. */
  const forfeit = useCallback(() => {
    const current = ref.current;
    if (current.status !== 'playing') return;
    const w = getWord(current.wordId) as WordEntry;
    const lost: GameSession = {
      ...current,
      status: 'lost',
      revealed: w.word.split('').map((_, i) => i),
      finishedAt: Date.now(),
    };
    const effects = recordResult(lost, w);
    setSession({ ...lost, xpEarned: effects.xp.total, xp: effects.xp });
    say('lost', 'Round abandoned. Here is what you were looking for.');
  }, [recordResult, setSession]);

  const nextRound = useCallback(() => {
    if (mode !== 'unlimited') return;
    const current = ref.current;
    setSession(createSession('unlimited', randomWord(progress.unlimited.recent, current.wordId, topics), current.difficulty));
    setFeedback(null);
  }, [mode, progress.unlimited.recent, topics, setSession]);

  return {
    session,
    word,
    feedback,
    dailyRecord,
    locked: isLocked(session),
    canHint: canUseHint(session, word),
    guess,
    changeDifficulty,
    revealHint,
    nextRound,
    forfeit,
    clearFeedback: () => setFeedback(null),
  };
}
