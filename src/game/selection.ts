import { WORDS } from '../data/words';
import type { Category, WordEntry } from './types';
import { dayNumber } from './dates';

/** Small deterministic PRNG so every player gets the same sequence. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const DAILY_SEED = 0xdef0c;

/** One fixed, seeded order of the whole bank (sorted first so file order does not matter). */
const DAILY_ORDER = seededShuffle(
  [...WORDS].sort((a, b) => a.id.localeCompare(b.id)),
  DAILY_SEED,
);

/** Words in the chosen topics; null or empty means every topic. */
export function wordPool(topics: Category[] | null, source: WordEntry[] = WORDS): WordEntry[] {
  if (!topics || topics.length === 0) return source;
  const set = new Set(topics);
  const pool = source.filter((w) => set.has(w.category));
  return pool.length ? pool : source;
}

/**
 * Deterministic daily word: walks the fixed order (filtered to the player's topics)
 * one word per calendar day. Everyone with the same topics gets the same word on the
 * same date, and no word repeats until that whole pool has been used.
 */
export function dailyWord(date: string, topics: Category[] | null = null): WordEntry {
  const order = wordPool(topics, DAILY_ORDER);
  return order[dayNumber(date) % order.length];
}

/** Random word for unlimited mode from the chosen topics, avoiding recently played ones. */
export function randomWord(recent: string[], exclude?: string, topics: Category[] | null = null): WordEntry {
  const source = wordPool(topics);
  const blocked = new Set(recent);
  if (exclude) blocked.add(exclude);
  let pool = source.filter((w) => !blocked.has(w.id));
  if (pool.length === 0) pool = source.filter((w) => w.id !== exclude);
  if (pool.length === 0) pool = source;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const RECENT_LIMIT = Math.min(20, Math.floor(WORDS.length / 2));
