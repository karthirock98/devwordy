import { useMemo, useState } from 'react';
import { Lock, RotateCcw } from 'lucide-react';
import type { Category, Difficulty, WordEntry } from '../game/types';
import { ACHIEVEMENTS, accuracy, xpToNext } from '../game/progression';
import { WORDS, getWord } from '../data/words';
import { usePlayer } from '../hooks/PlayerContext';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import AchievementIcon from '../components/AchievementIcon';
import ConceptModal from '../components/ConceptModal';
import { StreakCard } from '../components/ProgressPanel';
import TopicsCard from '../components/TopicsCard';
import styles from './ProfilePage.module.scss';

export default function ProfilePage() {
  const { progress, level, resetProgress } = usePlayer();
  const [modalWord, setModalWord] = useState<WordEntry | null>(null);
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [confirmReset, setConfirmReset] = useState(false);
  const xp = useAnimatedNumber(progress.totalXp, 1000);

  const discovered = useMemo(() => new Set(progress.discovered.map((d) => d.id)), [progress.discovered]);
  const categories = useMemo(() => Array.from(new Set(WORDS.map((w) => w.category))).sort(), []);
  const shown = WORDS.filter((w) => filter === 'all' || w.category === filter).sort(
    (a, b) => Number(discovered.has(b.id)) - Number(discovered.has(a.id)) || a.word.localeCompare(b.word),
  );

  const LEVELS: { id: Difficulty; label: string }[] = [
    { id: 'easy', label: 'basic' },
    { id: 'medium', label: 'mid-level' },
    { id: 'hard', label: 'advanced' },
  ];
  const byLevel = useMemo(() => {
    const solved: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
    const total: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
    WORDS.forEach((w) => total[w.difficulty]++);
    discovered.forEach((id) => {
      const w = getWord(id);
      if (w) solved[w.difficulty]++;
    });
    return { solved, total };
  }, [discovered]);

  const stats = [
    { label: 'games played', value: progress.gamesPlayed },
    { label: 'words solved', value: progress.gamesWon },
    { label: 'accuracy', value: `${accuracy(progress)}%` },
    { label: 'hard wins', value: progress.hardWins },
    { label: 'no-hint wins', value: progress.perfectRuns },
    { label: 'first-try wins', value: progress.firstTryWins },
    { label: 'unlimited rounds', value: progress.unlimited.played },
    { label: 'dailies done', value: Object.keys(progress.daily.history).length },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.avatar}>
          <span>LV</span>
          <strong>{level.level}</strong>
        </div>
        <div className={styles.heroBody}>
          <span className="label">operator profile</span>
          <h1>{level.title}</h1>
          <div className={styles.levelBar}>
            <span style={{ transform: `scaleX(${level.progress})` }} />
          </div>
          <span className={styles.levelText}>
            {xp.toLocaleString()} XP total · {level.needed - level.intoLevel} XP to level {level.level + 1} · next after that needs {xpToNext(level.level + 1)}
          </span>
        </div>
      </section>

      <div className={styles.grid}>
        <section className={styles.card}>
          <span className="label">stats</span>
          <div className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <span className="label">solved by level</span>
          <div className={styles.levels}>
            {LEVELS.map((l) => (
              <div key={l.id} className={`${styles.level} ${styles[l.id]}`}>
                <span className={styles.levelName}>{l.label}</span>
                <span className={styles.levelTrack}>
                  <span style={{ transform: `scaleX(${byLevel.solved[l.id] / Math.max(1, byLevel.total[l.id])})` }} />
                </span>
                <span className={styles.levelCount}>
                  {byLevel.solved[l.id]}/{byLevel.total[l.id]}
                </span>
              </div>
            ))}
          </div>
        </section>
        <StreakCard />
      </div>

      <TopicsCard />

      <section className={styles.card}>
        <span className="label">
          achievements · {Object.keys(progress.achievements).length}/{ACHIEVEMENTS.length}
        </span>
        <div className={styles.achievements}>
          {ACHIEVEMENTS.map((a) => {
            const at = progress.achievements[a.id];
            return (
              <div key={a.id} className={`${styles.achievement} ${at ? styles.unlocked : ''}`}>
                <span className={styles.achIcon}>{at ? <AchievementIcon icon={a.icon} size={20} /> : <Lock size={16} />}</span>
                <span className={styles.achBody}>
                  <strong>{a.name}</strong>
                  <span>{a.description}</span>
                  {at && <small>unlocked {new Date(at).toLocaleDateString()}</small>}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.codexHead}>
          <span className="label">
            codex · {discovered.size}/{WORDS.length} discovered
          </span>
          <select className={styles.select} value={filter} onChange={(e) => setFilter(e.target.value as Category | 'all')} aria-label="Filter by category">
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.codex}>
          {shown.map((w) => {
            const known = discovered.has(w.id);
            return known ? (
              <button key={w.id} className={`${styles.entry} ${styles.known}`} onClick={() => setModalWord(w)}>
                <strong>{w.word}</strong>
                <span>{w.category}</span>
              </button>
            ) : (
              <div key={w.id} className={styles.entry} title="Solve this word in a game to unlock its entry">
                <strong className={styles.hidden}>{'█'.repeat(Math.min(10, w.word.length))}</strong>
                <span>{w.category}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.danger}>
        <div>
          <strong>Reset progress</strong>
          <span>Deletes XP, streaks, achievements and discovered words saved in this browser.</span>
        </div>
        <button className="btn danger" onClick={() => (confirmReset ? resetProgress() : setConfirmReset(true))} onBlur={() => setConfirmReset(false)}>
          <RotateCcw size={14} />
          {confirmReset ? 'Click again to confirm' : 'Reset'}
        </button>
      </section>

      {modalWord && <ConceptModal word={modalWord} onClose={() => setModalWord(null)} />}
    </div>
  );
}
