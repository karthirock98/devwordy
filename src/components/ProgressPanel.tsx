import { Link } from 'react-router-dom';
import { ChevronRight, Flame } from 'lucide-react';
import type { PlayerProgress, WordEntry } from '../game/types';
import { ACHIEVEMENTS, accuracy } from '../game/progression';
import { addDays, prettyDate } from '../game/dates';
import { WORDS, getWord } from '../data/words';
import { usePlayer } from '../hooks/PlayerContext';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import AchievementIcon from './AchievementIcon';
import styles from './ProgressPanel.module.scss';

export function StreakCard() {
  const { progress, streak, today } = usePlayer();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  return (
    <div className={styles.card}>
      <span className="label">daily streak</span>
      <div className={styles.streakRow}>
        <span className={`${styles.flame} ${streak > 0 ? styles.lit : ''}`}>
          <Flame size={26} />
        </span>
        <span className={styles.streakNum}>{streak}</span>
        <span className={styles.streakUnit}>
          day{streak === 1 ? '' : 's'}
          <small>best {progress.daily.bestStreak}</small>
        </span>
      </div>
      <div className={styles.week}>
        {days.map((d) => {
          const r = progress.daily.history[d];
          return (
            <span
              key={d}
              className={`${styles.day} ${r?.won ? styles.dayWon : r ? styles.dayLost : ''} ${d === today ? styles.dayToday : ''}`}
              title={`${prettyDate(d)}${r ? (r.won ? ' · solved' : ' · missed') : ''}`}
            >
              {new Date(d + 'T00:00').toLocaleDateString(undefined, { weekday: 'narrow' })}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const v = useAnimatedNumber(value);
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>
        {v.toLocaleString()}
        {suffix && <small>{suffix}</small>}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export function StatsGrid({ progress }: { progress: PlayerProgress }) {
  return (
    <div className={styles.card}>
      <span className="label">progress</span>
      <div className={styles.stats}>
        <Stat label="total xp" value={progress.totalXp} />
        <Stat label="discovered" value={progress.discovered.length} suffix={`/${WORDS.length}`} />
        <Stat label="games" value={progress.gamesPlayed} />
        <Stat label="accuracy" value={accuracy(progress)} suffix="%" />
      </div>
    </div>
  );
}

export function RecentWords({ onOpen }: { onOpen: (w: WordEntry) => void }) {
  const { progress } = usePlayer();
  const recent = [...progress.discovered]
    .sort((a, b) => b.at - a.at)
    .slice(0, 5)
    .map((d) => getWord(d.id))
    .filter((w): w is WordEntry => Boolean(w));

  return (
    <div className={styles.card}>
      <span className="label">recently discovered</span>
      {recent.length === 0 ? (
        <p className={styles.empty}>Nothing decrypted yet. Your solved concepts will show up here.</p>
      ) : (
        <ul className={styles.recent}>
          {recent.map((w) => (
            <li key={w.id}>
              <button onClick={() => onOpen(w)}>
                <span className={styles.recentWord}>{w.word}</span>
                <span className={styles.recentCat}>{w.category}</span>
                <ChevronRight size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AchievementStrip() {
  const { progress } = usePlayer();
  const unlocked = ACHIEVEMENTS.filter((a) => progress.achievements[a.id]).length;
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <span className="label">achievements</span>
        <span className={styles.count}>
          {unlocked}/{ACHIEVEMENTS.length}
        </span>
      </div>
      <div className={styles.badges}>
        {ACHIEVEMENTS.map((a) => {
          const on = Boolean(progress.achievements[a.id]);
          return (
            <span key={a.id} className={`${styles.badge} ${on ? styles.badgeOn : ''}`} title={`${a.name}: ${a.description}${on ? '' : ' (locked)'}`}>
              <AchievementIcon icon={a.icon} size={17} />
            </span>
          );
        })}
      </div>
      <Link to="/profile" className={styles.more}>
        view profile <ChevronRight size={13} />
      </Link>
    </div>
  );
}
