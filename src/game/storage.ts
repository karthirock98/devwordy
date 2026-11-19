import type { Category, GameMode, GameSession, PlayerProgress } from './types';
import { emptyProgress } from './progression';
import { getWord } from '../data/words';
import { ALL_CATEGORIES } from '../data/topics';

/** Saved topics, dropping any that no longer exist; "everything" always means every current topic. */
function loadTopics(stored: PlayerProgress): Category[] | null {
  if (stored.topicsAll) return [...ALL_CATEGORIES];
  if (!Array.isArray(stored.topics)) return null;
  const valid = stored.topics.filter((t) => ALL_CATEGORIES.includes(t));
  return valid.length ? valid : null;
}

const KEYS = {
  progress: 'devwordy.progress.v1',
  session: (mode: GameMode) => `devwordy.session.${mode}.v1`,
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode, quota) — the game still works in memory */
  }
}

export function loadProgress(): PlayerProgress {
  const stored = read<PlayerProgress>(KEYS.progress);
  if (!stored || stored.version !== 1) return emptyProgress();
  // Merge with defaults so new fields added later never crash older saves.
  const base = emptyProgress();
  return {
    ...base,
    ...stored,
    daily: { ...base.daily, ...stored.daily },
    unlimited: { ...base.unlimited, ...stored.unlimited },
    discovered: stored.discovered.filter((d) => getWord(d.id)),
    topics: loadTopics(stored),
  };
}

export const saveProgress = (p: PlayerProgress) => write(KEYS.progress, p);

export function loadSession(mode: GameMode): GameSession | null {
  const s = read<GameSession>(KEYS.session(mode));
  if (!s || s.mode !== mode || !getWord(s.wordId)) return null;
  return s;
}

export const saveSession = (mode: GameMode, s: GameSession | null) => write(KEYS.session(mode), s);

export function resetAll() {
  write(KEYS.progress, null);
  write(KEYS.session('daily'), null);
  write(KEYS.session('unlimited'), null);
}
