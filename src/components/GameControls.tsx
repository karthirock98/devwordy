import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CornerDownLeft, Lock, Zap } from 'lucide-react';
import type { Difficulty, Guess } from '../game/types';
import { MAX_ATTEMPTS, normalize } from '../game/engine';
import { BASE_XP } from '../game/scoring';
import type { Feedback } from '../hooks/useGame';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import styles from './GameControls.module.scss';

/* ---------- Difficulty ---------- */

const DIFF_INFO: Record<Difficulty, { label: string; desc: string }> = {
  easy: { label: 'Easy', desc: 'Light fog' },
  medium: { label: 'Medium', desc: 'Dense fog' },
  hard: { label: 'Hard', desc: 'Total blackout' },
};

export function DifficultySelector({ value, locked, onChange }: { value: Difficulty; locked: boolean; onChange: (d: Difficulty) => void }) {
  return (
    <div className={styles.difficulty}>
      <div className={styles.segment} role="radiogroup" aria-label="Difficulty">
        {(Object.keys(DIFF_INFO) as Difficulty[]).map((d) => (
          <button
            key={d}
            role="radio"
            aria-checked={value === d}
            className={`${styles.option} ${styles[d]} ${value === d ? styles.selected : ''}`}
            disabled={locked && value !== d}
            onClick={() => onChange(d)}
          >
            <span className={styles.optLabel}>{DIFF_INFO[d].label}</span>
            <span className={styles.optMeta}>
              {DIFF_INFO[d].desc} · {MAX_ATTEMPTS[d]} tries · {BASE_XP[d]}xp
            </span>
          </button>
        ))}
      </div>
      {locked && (
        <span className={styles.lockNote}>
          <Lock size={11} /> difficulty locked for this round
        </span>
      )}
    </div>
  );
}

/* ---------- Attempts + XP ---------- */

export function AttemptsMeter({ used, max }: { used: number; max: number }) {
  const left = max - used;
  return (
    <div className={styles.attempts} aria-label={`${left} of ${max} attempts left`}>
      <span className={styles.statLabel}>attempts</span>
      <div className={styles.pips}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={`${styles.pip} ${i < left ? styles.pipOn : ''} ${left <= 2 && i < left ? styles.pipWarn : ''}`} />
        ))}
      </div>
      <span className={`${styles.statValue} ${left <= 2 ? styles.warn : ''}`}>
        {left}/{max}
      </span>
    </div>
  );
}

export function XpIndicator({ value, firstTryBonus }: { value: number; firstTryBonus: number }) {
  const shown = useAnimatedNumber(value, 500);
  const [dropped, setDropped] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (value < prev.current) {
      setDropped(true);
      const t = window.setTimeout(() => setDropped(false), 600);
      prev.current = value;
      return () => window.clearTimeout(t);
    }
    prev.current = value;
  }, [value]);

  return (
    <div className={`${styles.xp} ${dropped ? styles.xpDrop : ''}`} title={firstTryBonus ? `+${firstTryBonus} XP bonus if you solve it on your first attempt` : undefined}>
      <span className={styles.statLabel}>reward</span>
      <span className={styles.xpValue}>
        <Zap size={14} />
        {shown} XP
      </span>
      {firstTryBonus > 0 && <span className={styles.bonus}>+{firstTryBonus} 1st try</span>}
    </div>
  );
}

/* ---------- Guess input ---------- */

export function GuessInput({
  onGuess,
  feedback,
  disabled,
  groups,
}: {
  onGuess: (value: string) => { consumed: boolean };
  feedback: Feedback | null;
  disabled: boolean;
  /** Letter count of each word in the answer, e.g. [4, 7] for "TREE SHAKING". */
  groups: number[];
}) {
  const [value, setValue] = useState('');
  const [bump, setBump] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const total = groups.reduce((a, b) => a + b, 0);
  const typed = normalize(value).length;
  const incomplete = typed > 1 && typed < total;

  useEffect(() => {
    if (!disabled && window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, [disabled]);

  // The nudge animation re-creates the input row; put the cursor back.
  useEffect(() => {
    if (bump) inputRef.current?.focus();
  }, [bump]);

  const onChange = (raw: string) => {
    const clean = raw.replace(/[^a-zA-Z0-9 -]/g, '');
    // Never let the guess grow longer than the mystery word: keep what fits, drop the rest.
    let count = 0;
    let kept = '';
    for (const ch of clean) {
      if (/[a-zA-Z0-9]/.test(ch)) {
        if (count === total) break;
        count++;
      }
      kept += ch;
    }
    if (normalize(clean).length > total) setBump((b) => b + 1);
    setValue(kept);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (disabled || !typed) return;
    if (incomplete) {
      setBump((b) => b + 1);
      return;
    }
    const { consumed } = onGuess(value);
    if (consumed) setValue('');
    else {
      setBump((b) => b + 1);
      inputRef.current?.select();
    }
  };

  const tone = feedback
    ? {
        correct: styles.good,
        hit: styles.good,
        partial: styles.info,
        hint: styles.info,
        miss: styles.bad,
        lost: styles.bad,
        repeat: styles.warnTone,
        length: styles.warnTone,
        invalid: styles.warnTone,
      }[feedback.type]
    : '';

  // While typing, the line under the input coaches on length instead of showing errors.
  let status: { text: string; cls: string; key: string | number };
  if (typed === 1) status = { text: `Probe letter "${normalize(value)}". Press Enter.`, cls: styles.info, key: 'probe' };
  else if (incomplete) {
    const left = total - typed;
    status = { text: `${left} more letter${left === 1 ? '' : 's'} to complete the word`, cls: styles.dimTone, key: 'typing' };
  } else if (typed === total && typed > 1) status = { text: 'Length matches. Press Enter to submit.', cls: styles.good, key: 'ready' };
  else
    status = {
      text: feedback ? feedback.message : 'One character = probe that letter. Full word = solve. Press Enter to submit.',
      cls: tone,
      key: feedback?.key ?? 'idle',
    };

  let filled = typed;
  const counterCls = typed === total && typed > 1 ? styles.countFull : typed === 1 ? styles.countProbe : '';

  return (
    <form className={styles.guessForm} onSubmit={submit}>
      <div key={bump} className={`${styles.inputRow} ${bump ? styles.nudge : ''}`}>
        <span className={styles.prompt}>&gt;</span>
        <input
          ref={inputRef}
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="a letter, or the whole word"
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-label="Your guess"
          aria-describedby="guess-status"
        />
        <span className={`${styles.counter} ${counterCls}`} aria-label={`${typed} of ${total} letters typed`}>
          {typed}/{total}
        </span>
        <button className={`btn primary ${styles.submit}`} type="submit" disabled={disabled || !typed || incomplete}>
          <span className={styles.submitText}>Execute</span>
          <CornerDownLeft size={15} />
        </button>
      </div>

      <div className={styles.slots} aria-hidden="true">
        {groups.map((n, gi) => (
          <span key={gi} className={styles.slotGroup}>
            {Array.from({ length: n }, (_, i) => {
              const on = filled-- > 0;
              return <span key={i} className={`${styles.slot} ${on ? (typed === 1 ? styles.slotProbe : styles.slotOn) : ''}`} />;
            })}
          </span>
        ))}
      </div>

      <p id="guess-status" className={`${styles.feedback} ${status.cls}`} key={status.key} aria-live="polite">
        {status.text}
      </p>
    </form>
  );
}

/* ---------- History ---------- */

export function GuessHistory({ guesses }: { guesses: Guess[] }) {
  if (!guesses.length) return null;
  const letters = guesses.filter((g) => g.kind === 'letter');
  const words = guesses.filter((g) => g.kind === 'word');
  return (
    <div className={styles.history}>
      {letters.length > 0 && (
        <div className={styles.historyRow}>
          <span className={styles.statLabel}>probes</span>
          <div className={styles.chips}>
            {letters.map((g) => (
              <span key={g.value} className={`${styles.chip} ${styles[g.result]}`}>
                {g.value}
              </span>
            ))}
          </div>
        </div>
      )}
      {words.length > 0 && (
        <div className={styles.historyRow}>
          <span className={styles.statLabel}>attempts</span>
          <div className={styles.chips}>
            {words.map((g) => (
              <span key={g.value} className={`${styles.chip} ${styles.wordChip} ${styles[g.result]}`}>
                {g.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
