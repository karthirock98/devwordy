import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Info, Radio } from 'lucide-react';
import type { SessionStatus, WordEntry } from '../game/types';
import { tilesFor, type Tile } from '../game/engine';
import styles from './MysteryWord.module.scss';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/{}[]';

/** Cycles random glyphs for a moment before settling on the real character. */
function ScrambleChar({ char, delay }: { char: string; delay: number }) {
  const [shown, setShown] = useState(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
  useEffect(() => {
    let frame = 0;
    let timer = 0;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        frame++;
        if (frame >= 7) {
          setShown(char);
          window.clearInterval(timer);
        } else {
          setShown(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
        }
      }, 45);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [char, delay]);
  return <>{shown}</>;
}

interface Props {
  word: WordEntry;
  revealed: number[];
  status: SessionStatus;
  /** Changes on every wrong guess to retrigger the glitch animation. */
  errorKey: number;
  hintsUsed: number;
  totalHints: number;
  /** Tiles uncovered by letter hints, highlighted differently from guessed ones. */
  hintLetters: number[];
  hintsOpen: boolean;
  onToggleHints: () => void;
  hintPanel: ReactNode;
}

export default function MysteryWord({
  word,
  revealed,
  status,
  errorKey,
  hintsUsed,
  totalHints,
  hintLetters,
  hintsOpen,
  onToggleHints,
  hintPanel,
}: Props) {
  const tiles = useMemo(() => tilesFor(word), [word]);
  const groups = useMemo(() => {
    const out: Tile[][] = [[]];
    tiles.forEach((t) => (t.isGap ? out.push([]) : out[out.length - 1].push(t)));
    return out.filter((g) => g.length);
  }, [tiles]);
  const longest = Math.max(...groups.map((g) => g.length));
  const revealedSet = new Set(revealed);
  const letterCount = tiles.filter((t) => !t.isGap).length;
  const finished = status !== 'playing';

  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    if (!errorKey) return;
    setGlitch(true);
    const t = window.setTimeout(() => setGlitch(false), 500);
    return () => window.clearTimeout(t);
  }, [errorKey]);

  let order = 0;

  return (
    <section className={`${styles.stage} ${status === 'won' ? styles.won : ''} ${status === 'lost' ? styles.lost : ''}`}>
      <div className={styles.meta}>
        <span className={styles.category}>
          <span className={styles.metaKey}>sector:</span> {word.category}
        </span>
        <span className={styles.length}>
          {letterCount} chars{groups.length > 1 ? ` · ${groups.length} words` : ''}
        </span>
      </div>

      <p className={styles.fact} title="Free intel: costs no XP">
        <Radio size={13} aria-hidden="true" />
        <span className={styles.factKey}>intel:</span>
        <span>{word.fact}</span>
      </p>

      <div className={`${styles.wordWrap} ${glitch ? styles.glitch : ''}`} style={{ ['--n' as string]: longest }}>
        <div className={styles.word} aria-label={`Mystery word with ${letterCount} letters`}>
          {groups.map((group, gi) => (
            <div className={styles.group} key={gi}>
              {group.map((tile) => {
                const isRevealed = revealedSet.has(tile.index);
                const i = order++;
                return (
                  <div
                    key={tile.index}
                    className={`${styles.tile} ${isRevealed ? styles.revealed : ''} ${hintLetters.includes(tile.index) && !finished ? styles.hinted : ''}`}
                    style={{ ['--i' as string]: i }}
                    aria-label={isRevealed ? tile.char : 'hidden letter'}
                  >
                    {isRevealed ? (
                      <span className={styles.char}>
                        <ScrambleChar char={tile.char} delay={finished ? i * 55 : 0} />
                      </span>
                    ) : (
                      <span className={styles.static} aria-hidden="true" />
                    )}
                    {!isRevealed && <span className={styles.fog} aria-hidden="true" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.hintAnchor}>
        <button
          className={`${styles.infoBtn} ${hintsOpen ? styles.infoOpen : ''}`}
          onClick={onToggleHints}
          aria-expanded={hintsOpen}
          aria-label="Open hints"
        >
          <Info size={16} />
          <span>Hints</span>
          <span className={styles.hintCount}>{hintsUsed}/{totalHints}</span>
        </button>
        {hintPanel}
      </div>
    </section>
  );
}
