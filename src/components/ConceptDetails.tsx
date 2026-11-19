import { useState } from 'react';
import { Check, Copy, Lightbulb, Rocket, Terminal } from 'lucide-react';
import type { WordEntry } from '../game/types';
import styles from './ConceptDetails.module.scss';

const KEYWORDS =
  /\b(const|let|var|function|return|if|else|while|for|new|class|interface|implements|constructor|private|static|import|from|export|await|async|typeof|func|defer|SELECT|FROM|WHERE|CREATE|INDEX|ON|BEGIN|COMMIT|UPDATE|SET|FROM|RUN|CMD|WORKDIR|COPY)\b/g;

/** Tiny highlighter: comments, strings and keywords. Good enough for short snippets. */
function commentStart(line: string): number {
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') quote = c;
    else if (line.startsWith('//', i) || line.startsWith('-- ', i) || (c === '#' && (i === 0 || line[i - 1] === ' '))) return i;
  }
  return -1;
}

function highlight(line: string) {
  const commentAt = commentStart(line);
  const code = commentAt >= 0 ? line.slice(0, commentAt) : line;
  const comment = commentAt >= 0 ? line.slice(commentAt) : '';
  const parts: { text: string; cls?: string }[] = [];
  const re = /('[^']*'|"[^"]*"|`[^`]*`)/g;
  let last = 0;
  for (const m of code.matchAll(re)) {
    if (m.index! > last) parts.push({ text: code.slice(last, m.index) });
    parts.push({ text: m[0], cls: styles.str });
    last = m.index! + m[0].length;
  }
  if (last < code.length) parts.push({ text: code.slice(last) });

  return (
    <>
      {parts.map((p, i) =>
        p.cls ? (
          <span key={i} className={p.cls}>
            {p.text}
          </span>
        ) : (
          <span key={i}>
            {p.text.split(KEYWORDS).map((chunk, j) =>
              j % 2 ? (
                <span key={j} className={styles.kw}>
                  {chunk}
                </span>
              ) : (
                chunk
              ),
            )}
          </span>
        ),
      )}
      {comment && <span className={styles.comment}>{comment}</span>}
    </>
  );
}

export function CodeBlock({ language, snippet }: { language: string; snippet: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className={styles.code}>
      <div className={styles.codeHead}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.lang}>{language}</span>
        <button className={styles.copy} onClick={copy} aria-label="Copy code">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre>
        {snippet.split('\n').map((line, i) => (
          <div className={styles.line} key={i}>
            <span className={styles.ln}>{i + 1}</span>
            <code>{highlight(line) || ' '}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}

export default function ConceptDetails({ word }: { word: WordEntry }) {
  return (
    <div className={styles.details}>
      <p className={styles.definition}>{word.definition}</p>

      <section className={styles.block}>
        <h4>
          <Lightbulb size={14} /> How it works
        </h4>
        <p>{word.explanation}</p>
      </section>

      <section className={styles.block}>
        <h4>
          <Rocket size={14} /> In the real world
        </h4>
        <p>{word.example}</p>
      </section>

      {word.code && (
        <section className={styles.block}>
          <h4>
            <Terminal size={14} /> Code
          </h4>
          <CodeBlock {...word.code} />
        </section>
      )}
    </div>
  );
}
