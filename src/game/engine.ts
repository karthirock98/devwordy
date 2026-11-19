import type { Difficulty, GameMode, GameSession, Guess, WordEntry } from './types';

export const MAX_ATTEMPTS: Record<Difficulty, number> = { easy: 6, medium: 7, hard: 8 };

export interface Tile {
  index: number;
  char: string;
  isGap: boolean;
}

/** Keep only letters and digits, upper-cased. */
export function normalize(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function tilesFor(word: WordEntry): Tile[] {
  return word.word
    .toUpperCase()
    .split('')
    .map((char, index) => ({ index, char, isGap: !/[A-Z0-9]/.test(char) }));
}

export function letterTiles(word: WordEntry): Tile[] {
  return tilesFor(word).filter((t) => !t.isGap);
}

export function createSession(mode: GameMode, word: WordEntry, difficulty: Difficulty, date?: string): GameSession {
  return {
    id: `${mode}-${word.id}-${Date.now().toString(36)}`,
    mode,
    wordId: word.id,
    difficulty,
    date,
    guesses: [],
    revealed: [],
    hintsUsed: 0,
    status: 'playing',
    xpEarned: 0,
    startedAt: Date.now(),
  };
}

export function attemptsLeft(session: GameSession): number {
  return MAX_ATTEMPTS[session.difficulty] - session.guesses.length;
}

export function isLocked(session: GameSession): boolean {
  return session.guesses.length > 0 || session.hintsUsed > 0 || session.status !== 'playing';
}

export type GuessOutcome =
  | { type: 'invalid'; message: string }
  | { type: 'repeat'; message: string }
  | { type: 'length'; message: string }
  | { type: 'hit' | 'miss' | 'partial' | 'correct' | 'lost'; message: string; session: GameSession; guess: Guess };

/**
 * Pure guess evaluation. Single characters probe for a letter; anything longer is a
 * full-word guess. Wrong full-word guesses of the right length reveal letters that
 * are in the correct position.
 */
export function evaluateGuess(session: GameSession, word: WordEntry, raw: string): GuessOutcome {
  if (session.status !== 'playing') return { type: 'invalid', message: 'This round is over.' };

  const value = normalize(raw);
  const answer = normalize(word.word);
  const letters = letterTiles(word);

  if (!value) return { type: 'invalid', message: 'Type a letter or a full word.' };

  const already = session.guesses.some((g) => g.value === value);
  if (already) {
    return {
      type: 'repeat',
      message: value.length === 1 ? `You already probed "${value}". No attempt used.` : `You already tried ${value}. No attempt used.`,
    };
  }

  let guess: Guess;

  if (value.length === 1) {
    const matches = letters.filter((t) => t.char === value).map((t) => t.index);
    const fresh = matches.filter((i) => !session.revealed.includes(i));
    guess = { value, kind: 'letter', result: matches.length ? 'hit' : 'miss', revealed: fresh };
  } else {
    if (value.length !== answer.length) {
      return {
        type: 'length',
        message: `Length mismatch: the signal has ${answer.length} characters, you sent ${value.length}. No attempt used.`,
      };
    }
    if (value === answer) {
      guess = { value, kind: 'word', result: 'correct', revealed: letters.map((t) => t.index) };
    } else {
      const positional = letters
        .filter((t, i) => value[i] === t.char && !session.revealed.includes(t.index))
        .map((t) => t.index);
      guess = { value, kind: 'word', result: positional.length ? 'partial' : 'miss', revealed: positional };
    }
  }

  const revealed = Array.from(new Set([...session.revealed, ...guess.revealed])).sort((a, b) => a - b);
  const allRevealed = letters.every((t) => revealed.includes(t.index));
  if (allRevealed && guess.result === 'hit') guess = { ...guess, result: 'correct' };

  const guesses = [...session.guesses, guess];
  const won = guess.result === 'correct';
  const lost = !won && guesses.length >= MAX_ATTEMPTS[session.difficulty];

  const next: GameSession = {
    ...session,
    guesses,
    revealed: won || lost ? letters.map((t) => t.index) : revealed,
    status: won ? 'won' : lost ? 'lost' : 'playing',
    finishedAt: won || lost ? Date.now() : undefined,
  };

  if (won) return { type: 'correct', message: 'Signal decrypted!', session: next, guess };
  if (lost) return { type: 'lost', message: 'Out of attempts. Connection lost.', session: next, guess };

  const count = guess.revealed.length;
  switch (guess.result) {
    case 'hit':
      return { type: 'hit', message: `"${value}" found: ${count} position${count === 1 ? '' : 's'} decrypted.`, session: next, guess };
    case 'partial':
      return { type: 'partial', message: `Wrong word, but ${count} letter${count === 1 ? ' is' : 's are'} in the right place.`, session: next, guess };
    default:
      return {
        type: 'miss',
        message: guess.kind === 'letter' ? `"${value}" is not in this word.` : `${value} is not it.`,
        session: next,
        guess,
      };
  }
}

/** Round accuracy: share of guesses that gave useful information or the win. */
export function roundAccuracy(session: GameSession): number {
  if (!session.guesses.length) return 0;
  const useful = session.guesses.filter((g) => g.result !== 'miss').length;
  return Math.round((useful / session.guesses.length) * 100);
}
