import { useEffect, useRef, useState } from 'react';
import { KeyRound, Lock, ScanText, Unlock, X } from 'lucide-react';
import styles from './HintPanel.module.scss';

/** Types text out character by character. */
function Typewriter({ text, animate }: { text: string; animate: boolean }) {
  const [count, setCount] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate) return;
    let i = 0;
    const t = window.setInterval(() => {
      i += 2;
      setCount(Math.min(i, text.length));
      if (i >= text.length) window.clearInterval(t);
    }, 18);
    return () => window.clearInterval(t);
  }, [text, animate]);
  // If another hint starts animating, finish this one instantly instead of freezing mid-way.
  const shown = animate ? count : text.length;
  return (
    <>
      {text.slice(0, shown)}
      {shown < text.length && <span className={styles.caret}>▌</span>}
    </>
  );
}
interface Props {
  open: boolean;
  hints: string[];
  used: number;
  costs: number[];
  playing: boolean;
  /** Letters uncovered by hints 4 and 5, in order. */
  letterHints: { char: string; position: number }[];
  /** False when the next hint cannot be used (e.g. only one hidden letter left). */
  canReveal: boolean;
  onReveal: () => void;
  onClose: () => void;
}

export default function HintPanel({ open, hints, used, costs, playing, letterHints, canReveal, onReveal, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [justRevealed, setJustRevealed] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRef.current && !panelRef.current.contains(target) && !target.closest('[aria-label="Open hints"]')) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  const reveal = () => {
    setJustRevealed(used);
    onReveal();
  };

  const slots = [...hints.map((text) => ({ kind: 'text' as const, text })), { kind: 'letter' as const }, { kind: 'letter' as const }];

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel} ref={panelRef} role="dialog" aria-label="Hints">
        <div className={styles.head}>
          <span className={styles.title}>
            <KeyRound size={14} /> decryption_keys
          </span>
          <button className={styles.close} onClick={onClose} aria-label="Close hints">
            <X size={16} />
          </button>
        </div>

        <ol className={styles.list}>
          {slots.map((slot, i) => {
            const isLetter = slot.kind === 'letter';
            const letter = isLetter ? letterHints[i - hints.length] : undefined;
            // Text hints are all shown for free once the round is over; letter hints only if used.
            const unlocked = isLetter ? Boolean(letter) : i < used || !playing;
            const isNext = playing && i === used;
            return (
              <li
                key={i}
                className={`${styles.item} ${unlocked ? styles.unlocked : ''} ${isNext ? styles.next : ''} ${isLetter ? styles.letterSlot : ''}`}
              >
                <span className={styles.index}>{isLetter ? <ScanText size={13} /> : unlocked ? <Unlock size={13} /> : <Lock size={13} />}</span>
                {unlocked && slot.kind === 'text' ? (
                  <p className={styles.text}>
                    <Typewriter text={slot.text} animate={justRevealed === i} />
                  </p>
                ) : unlocked && letter ? (
                  <p className={styles.text}>
                    Letter #{letter.position} is <span className={styles.letter}>{letter.char}</span>
                  </p>
                ) : isNext ? (
                  <button className={styles.reveal} onClick={reveal} disabled={!canReveal}>
                    <span>{isLetter ? (canReveal ? 'Reveal a random letter' : 'Only one letter left: solve it!') : `Decrypt hint #${i + 1}`}</span>
                    {canReveal && <span className={styles.cost}>−{costs[i]} XP</span>}
                  </button>
                ) : (
                  <p className={styles.encrypted} aria-label="Locked hint">
                    {isLetter ? (playing ? 'letter reveal · unlocks after the hints above' : 'letter reveal · not used') : '▓▒░'.repeat(8)}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        <p className={styles.foot}>
          {playing ? "Each hint lowers this round's XP reward. Hints 4 and 5 uncover one letter each." : 'Round over: all text hints unlocked for free.'}
        </p>
      </div>
    </>
  );
}
