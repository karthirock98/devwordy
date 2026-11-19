import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarDays, Flag, Infinity as InfinityIcon, SlidersHorizontal } from 'lucide-react';
import type { Category, GameMode, WordEntry } from '../game/types';
import { MAX_ATTEMPTS, letterTiles, roundAccuracy, tilesFor } from '../game/engine';
import { FIRST_TRY_BONUS, TEXT_HINTS, TOTAL_HINTS, hintCostXp, potentialXp, roundMax } from '../game/scoring';
import { prettyDate } from '../game/dates';
import { getWord } from '../data/words';
import { useGame } from '../hooks/useGame';
import { usePlayer } from '../hooks/PlayerContext';
import MysteryWord from '../components/MysteryWord';
import HintPanel from '../components/HintPanel';
import { AttemptsMeter, DifficultySelector, GuessHistory, GuessInput, XpIndicator } from '../components/GameControls';
import ResultScreen, { type ResultSummary } from '../components/ResultScreen';
import ConceptModal from '../components/ConceptModal';
import TopicPicker from '../components/TopicPicker';
import { topicsLabel } from '../data/topics';
import { AchievementStrip, RecentWords, StatsGrid, StreakCard } from '../components/ProgressPanel';
import styles from './GamePage.module.scss';

export default function GamePage({ mode }: { mode: GameMode }) {
  const game = useGame(mode);
  const { progress, today, setTopics } = usePlayer();
  const { session, word } = game;

  const [hintsOpen, setHintsOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [modalWord, setModalWord] = useState<WordEntry | null>(null);
  const [confirmForfeit, setConfirmForfeit] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const celebrateTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(celebrateTimer.current), []);
  useEffect(() => setConfirmForfeit(false), [session.id]);

  // A daily already finished (e.g. session data was cleared) → review from the stored record.
  const record = game.dailyRecord;
  const reviewFromRecord = mode === 'daily' && record && session.status === 'playing';
  const finished = session.status !== 'playing';
  const showResult = reviewFromRecord || (finished && !celebrating);

  const onGuess = useCallback(
    (value: string) => {
      const out = game.guess(value);
      if (!('session' in out)) return { consumed: false };
      if (out.type === 'miss' || out.type === 'partial' || out.type === 'lost') setErrorKey((k) => k + 1);
      if (out.session.status !== 'playing') {
        setHintsOpen(false);
        setCelebrating(true);
        celebrateTimer.current = window.setTimeout(() => setCelebrating(false), out.type === 'correct' ? 2100 : 1700);
      }
      return { consumed: true };
    },
    [game],
  );

  const forfeit = () => {
    if (!confirmForfeit) {
      setConfirmForfeit(true);
      return;
    }
    setHintsOpen(false);
    game.forfeit();
    setErrorKey((k) => k + 1);
    setCelebrating(true);
    celebrateTimer.current = window.setTimeout(() => setCelebrating(false), 1500);
  };

  const closeHints = useCallback(() => setHintsOpen(false), []);

  const { nextRound: startNext } = game;
  const nextRound = useCallback(() => {
    startNext();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [startNext]);

  let content;
  if (showResult) {
    const reviewWord = reviewFromRecord ? getWord(record.wordId) ?? word : word;
    const summary: ResultSummary = reviewFromRecord
      ? {
          won: record.won,
          difficulty: record.difficulty,
          attempts: record.attempts,
          maxAttempts: MAX_ATTEMPTS[record.difficulty],
          hintsUsed: record.hintsUsed,
          accuracy: record.accuracy,
          xp: record.xp,
          date: record.date,
        }
      : {
          won: session.status === 'won',
          difficulty: session.difficulty,
          attempts: session.guesses.length,
          maxAttempts: MAX_ATTEMPTS[session.difficulty],
          hintsUsed: session.hintsUsed,
          accuracy: roundAccuracy(session),
          xp: session.xpEarned,
          breakdown: session.xp,
          date: session.date,
        };
    const isReview = Boolean(reviewFromRecord) || (mode === 'daily' && Date.now() - (session.finishedAt ?? 0) > 4000);
    content = (
      <ResultScreen
        key={session.id}
        word={reviewWord}
        mode={mode}
        summary={summary}
        review={isReview}
        onContinue={mode === 'unlimited' ? nextRound : undefined}
      />
    );
  } else {
    const max = MAX_ATTEMPTS[session.difficulty];
    const costs = Array.from({ length: TOTAL_HINTS }, (_, i) => hintCostXp(word, session.difficulty, i));
    const letters = letterTiles(word);
    const letterHints = (session.hintLetters ?? []).map((index) => ({
      char: letters.find((t) => t.index === index)?.char ?? '?',
      position: letters.findIndex((t) => t.index === index) + 1,
    }));
    const groups = tilesFor(word)
      .map((t) => (t.isGap ? ' ' : 'x'))
      .join('')
      .split(' ')
      .filter(Boolean)
      .map((g) => g.length);
    content = (
      <div className={styles.board} key={session.id}>
        <DifficultySelector value={session.difficulty} locked={game.locked} onChange={game.changeDifficulty} />

        <div className={styles.stageWrap}>
          <MysteryWord
            word={word}
            revealed={session.revealed}
            status={session.status}
            errorKey={errorKey}
            hintsUsed={session.hintsUsed}
            totalHints={TOTAL_HINTS}
            hintLetters={session.hintLetters ?? []}
            hintsOpen={hintsOpen}
            onToggleHints={() => setHintsOpen((o) => !o)}
            hintPanel={
              <HintPanel
                open={hintsOpen}
                hints={word.hints}
                used={session.hintsUsed}
                costs={costs}
                playing={session.status === 'playing'}
                letterHints={letterHints}
                canReveal={game.canHint}
                onReveal={game.revealHint}
                onClose={closeHints}
              />
            }
          />
          {celebrating && session.status === 'won' && <span className={styles.xpFloat}>+{session.xpEarned} XP</span>}
        </div>

        <div className={styles.statusRow}>
          <AttemptsMeter used={session.guesses.length} max={max} />
          <XpIndicator
            value={finished ? session.xpEarned : potentialXp(session, word)}
            firstTryBonus={!finished && session.guesses.length === 0 && session.hintsUsed <= TEXT_HINTS ? Math.round(roundMax(word, session.difficulty) * FIRST_TRY_BONUS) : 0}
          />
        </div>

        <GuessInput onGuess={onGuess} feedback={game.feedback} disabled={finished} groups={groups} />
        <GuessHistory guesses={session.guesses} />

        {mode === 'unlimited' && !finished && (
          <div className={styles.forfeitRow}>
            <button className={`btn ghost danger ${styles.forfeit}`} onClick={forfeit} onBlur={() => setConfirmForfeit(false)}>
              <Flag size={13} />
              {confirmForfeit ? 'Click again to reveal and skip' : 'Give up'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.gameCol}>
        <div className={styles.modeBar}>
          <div className={styles.modeTitle}>
            {mode === 'daily' ? <CalendarDays size={18} /> : <InfinityIcon size={18} />}
            <h1>{mode === 'daily' ? 'Daily Challenge' : 'Unlimited'}</h1>
          </div>
          <span className={styles.modeSub}>
            {mode === 'daily'
              ? `${prettyDate(today)} · same word for everyone on your topics and level`
              : `round #${progress.unlimited.played + (finished ? 0 : 1)} · ${progress.unlimited.won} solved`}
          </span>
        </div>
        <div className={styles.topicBar}>
          <span className={styles.topicLabel}>topics:</span>
          <span className={styles.topicValue}>{topicsLabel(progress.topics)}</span>
          <button className={styles.topicBtn} onClick={() => setTopicsOpen(true)}>
            <SlidersHorizontal size={13} /> change
          </button>
          {game.locked && !finished && <span className={styles.topicNote}>applies from your next word</span>}
        </div>
        <div className={styles.panel}>{content}</div>
      </div>

      <aside className={styles.aside}>
        <StreakCard />
        <StatsGrid progress={progress} />
        <RecentWords onOpen={setModalWord} />
        <AchievementStrip />
      </aside>

      {modalWord && <ConceptModal word={modalWord} onClose={() => setModalWord(null)} />}
      {topicsOpen && (
        <TopicPicker
          initial={progress.topics}
          onboarding={false}
          onCancel={() => setTopicsOpen(false)}
          onSave={(t: Category[]) => {
            setTopics(t);
            setTopicsOpen(false);
          }}
        />
      )}
    </div>
  );
}
