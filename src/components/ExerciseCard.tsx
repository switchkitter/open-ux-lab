import { useEffect, useId, useRef, useState } from "react";
import type { Exercise } from "../content/types";
import { shuffledIndices } from "../lib/shuffle";
import Mockup from "./Mockup";

type Props = {
  /** Shown in the eyebrow, e.g. "H1" */
  code: string;
  exercise: Exercise;
  nextLabel: string;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
};

/** One exercise. Remount with key={exercise.id} to reset between exercises. */
export default function ExerciseCard({ code, exercise, nextLabel, onAnswer, onNext }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const uid = useId();
  // Choice options appear in a new random order each time, so learners can't memorize positions.
  // Keys stay as original indices, which is what exercise.correct refers to.
  const [order] = useState(() => (exercise.type === "choice" ? shuffledIndices(exercise.options.length) : []));
  const answered = picked !== null;
  const correctKey = exercise.type === "compare" ? exercise.correct : String(exercise.correct);
  const isCorrect = picked === correctKey;

  useEffect(() => {
    if (answered) nextRef.current?.focus();
  }, [answered]);

  function pick(key: string) {
    if (answered) return;
    setPicked(key);
    onAnswer(key === correctKey);
  }

  const stateClass = (key: string) =>
    !answered ? "" : key === correctKey ? "right" : key === picked ? "wrong" : "";

  return (
    <section>
      {exercise.type === "compare" ? (
        <>
          <div className="eyebrow">{code} · Which is better?</div>
          <p className="q">{exercise.question}</p>
          <p className="qhint">Pick a design.</p>
          <div className="pair">
            {(["a", "b"] as const).map((k) => (
              <button
                key={k}
                type="button"
                className={`choice ${stateClass(k)}`}
                disabled={answered}
                onClick={() => pick(k)}
                aria-label={`Design ${k.toUpperCase()}`}
                aria-describedby={`${uid}-${k}`}
              >
                <span className="tag">{k.toUpperCase()}</span>
                <Mockup id={`${uid}-${k}`} html={exercise[k]} />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="eyebrow">{code} · Question</div>
          <p className="q">{exercise.question}</p>
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
              </button>
            ))}
          </div>
        </>
      )}

      {answered && (
        <>
          <div className={`feedback ${isCorrect ? "good" : "bad"}`} role="status">
            <strong>{isCorrect ? "Right." : "Not quite."}</strong>
            {exercise.why}
          </div>
          <div className="actions">
            <button ref={nextRef} className="btn" type="button" onClick={onNext}>
              {nextLabel}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
