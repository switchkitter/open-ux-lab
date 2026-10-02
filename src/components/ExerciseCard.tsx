import { useEffect, useId, useRef, useState } from "react";
import type { Exercise } from "../content/types";
import { shuffledIndices } from "../lib/shuffle";
import Mockup from "./Mockup";

type Props = {
  /** Shown in the eyebrow, e.g. "H1" */
  code: string;
  /** Where this exercise sits, e.g. "Exercise 1 of 2". Shown as text so it isn't conveyed only by the progress bar. */
  position?: string;
  exercise: Exercise;
  nextLabel: string;
  /** Extra line in the feedback, e.g. when this exercise comes back for review. Called once, on answer. */
  noteFor?: (correct: boolean) => string | null;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
};

/** One exercise. Remount with key={exercise.id} to reset between exercises. */
export default function ExerciseCard({ code, position, exercise, nextLabel, noteFor, onAnswer, onNext }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  // Choice options appear in a new random order each time, so learners can't memorize positions.
  // Keys stay as original indices, which is what exercise.correct refers to.
  const [order] = useState(() => (exercise.type === "choice" ? shuffledIndices(exercise.options.length) : []));
  const answered = picked !== null;
  const correctKey = exercise.type === "compare" ? exercise.correct : String(exercise.correct);
  const isCorrect = picked === correctKey;

  // Move focus to the verdict so screen readers read it straight away; Tab then reaches the Next button.
  useEffect(() => {
    if (answered) feedbackRef.current?.focus();
  }, [answered]);

  function pick(key: string) {
    if (answered) return;
    setPicked(key);
    // Work out the note before onAnswer updates progress, since it describes the state being changed.
    setNote(noteFor?.(key === correctKey) ?? null);
    onAnswer(key === correctKey);
  }

  const stateClass = (key: string) =>
    !answered ? "" : key === correctKey ? "right" : key === picked ? "wrong" : "";

  // Right and wrong are shown in words as well as color.
  const verdict = (key: string) =>
    !answered ? null : key === correctKey ? (key === picked ? "Your answer: correct" : "Correct answer") : key === picked ? "Your answer" : null;
  const verdictMark = (key: string) => {
    const text = verdict(key);
    if (!text) return null;
    return (
      <span className={`verdict ${key === correctKey ? "right" : "wrong"}`}>
        <span aria-hidden="true">{key === correctKey ? "✓" : "✗"}</span> {text}
      </span>
    );
  };
  const eyebrow = [code, position].filter(Boolean).join(" · ");

  return (
    <section>
      {exercise.type === "compare" ? (
        <>
          <div className="eyebrow">{eyebrow} · Which is better?</div>
          <h1 className="q">{exercise.question}</h1>
          <p className="qhint">Pick a design.</p>
          <div className="pair">
            {(["a", "b"] as const).map((k) => (
              <button
                key={k}
                type="button"
                className={`choice ${stateClass(k)}`}
                disabled={answered}
                onClick={() => pick(k)}
                aria-label={`Design ${k.toUpperCase()}${verdict(k) ? `, ${verdict(k)!.toLowerCase()}` : ""}`}
                aria-describedby={`${uid}-${k}`}
              >
                <span className="tag">
                  {k.toUpperCase()}
                  {verdictMark(k)}
                </span>
                <Mockup id={`${uid}-${k}`} html={exercise[k]} />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="eyebrow">{eyebrow} · Question</div>
          <h1 className="q">{exercise.question}</h1>
          <div className="opts">
            {order.map((i) => (
              <button
                key={i}
                type="button"
                className={`opt ${stateClass(String(i))}`}
                disabled={answered}
                onClick={() => pick(String(i))}
              >
                {exercise.options[i]}
                {verdictMark(String(i))}
              </button>
            ))}
          </div>
        </>
      )}

      {answered && (
        <>
          <div className={`feedback ${isCorrect ? "good" : "bad"}`} ref={feedbackRef} tabIndex={-1}>
            <strong>{isCorrect ? "Right." : "Not quite."}</strong>
            {exercise.why}
            {note && <p className="feedback-note">{note}</p>}
          </div>
          <div className="actions">
            <button className="btn" type="button" onClick={onNext}>
              {nextLabel}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
