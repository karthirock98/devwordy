import type { Difficulty, GameSession, WordEntry } from './types';

export const BASE_XP: Record<Difficulty, number> = { easy: 50, medium: 100, hard: 175 };
/** Fraction of the round's max XP each hint removes (1st … 5th). */
export const HINT_COST = [0.1, 0.15, 0.2, 0.2, 0.25] as const;
/** Hints 1–3 are text clues; hints 4–5 each uncover one hidden letter. */
export const TEXT_HINTS = 3;
export const TOTAL_HINTS = HINT_COST.length;
export const WRONG_PENALTY = 0.08;
export const FIRST_TRY_BONUS = 0.5;
export const MIN_WIN_FRACTION = 0.1;
export const DAILY_BONUS = 25;
export const STREAK_BONUS_PER_DAY = 5;
export const STREAK_BONUS_CAP = 50;

/** Max XP for a round: the level picks both the word set and the reward. */
export function roundMax(_word: WordEntry, difficulty: Difficulty): number {
  return BASE_XP[difficulty];
}

export function hintCostXp(word: WordEntry, difficulty: Difficulty, hintIndex: number): number {
  return Math.round(roundMax(word, difficulty) * (HINT_COST[hintIndex] ?? 0));
}

export function wrongCount(session: GameSession): number {
  return session.guesses.filter((g) => g.result === 'miss' || g.result === 'partial').length;
}

/** XP the player would get if they won right now (before first-try and daily bonuses). */
export function potentialXp(session: GameSession, word: WordEntry): number {
  const max = roundMax(word, session.difficulty);
  const hintFrac = HINT_COST.slice(0, session.hintsUsed).reduce((a, b) => a + b, 0);
  const frac = 1 - hintFrac - wrongCount(session) * WRONG_PENALTY;
  return Math.max(Math.round(max * MIN_WIN_FRACTION), Math.round(max * frac));
}

export interface XpBreakdown {
  base: number;
  firstTry: number;
  daily: number;
  streak: number;
  total: number;
}

export function finalXp(session: GameSession, word: WordEntry, streakAfter: number): XpBreakdown {
  if (session.status !== 'won') return { base: 0, firstTry: 0, daily: 0, streak: 0, total: 0 };
  const base = potentialXp(session, word);
  const firstTry = isFirstTry(session) ? Math.round(roundMax(word, session.difficulty) * FIRST_TRY_BONUS) : 0;
  const daily = session.mode === 'daily' ? DAILY_BONUS : 0;
  const streak = session.mode === 'daily' ? Math.min(STREAK_BONUS_CAP, streakAfter * STREAK_BONUS_PER_DAY) : 0;
  return { base, firstTry, daily, streak, total: base + firstTry + daily + streak };
}

/** Solved with the very first guess, without letter-reveal hints (text hints are fine). */
export function isFirstTry(session: GameSession): boolean {
  return session.guesses.length === 1 && session.hintsUsed <= TEXT_HINTS;
}
