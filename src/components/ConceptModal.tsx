import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { WordEntry } from '../game/types';
import ConceptDetails from './ConceptDetails';
import styles from './ConceptModal.module.scss';

export default function ConceptModal({ word, onClose }: { word: WordEntry; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={word.word}>
        <header className={styles.head}>
          <div>
            <span className={styles.cat}>{word.category}</span>
            <h3>{word.word}</h3>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className={styles.body}>
          <ConceptDetails word={word} />
        </div>
      </div>
    </div>
  );
}
