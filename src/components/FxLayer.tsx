import { useEffect } from 'react';
import { X } from 'lucide-react';
import { usePlayer, type FxEvent } from '../hooks/PlayerContext';
import AchievementIcon from './AchievementIcon';
import styles from './FxLayer.module.scss';

function Toast({ event, onDone }: { event: Extract<FxEvent, { kind: 'achievement' }>; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 5000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const a = event.achievement;
  return (
    <div className={styles.toast} role="status">
      <span className={styles.toastIcon}>
        <AchievementIcon icon={a.icon} size={20} />
      </span>
      <span className={styles.toastBody}>
        <span className={styles.toastLabel}>Achievement unlocked</span>
        <strong>{a.name}</strong>
        <span className={styles.toastDesc}>{a.description}</span>
      </span>
      <button className={styles.close} onClick={onDone} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

function LevelUp({ event, onDone }: { event: Extract<FxEvent, { kind: 'level' }>; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 3200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.levelOverlay} onClick={onDone} role="alert">
      <div className={styles.levelCard}>
        <span className={styles.levelKicker}>&gt; system.upgrade()</span>
        <span className={styles.levelTitle} data-text="LEVEL UP">
          LEVEL UP
        </span>
        <span className={styles.levelNum}>LV {event.level}</span>
        <span className={styles.levelRank}>{event.title}</span>
      </div>
    </div>
  );
}

export default function FxLayer() {
  const { events, dismissEvent } = usePlayer();
  const level = events.find((e): e is Extract<FxEvent, { kind: 'level' }> => e.kind === 'level');
  const toasts = events.filter((e): e is Extract<FxEvent, { kind: 'achievement' }> => e.kind === 'achievement');

  return (
    <>
      {level && <LevelUp key={level.id} event={level} onDone={() => dismissEvent(level.id)} />}
      <div className={styles.toasts}>
        {toasts.map((t) => (
          <Toast key={t.id} event={t} onDone={() => dismissEvent(t.id)} />
        ))}
      </div>
    </>
  );
}
