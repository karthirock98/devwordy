import { useMemo, useState } from 'react';
import { Lock, RotateCcw } from 'lucide-react';
import type { Category, WordEntry } from '../game/types';
import { ACHIEVEMENTS, accuracy, xpToNext } from '../game/progression';
import { WORDS } from '../data/words';
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
