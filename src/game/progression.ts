import type { GameSession, PlayerProgress, WordEntry } from './types';
import { addDays, dateKey } from './dates';
import { finalXp, isFirstTry, type XpBreakdown } from './scoring';
import { roundAccuracy } from './engine';
import { RECENT_LIMIT } from './selection';

/* ---------- Levels ---------- */

/** XP needed to go from `level` to `level + 1`. */
export const xpToNext = (level: number) => 100 + (level - 1) * 60;

export interface LevelInfo {
  level: number;
  intoLevel: number;
  needed: number;
  progress: number;
  title: string;
}

const TITLES = ['Script Kiddie', 'Junior Dev', 'Code Monkey', 'Bug Hunter', 'Stack Tracer', 'Senior Dev', 'Tech Lead', 'Architect', 'Principal', '10x Engineer', 'Kernel Wizard'];

export function levelFromXp(xp: number): LevelInfo {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpToNext(level)) {
    remaining -= xpToNext(level);
    level++;
  }
  const needed = xpToNext(level);
  return {
    level,
    intoLevel: remaining,
    needed,
    progress: remaining / needed,
    title: TITLES[Math.min(TITLES.length - 1, Math.floor((level - 1) / 2))],
  };
}

/* ---------- Achievements ---------- */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: 'Swords' | 'Bug' | 'Moon' | 'BookOpen' | 'Sparkles' | 'Flame' | 'Target' | 'CalendarCheck' | 'Trophy';
  check: (p: PlayerProgress) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-blood', name: 'First Blood', description: 'Make your first correct guess.', icon: 'Swords', check: (p) => p.gamesWon >= 1 },
  { id: 'perfect-run', name: 'Perfect Run', description: 'Guess a word without using any hints.', icon: 'Sparkles', check: (p) => p.perfectRuns >= 1 },
  { id: 'sharpshooter', name: 'Sharpshooter', description: 'Guess the word on your first attempt.', icon: 'Target', check: (p) => p.firstTryWins >= 1 },
  { id: 'night-owl', name: 'Night Owl', description: 'Complete a hard challenge.', icon: 'Moon', check: (p) => p.hardWins >= 1 },
  { id: 'daily-driver', name: 'Daily Driver', description: 'Complete your first daily challenge.', icon: 'CalendarCheck', check: (p) => Object.values(p.daily.history).some((r) => r.won) },
  { id: 'on-fire', name: 'On Fire', description: 'Reach a 3-day daily streak.', icon: 'Flame', check: (p) => p.daily.bestStreak >= 3 },
  { id: 'debugger', name: 'Debugger', description: 'Discover 10 words.', icon: 'Bug', check: (p) => p.discovered.length >= 10 },
  { id: 'centurion', name: 'Centurion', description: 'Earn 1,000 XP in total.', icon: 'Trophy', check: (p) => p.totalXp >= 1000 },
  { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Discover 50 words.', icon: 'BookOpen', check: (p) => p.discovered.length >= 50 },
];

/* ---------- Progress ---------- */

export function emptyProgress(): PlayerProgress {
  return {
    version: 1,
    totalXp: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    totalGuesses: 0,
    usefulGuesses: 0,
    hardWins: 0,
    perfectRuns: 0,
    firstTryWins: 0,
    discovered: [],
    achievements: {},
    daily: { streak: 0, bestStreak: 0, lastWonDate: null, history: {} },
    unlimited: { played: 0, won: 0, recent: [] },
    preferredDifficulty: 'medium',
    topics: null,
  };
}

/** Streak to display today: it is only alive if the last win was today or yesterday. */
export function liveStreak(p: PlayerProgress, today: string = dateKey()): number {
  const last = p.daily.lastWonDate;
  if (!last) return 0;
  if (last === today || last === addDays(today, -1)) return p.daily.streak;
  return 0;
}

export function accuracy(p: PlayerProgress): number {
  return p.gamesPlayed ? Math.round((p.gamesWon / p.gamesPlayed) * 100) : 0;
}

export interface ResultEffects {
  progress: PlayerProgress;
  xp: XpBreakdown;
  levelBefore: number;
  levelAfter: number;
  unlocked: Achievement[];
}

/** Apply a finished session to the player's progress. Pure. */
export function applyResult(prev: PlayerProgress, session: GameSession, word: WordEntry): ResultEffects {
  const won = session.status === 'won';
  const p: PlayerProgress = structuredClone(prev);

  // Daily streak
  if (session.mode === 'daily' && session.date) {
    const date = session.date;
    if (won) {
      if (p.daily.lastWonDate === addDays(date, -1)) p.daily.streak += 1;
      else if (p.daily.lastWonDate !== date) p.daily.streak = 1;
      p.daily.lastWonDate = date;
      p.daily.bestStreak = Math.max(p.daily.bestStreak, p.daily.streak);
    } else {
      p.daily.streak = 0;
    }
  }

  const xp = finalXp(session, word, session.mode === 'daily' ? p.daily.streak : 0);
  const levelBefore = levelFromXp(prev.totalXp).level;

  p.totalXp += xp.total;
  p.gamesPlayed += 1;
  p.totalGuesses += session.guesses.length;
  p.usefulGuesses += session.guesses.filter((g) => g.result !== 'miss').length;

  if (won) {
    p.gamesWon += 1;
    if (session.difficulty === 'hard') p.hardWins += 1;
    if (session.hintsUsed === 0) p.perfectRuns += 1;
    if (isFirstTry(session)) p.firstTryWins += 1;
    if (!p.discovered.some((d) => d.id === word.id)) {
      p.discovered.push({ id: word.id, at: Date.now(), mode: session.mode, difficulty: session.difficulty });
    }
  }

  if (session.mode === 'daily' && session.date) {
    p.daily.history[session.date] = {
      date: session.date,
      wordId: word.id,
      won,
      difficulty: session.difficulty,
      attempts: session.guesses.length,
      hintsUsed: session.hintsUsed,
      xp: xp.total,
      accuracy: roundAccuracy(session),
    };
  } else {
    p.unlimited.played += 1;
    if (won) p.unlimited.won += 1;
    p.unlimited.recent = [word.id, ...p.unlimited.recent.filter((id) => id !== word.id)].slice(0, RECENT_LIMIT);
  }

  const unlocked: Achievement[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!p.achievements[a.id] && a.check(p)) {
      p.achievements[a.id] = Date.now();
      unlocked.push(a);
    }
  }

  return { progress: p, xp, levelBefore, levelAfter: levelFromXp(p.totalXp).level, unlocked };
}
