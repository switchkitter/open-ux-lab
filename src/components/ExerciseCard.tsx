import { useEffect, useRef, useState } from "react";
import type { Exercise, SpotPart } from "../content/types";
import { shuffledIndices } from "../lib/shuffle";
import { count } from "../lib/analytics";
import { play } from "../lib/useSound";
import Mockup from "./Mockup";
import Spoken from "./Spoken";

type Props = {
  /** Which lesson the exercise comes from, shown in review where exercises are mixed. */
  source?: string;
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
export default function ExerciseCard({ source, position, exercise, nextLabel, noteFor, onAnswer, onNext }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  // Choice options appear in a new random order each time, so learners can't memorize positions.
  // Keys stay as original indices, which is what exercise.correct refers to.
  const [order] = useState(() => (exercise.type === "choice" ? shuffledIndices(exercise.options.length) : []));
  const answered = picked !== null;
  const correctKey = exercise.type === "choice" ? String(exercise.correct) : exercise.correct;
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
    // Sound repeats the verdict that's also shown in text and color; it's never the only cue.
    play(key === correctKey ? "correct" : "wrong");
    count(key === correctKey ? "exercise_right" : "exercise_wrong", exercise.id);
    onAnswer(key === correctKey);
  }

  const stateClass = (key: string) =>
    !answered ? "" : key === correctKey ? "right" : key === picked ? "wrong" : "";

  // Right and wrong are shown in words as well as color.
  const [mine, right] = exercise.type === "spot" ? ["Your pick", "The problem"] : ["Your answer", "Correct answer"];
  const verdict = (key: string) =>
    !answered ? null : key === correctKey ? (key === picked ? `${mine}: correct` : right) : key === picked ? mine : null;
  const verdictMark = (key: string) => {
    const text = verdict(key);
    if (!text) return null;
    return (
      <span className={`verdict ${key === correctKey ? "right" : "wrong"}`}>
        <span aria-hidden="true">{key === correctKey ? "✓" : "✗"}</span> {text}
      </span>
    );
  };
  const eyebrow = [position, source].filter(Boolean).join(" · ");

  const spotPart = (part: SpotPart) => (
    <button
      key={part.id}
      type="button"
      className={`spot-part ${stateClass(part.id)}`}
      disabled={answered}
      onClick={() => pick(part.id)}
      // The label already includes the part's visible text, so no aria-describedby (it would be read twice).
      aria-label={`${part.label}${verdict(part.id) ? `, ${verdict(part.id)!.toLowerCase()}` : ""}`}
    >
      {verdictMark(part.id)}
      <Mockup html={part.html} />
    </button>
  );

  return (
    <section>
      {exercise.type === "compare" ? (
        <>
          <div className="eyebrow">{`${eyebrow} · Which is better?`}</div>
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
                // The description stands in for the mockup, which often differs from the other one only visually.
                aria-label={`Design ${k.toUpperCase()}${verdict(k) ? `, ${verdict(k)!.toLowerCase()}` : ""}: ${exercise.describe[k]}`}
              >
                <span className="tag">
                  {k.toUpperCase()}
                  {verdictMark(k)}
                </span>
                <Mockup html={exercise[k]} />
              </button>
            ))}
          </div>
        </>
      ) : exercise.type === "spot" ? (
        <>
          <div className="eyebrow">{`${eyebrow} · Spot the problem`}</div>
          <h1 className="q">{exercise.question}</h1>
          <p className="qhint">Select the part of the screen with the problem.</p>
          <div className="mk spot" role="group" aria-label="Screen to check">
            {exercise.title && <div className="mk-title">{exercise.title}</div>}
            {exercise.parts.map((row, i) =>
              Array.isArray(row) ? (
                <div className="spot-row" key={i}>
                  {row.map(spotPart)}
                </div>
              ) : (
                spotPart(row)
              ),
            )}
          </div>
        </>
      ) : (
        <>
          <div className="eyebrow">{`${eyebrow} · Question`}</div>
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
            {/* Read as one item, so VoiceOver doesn't stop after the bold verdict. */}
            <Spoken text={[isCorrect ? "Right." : "Not quite.", exercise.why, note].filter(Boolean).join(" ")}>
              <strong>{isCorrect ? "Right." : "Not quite."}</strong> {exercise.why}
              {note && <span className="feedback-note">{note}</span>}
            </Spoken>
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
