import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarClock, Check, Infinity as InfinityIcon, Share2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Difficulty, GameMode, WordEntry } from '../game/types';
import { formatCountdown, msUntilTomorrow } from '../game/dates';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { useNow } from '../hooks/useToday';
import { TOTAL_HINTS } from '../game/scoring';
import ConceptDetails from './ConceptDetails';
import styles from './ResultScreen.module.scss';

export interface ResultSummary {
  won: boolean;
  difficulty: Difficulty;
  attempts: number;
  maxAttempts: number;
  hintsUsed: number;
  accuracy: number;
  xp: number;
  breakdown?: { base: number; firstTry: number; daily: number; streak: number };
  date?: string;
}

const SYMBOLS = ['{', '}', '<', '/>', ';', '()', '=>', '[]', '&&', '#', '01', '++'];

function Burst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 90 + Math.random() * 110;
        return {
          s: SYMBOLS[i % SYMBOLS.length],
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist * 0.6,
          d: Math.random() * 0.15,
          c: ['var(--green)', 'var(--cyan)', 'var(--purple)', 'var(--amber)'][i % 4],
        };
      }),
    [],
  );
  return (
    <div className={styles.burst} aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{ ['--x' as string]: `${b.x}px`, ['--y' as string]: `${b.y}px`, animationDelay: `${b.d}s`, color: b.c }}>
          {b.s}
        </span>
      ))}
    </div>
  );
}

function Countdown() {
  useNow(1000);
  return <span className={styles.countdown}>{formatCountdown(msUntilTomorrow())}</span>;
}

interface Props {
  word: WordEntry;
  mode: GameMode;
  summary: ResultSummary;
  /** True when the player returns to an already-finished daily. */
  review?: boolean;
  onContinue?: () => void;
}

export default function ResultScreen({ word, mode, summary, review, onContinue }: Props) {
  const [xpTarget, setXpTarget] = useState(review ? summary.xp : 0);
  const xp = useAnimatedNumber(xpTarget, 1200);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setXpTarget(summary.xp), 250);
    return () => window.clearTimeout(t);
  }, [summary.xp]);

  useEffect(() => {
    if (!onContinue) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) onContinue();
    };
    // Delay so the Enter that submitted the winning guess does not skip the screen.
    const t = window.setTimeout(() => window.addEventListener('keydown', onKey), 600);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [onContinue]);

  const share = async () => {
    const bar = Array.from({ length: summary.maxAttempts }, (_, i) => (i < summary.attempts - (summary.won ? 1 : 0) ? '▒' : i === summary.attempts - 1 && summary.won ? '█' : '·')).join('');
    const text = `DevWordy daily ${summary.date ?? ''}\n${summary.won ? 'decrypted' : 'lost'} · ${summary.difficulty} · ${summary.attempts}/${summary.maxAttempts} · ${summary.hintsUsed} hints\n${bar}  +${summary.xp} XP`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const b = summary.breakdown;

  return (
    <section className={`${styles.result} ${summary.won ? styles.won : styles.lost}`}>
      <header className={styles.hero}>
        {summary.won && !review && <Burst />}
        <span className={styles.kicker}>
          {review ? '> daily challenge complete' : summary.won ? '> signal decrypted' : '> connection lost'}
        </span>
        <h2 className={styles.word} data-text={word.word.toUpperCase()}>
          {word.word.toUpperCase()}
        </h2>
        <div className={styles.tags}>
          <span className={styles.tag}>{word.category}</span>
          <span className={`${styles.tag} ${styles[`c_${word.difficulty}`]}`}>{word.difficulty} concept</span>
          <span className={styles.tag}>played on {summary.difficulty}</span>
        </div>
      </header>

      <div className={styles.stats}>
        <div className={`${styles.stat} ${styles.xpStat}`}>
          <span className={styles.statLabel}>xp earned</span>
          <span className={styles.statValue}>
            <Zap size={18} />+{xp}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>attempts</span>
          <span className={styles.statValue}>
            {summary.attempts}
            <small>/{summary.maxAttempts}</small>
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>hints</span>
          <span className={styles.statValue}>
            {summary.hintsUsed}
            <small>/{TOTAL_HINTS}</small>
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>accuracy</span>
          <span className={styles.statValue}>
            {summary.accuracy}
            <small>%</small>
          </span>
        </div>
      </div>

      {b && summary.won && (
        <p className={styles.breakdown}>
          base {b.base}
          {b.firstTry > 0 && <> · first try +{b.firstTry}</>}
          {b.daily > 0 && <> · daily +{b.daily}</>}
          {b.streak > 0 && <> · streak +{b.streak}</>}
        </p>
      )}
      {!summary.won && <p className={styles.breakdown}>No XP this time, but now you know this one. Read on.</p>}

      <div className={styles.learn}>
        <span className="label">what you just uncovered</span>
        <ConceptDetails word={word} />
      </div>

      <footer className={styles.actions}>
        {mode === 'unlimited' && onContinue && (
          <button className="btn primary" onClick={onContinue}>
            Continue <ArrowRight size={16} />
            <kbd className={styles.kbd}>↵</kbd>
          </button>
        )}
        {mode === 'daily' && (
          <>
            <div className={styles.next}>
              <CalendarClock size={16} />
              <span>Next daily signal in</span>
              <Countdown />
            </div>
            <div className={styles.actionRow}>
              <button className="btn" onClick={share}>
                {copied ? <Check size={15} /> : <Share2 size={15} />}
                {copied ? 'Copied' : 'Share result'}
              </button>
              <Link to="/unlimited" className="btn primary" style={{ textDecoration: 'none' }}>
                <InfinityIcon size={16} /> Play unlimited
              </Link>
            </div>
          </>
        )}
      </footer>
    </section>
  );
}
