# DevWordy

A developer word-guessing game. A technical concept hides behind animated fog; probe letters or guess the whole word.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure

```
src/
  data/words.ts          core word bank (word, category, difficulty, fact, definition, explanation, example, code, 3 hints)
  data/wordsMore.ts      Node.js, Java, C#, Python, Angular and language-name words
  data/topics.ts         topic groups shown in the topic picker
  game/                  pure game logic, no React
    engine.ts            guess evaluation, attempts, tiles
    scoring.ts           XP rules
    selection.ts         deterministic daily word + unlimited picker
    progression.ts       levels, achievements, streaks, applyResult()
    storage.ts           localStorage persistence
    dates.ts             local-date helpers
  hooks/
    PlayerContext.tsx    player progress + achievement/level-up events
    useGame.ts           one game session per mode (state + actions)
  components/            presentational UI (MysteryWord, HintPanel, GameControls, ResultScreen, ...)
  pages/                 GamePage (daily + unlimited), ProfilePage
```

## Rules

| Difficulty | Fog | Attempts | Base XP |
|---|---|---|---|
| Easy | letters visible through light fog | 6 | 50 |
| Medium | only vague shapes | 7 | 100 |
| Hard | no letters at all, category hidden | 8 | 175 |

- Typing **one character** probes that letter (uses an attempt, reveals every position it appears in).
- Typing a **full word** tries to solve; a wrong word of the right length reveals letters already in the right place.
- Repeated guesses and wrong-length words do **not** use an attempt.
- Bonus XP for harder concepts (+15 / +30), a first-try solve (+50%), the daily (+25) and streak (+5/day, max 50).
- On first visit you pick your topics (or "Anything goes"); you can change them from the game screen. Daily and unlimited words come only from those topics. Everyone with the same topics gets the same daily word.
- Every word shows a free **intel** line (a fun fact) under the category. It costs nothing.
- Hints 1–3 are text clues. Hints 4 and 5 each reveal one random hidden letter (never the last one).
- Hints remove 10% / 15% / 20% / 20% / 25% of the round's XP; each wrong guess removes 8% (minimum 10%).
- The first-try bonus needs a first-guess solve without letter-reveal hints.
- While typing, the input shows how many letters you have typed out of the word length and won't accept more.

To add words, append entries to `src/data/words.ts`. Hints must not contain the answer.

## Changing topics (players)

- **Profile → Your topics**: remove a topic with ×, add one from **add more**, or use **Edit all** for the full picker.
- The pool must keep at least 5 words, so the last topics can't be removed below that.
- Changes apply to the next word; a round already in progress keeps its word.

## Adding a new category (developers)

1. Add the name to the `Category` type in `src/game/types.ts`.
2. Add it to a group in `TOPIC_GROUPS` in `src/data/topics.ts` (or create a new group).
3. Add at least 3–5 words with that `category` in `src/data/wordsMore.ts`. Every word needs a `fact`, and its hints and fact must not contain the answer.

Players who chose "Anything goes" get the new category automatically. Everyone else sees it under **add more** on their profile.
To remove a category, delete its words and its entries in the two files above; saved player choices that mention it are cleaned up on load..

