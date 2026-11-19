export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'daily' | 'unlimited';

export type Category =
  | 'Programming Concepts'
  | 'JavaScript'
  | 'TypeScript'
  | 'React'
  | 'Angular'
  | 'Backend Development'
  | 'Databases'
  | 'Networking'
  | 'Operating Systems'
  | 'DevOps'
  | 'Cloud Computing'
  | 'Cybersecurity'
  | 'Artificial Intelligence'
  | 'Computer Science'
  | 'Software Architecture'
  | 'Git & Version Control'
  | 'Node.js'
  | 'Java'
  | 'C#'
  | 'Python'
  | 'Programming Languages';

export interface WordEntry {
  id: string;
  word: string;
  category: Category;
  /** How advanced the concept itself is (affects bonus XP). */
  difficulty: Difficulty;
  /** Free "intel" line shown next to the category. Must not contain the word. */
  fact: string;
  definition: string;
  explanation: string;
  example: string;
  code?: { language: string; snippet: string };
  hints: [string, string, string];
}

export type GuessResult = 'hit' | 'miss' | 'partial' | 'correct';

export interface Guess {
  value: string;
  kind: 'letter' | 'word';
  result: GuessResult;
  /** Tile indices newly revealed by this guess. */
  revealed: number[];
}

export type SessionStatus = 'playing' | 'won' | 'lost';

export interface GameSession {
  id: string;
  mode: GameMode;
  wordId: string;
  difficulty: Difficulty;
  /** Daily mode only: the YYYY-MM-DD key this session belongs to. */
  date?: string;
  guesses: Guess[];
  /** Indices of tiles whose letters are no longer fogged. */
  revealed: number[];
  hintsUsed: number;
  /** Tile indices revealed by letter hints (hints 4 and 5). */
  hintLetters?: number[];
  status: SessionStatus;
  xpEarned: number;
  xp?: { base: number; firstTry: number; daily: number; streak: number; total: number };
  startedAt: number;
  finishedAt?: number;
}

export interface DailyRecord {
  date: string;
  wordId: string;
  won: boolean;
  difficulty: Difficulty;
  attempts: number;
  hintsUsed: number;
  xp: number;
  accuracy: number;
}

export interface DiscoveredWord {
  id: string;
  at: number;
  mode: GameMode;
  difficulty: Difficulty;
}

export interface PlayerProgress {
  version: 1;
  totalXp: number;
  gamesPlayed: number;
  gamesWon: number;
  totalGuesses: number;
  usefulGuesses: number;
  hardWins: number;
  perfectRuns: number;
  firstTryWins: number;
  discovered: DiscoveredWord[];
  achievements: Record<string, number>;
  daily: {
    streak: number;
    bestStreak: number;
    lastWonDate: string | null;
    history: Record<string, DailyRecord>;
  };
  unlimited: {
    played: number;
    won: number;
    recent: string[];
  };
  preferredDifficulty: Difficulty;
  /** Topics the player chose; null until they pick (shows the topic picker). */
  topics: Category[] | null;
  /** True when the player chose "Anything goes", so topics added to the app later are included automatically. */
  topicsAll?: boolean;
}
