import { useState } from 'react';
import { Plus, SlidersHorizontal, X } from 'lucide-react';
import type { Category } from '../game/types';
import { ALL_CATEGORIES, MIN_POOL, TOPIC_GROUPS, countByCategory, isEverything, wordCount } from '../data/topics';
import { usePlayer } from '../hooks/PlayerContext';
import TopicPicker from './TopicPicker';
import styles from './TopicsCard.module.scss';

/** Profile card to review, add and remove quiz topics without opening the full picker. */
export default function TopicsCard() {
  const { progress, setTopics } = usePlayer();
  const [pickerOpen, setPickerOpen] = useState(false);

  const selected: Category[] = progress.topics ?? ALL_CATEGORIES;
  const everything = isEverything(progress.topics);
  const pool = wordCount(selected);
  // Keep the picker's group order for both lists.
  const ordered = TOPIC_GROUPS.flatMap((g) => g.categories);
  const mine = ordered.filter((c) => selected.includes(c));
  const others = ordered.filter((c) => !selected.includes(c));

  const remove = (c: Category) => setTopics(selected.filter((t) => t !== c));
  const add = (c: Category) => setTopics([...selected, c]);
  const canRemove = (c: Category) => wordCount(selected.filter((t) => t !== c)) >= MIN_POOL;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <span className="label">
          your topics · {everything ? 'everything' : `${mine.length} selected`} · {pool} words
        </span>
        <button className={styles.edit} onClick={() => setPickerOpen(true)}>
          <SlidersHorizontal size={13} /> Edit all
        </button>
      </div>

      <div className={styles.chips}>
        {mine.map((c) => {
          const ok = canRemove(c);
          return (
            <span key={c} className={styles.chip}>
              {c}
              <small>{countByCategory[c] ?? 0}</small>
              <button
                onClick={() => remove(c)}
                disabled={!ok}
                aria-label={`Remove ${c}`}
                title={ok ? `Remove ${c}` : `Keep at least ${MIN_POOL} words in your pool`}
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
      </div>

      {others.length > 0 && (
        <>
          <span className={styles.subLabel}>add more</span>
          <div className={styles.chips}>
            {others.map((c) => (
              <button key={c} className={styles.addChip} onClick={() => add(c)} aria-label={`Add ${c}`}>
                <Plus size={12} />
                {c}
                <small>{countByCategory[c] ?? 0}</small>
              </button>
            ))}
          </div>
        </>
      )}

      <p className={styles.note}>
        Changes apply to your next word. A round already in progress keeps its word.
      </p>

      {pickerOpen && (
        <TopicPicker
          initial={selected}
          onboarding={false}
          onCancel={() => setPickerOpen(false)}
          onSave={(t) => {
            setTopics(t);
            setPickerOpen(false);
          }}
        />
      )}
    </section>
  );
}
