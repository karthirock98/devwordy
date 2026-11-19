import { NavLink } from 'react-router-dom';
import { CalendarDays, Flame, Infinity as InfinityIcon, UserRound } from 'lucide-react';
import { usePlayer } from '../hooks/PlayerContext';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import styles from './Header.module.scss';

export default function Header() {
  const { progress, level, streak, today } = usePlayer();
  const xp = useAnimatedNumber(progress.totalXp, 900);
  const dailyDone = Boolean(progress.daily.history[today]);

  const link = ({ isActive }: { isActive: boolean }) => `${styles.link} ${isActive ? styles.active : ''}`;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/daily" className={styles.logo} aria-label="DevWordy home">
          <span className={styles.prompt}>&gt;_</span>
          <span className={styles.name}>
            Dev<span>Wordy</span>
          </span>
        </NavLink>

        <nav className={styles.nav} aria-label="Game modes">
          <NavLink to="/daily" className={link}>
            <CalendarDays size={16} />
            <span className={styles.linkText}>Daily</span>
            {!dailyDone && <span className={styles.dot} aria-label="Daily challenge available" />}
          </NavLink>
          <NavLink to="/unlimited" className={link}>
            <InfinityIcon size={16} />
            <span className={styles.linkText}>Unlimited</span>
          </NavLink>
          <NavLink to="/profile" className={link}>
            <UserRound size={16} />
            <span className={styles.linkText}>Profile</span>
          </NavLink>
        </nav>

        <NavLink to="/profile" className={styles.player} title={`${level.title} · ${level.intoLevel}/${level.needed} XP to next level`}>
          {streak > 0 && (
            <span className={styles.streak}>
              <Flame size={14} />
              {streak}
            </span>
          )}
          <span className={styles.level}>LV{level.level}</span>
          <span className={styles.xpWrap}>
            <span className={styles.xp}>{xp.toLocaleString()} XP</span>
            <span className={styles.bar}>
              <span style={{ transform: `scaleX(${level.progress})` }} />
            </span>
          </span>
        </NavLink>
      </div>
    </header>
  );
}
