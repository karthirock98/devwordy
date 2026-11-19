import { useEffect, useState } from 'react';
import { Check, Layers, Sparkles, X } from 'lucide-react';
import type { Category } from '../game/types';
import { ALL_CATEGORIES, MIN_POOL, TOPIC_GROUPS, countByCategory, wordCount } from '../data/topics';
import styles from './TopicPicker.module.scss';

interface Props {
  initial: Category[] | null;
  /** First visit: no cancel, friendlier copy. */
  onboarding: boolean;
  onSave: (topics: Category[]) => void;
  onCancel?: () => void;
}

export default function TopicPicker({ initial, onboarding, onSave, onCancel }: Props) {
  const [selected, setSelected] = useState<Set<Category>>(() => new Set(initial ?? []));
  const everything = ALL_CATEGORIES.every((c) => selected.has(c));
  const pool = wordCount([...selected]);
  const ready = pool >= MIN_POOL;

  useEffect(() => {
    if (onboarding || !onCancel) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onboarding, onCancel]);

  const toggle = (c: Category) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  const toggleGroup = (cats: Category[]) =>
    setSelected((prev) => {
      const next = new Set(prev);
      const all = cats.every((c) => next.has(c));
      cats.forEach((c) => (all ? next.delete(c) : next.add(c)));
      return next;
    });

  const toggleEverything = () => setSelected(everything ? new Set() : new Set(ALL_CATEGORIES));

  return (
    <div className={styles.overlay} onMouseDown={(e) => !onboarding && e.target === e.currentTarget && onCancel?.()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Choose topics">
        <header className={styles.head}>
          <div>
            <span className={styles.kicker}>&gt; choose_your_stack()</span>
            <h2>{onboarding ? 'What do you want to be quizzed on?' : 'Change your topics'}</h2>
            <p>Pick the frameworks, languages and areas you care about. You can change this anytime from the game screen.</p>
          </div>
          {!onboarding && onCancel && (
            <button className={styles.close} onClick={onCancel} aria-label="Close">
              <X size={18} />
            </button>
          )}
        </header>

        <div className={styles.body}>
          <button className={`${styles.everything} ${everything ? styles.on : ''}`} onClick={toggleEverything} aria-pressed={everything}>
            <Sparkles size={18} />
            <span>
              <strong>Anything goes</strong>
              <small>Every topic, all {ALL_CATEGORIES.reduce((n, c) => n + (countByCategory[c] ?? 0), 0)} words</small>
            </span>
            <span className={styles.check}>{everything && <Check size={14} />}</span>
          </button>

          {TOPIC_GROUPS.map((group) => {
            const allOn = group.categories.every((c) => selected.has(c));
            return (
              <section key={group.name} className={styles.group}>
                <button className={styles.groupHead} onClick={() => toggleGroup(group.categories)}>
                  <Layers size={13} />
                  {group.name}
                  <span>{allOn ? 'clear' : 'select all'}</span>
                </button>
                <div className={styles.chips}>
                  {group.categories.map((c) => {
                    const on = selected.has(c);
                    return (
                      <button key={c} className={`${styles.chip} ${on ? styles.chipOn : ''}`} onClick={() => toggle(c)} aria-pressed={on}>
                        {on && <Check size={13} />}
                        {c}
                        <small>{countByCategory[c] ?? 0}</small>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <footer className={styles.foot}>
          <span className={`${styles.pool} ${ready ? '' : styles.short}`}>
            {selected.size === 0
              ? 'Pick at least one topic'
              : ready
                ? `${pool} words in your pool`
                : `${pool} word${pool === 1 ? '' : 's'}: pick a few more topics (min ${MIN_POOL})`}
          </span>
          <div className={styles.actions}>
            {!onboarding && onCancel && (
              <button className="btn ghost" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button className="btn primary" disabled={!ready} onClick={() => onSave([...selected])}>
              {onboarding ? 'Start playing' : 'Save topics'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
