import type { Category } from '../game/types';
import { WORDS } from './words';

export interface TopicGroup {
  name: string;
  categories: Category[];
}

/** How topics are grouped in the picker. Every category must appear exactly once. */
export const TOPIC_GROUPS: TopicGroup[] = [
  { name: 'Frontend', categories: ['JavaScript', 'TypeScript', 'React', 'Angular'] },
  { name: 'Backend', categories: ['Node.js', 'Backend Development', 'Databases'] },
  { name: 'Languages', categories: ['Programming Languages', 'Java', 'C#', 'Python'] },
  { name: 'Infrastructure', categories: ['DevOps', 'Cloud Computing', 'Networking', 'Operating Systems'] },
  { name: 'Fundamentals', categories: ['Programming Concepts', 'Computer Science', 'Software Architecture', 'Git & Version Control'] },
  { name: 'Security & AI', categories: ['Cybersecurity', 'Artificial Intelligence'] },
];

export const ALL_CATEGORIES: Category[] = TOPIC_GROUPS.flatMap((g) => g.categories);

/** Minimum words a selection must contain so unlimited mode has variety. */
export const MIN_POOL = 5;

export function wordCount(categories: Category[]): number {
  const set = new Set(categories);
  return WORDS.filter((w) => set.has(w.category)).length;
}

export const countByCategory: Record<string, number> = WORDS.reduce<Record<string, number>>((acc, w) => {
  acc[w.category] = (acc[w.category] ?? 0) + 1;
  return acc;
}, {});

export function isEverything(topics: Category[] | null): boolean {
  return !topics || ALL_CATEGORIES.every((c) => topics.includes(c));
}

export function topicsLabel(topics: Category[] | null): string {
  if (isEverything(topics)) return 'Everything';
  const list = topics as Category[];
  return list.length <= 2 ? list.join(', ') : `${list.slice(0, 2).join(', ')} +${list.length - 2}`;
}
