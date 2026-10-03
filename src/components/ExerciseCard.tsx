import { useEffect, useId, useRef, useState } from "react";
import type { Exercise, SpotPart } from "../content/types";
import { shuffledIndices } from "../lib/shuffle";
import { count } from "../lib/analytics";
import { play } from "../lib/useSound";
import FeedbackButton from "./FeedbackButton";
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
  /**
   * Challenge mode: answers are saved without showing right or wrong, an explanation or a sound;
   * the results screen shows them all at the end.
   */
  quiz?: boolean;
};

/** One exercise. Remount with key={exercise.id} to reset between exercises. */
export default function ExerciseCard({ source, position, exercise, nextLabel, noteFor, onAnswer, onNext, quiz = false }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  // Choice options and sort items appear in a new random order each time, so learners can't memorize
  // positions. Keys stay as original indices, which is what exercise.correct refers to.
  const [order] = useState(() =>
    exercise.type === "choice" ? shuffledIndices(exercise.options.length) : exercise.type === "sort" ? shuffledIndices(exercise.items.length) : [],
  );
  // Sort exercises: the group chosen for each item, and a message if some are left unplaced.
  const [placed, setPlaced] = useState<Record<string, 0 | 1>>({});
  // Items left without a group when the learner pressed Check answers.
  const [unplaced, setUnplaced] = useState<string[]>([]);
  const answered = picked !== null;
  const correctKey = exercise.type === "choice" ? String(exercise.correct) : exercise.type === "sort" ? "all" : exercise.correct;
  const isCorrect = picked === correctKey;
  const sortRight = exercise.type === "sort" ? exercise.items.filter((i) => placed[i.id] === i.group).length : 0;
  const sortSummary = exercise.type === "sort" && answered && !quiz ? `${sortRight} of ${exercise.items.length} in the right group.` : null;

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
    if (!quiz) play(key === correctKey ? "correct" : "wrong");
    count(key === correctKey ? "exercise_right" : "exercise_wrong", exercise.id);
    onAnswer(key === correctKey);
  }

  function checkSort() {
    if (exercise.type !== "sort" || answered) return;
    const missing = order.map((i) => exercise.items[i]).filter((item) => placed[item.id] === undefined);
    if (missing.length) {
      setUnplaced(missing.map((m) => m.id));
      document.getElementById(`${uid}-${missing[0].id}-0`)?.focus();
      return;
    }
    pick(exercise.items.every((i) => placed[i.id] === i.group) ? "all" : "some");
  }

  // In challenge mode, only the chosen answer is marked, neutrally.
  const reveal = answered && !quiz;
  const stateClass = (key: string) =>
    !answered ? "" : quiz ? (key === picked ? "chosen" : "") : key === correctKey ? "right" : key === picked ? "wrong" : "";

  // Right and wrong are shown in words as well as color.
  const [mine, right] = exercise.type === "spot" ? ["Your pick", "The problem"] : ["Your answer", "Correct answer"];
  const verdict = (key: string) =>
    !answered ? null : quiz ? (key === picked ? mine : null) : key === correctKey ? (key === picked ? `${mine}: correct` : right) : key === picked ? mine : null;
  const verdictMark = (key: string) => {
    const text = verdict(key);
    if (!text) return null;
    return (
      <span className={`verdict ${quiz ? "chosen" : key === correctKey ? "right" : "wrong"}`}>
        {!quiz && <span aria-hidden="true">{key === correctKey ? "✓" : "✗"}</span>} {text}
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
      ) : exercise.type === "sort" ? (
        <>
          <div className="eyebrow">{`${eyebrow} · Sort into groups`}</div>
          <h1 className="q">{exercise.question}</h1>
          <p className="qhint">{`Put each item in a group: ${exercise.groups[0]} or ${exercise.groups[1]}.`}</p>
          <ul className="sort-items">
            {order.map((i) => {
              const item = exercise.items[i];
              const choice = placed[item.id];
              const ok = choice === item.group;
              return (
                <li key={item.id} className={`sort-item ${reveal ? (ok ? "right" : "wrong") : ""} ${unplaced.includes(item.id) ? "missing" : ""}`}>
                  <fieldset aria-describedby={unplaced.includes(item.id) ? `${uid}-${item.id}-error` : undefined}>
                    <legend className="sort-text">{item.text}</legend>
                    {unplaced.includes(item.id) && (
                      <p className="form-error" id={`${uid}-${item.id}-error`}>
                        <span className="visually-hidden">Error: </span>
                        Choose a group for this item
                      </p>
                    )}
                    <div className="sort-options">
                      {exercise.groups.map((g, gi) => (
                        <label key={g} className={`sort-option ${choice === gi ? "chosen" : ""}`}>
                          <input
                            id={`${uid}-${item.id}-${gi}`}
                            type="radio"
                            name={`${uid}-${item.id}`}
                            checked={choice === gi}
                            disabled={answered}
                            onChange={() => {
                              setPlaced((p) => ({ ...p, [item.id]: gi as 0 | 1 }));
                              setUnplaced((u) => u.filter((id) => id !== item.id));
                            }}
                          />
                          <span>{g}</span>
                        </label>
                      ))}
                    </div>
                    {reveal && (
                      <p className={`verdict ${ok ? "right" : "wrong"}`}>
                        <span aria-hidden="true">{ok ? "✓" : "✗"}</span> {ok ? "Right" : `Belongs in: ${exercise.groups[item.group]}`}
                      </p>
                    )}
                  </fieldset>
                </li>
              );
            })}
          </ul>
          {!answered && (
            <div className="actions sort-check">
              <button className="btn" type="button" onClick={checkSort}>
                Check answers
              </button>
              <p className="form-error" role="status">
                {unplaced.length > 0 && `${unplaced.length} ${unplaced.length === 1 ? "item still needs" : "items still need"} a group.`}
              </p>
            </div>
          )}
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

      {answered && quiz && (
        <>
          <div className="feedback neutral" ref={feedbackRef} tabIndex={-1}>
            Answer saved. You'll see how you did at the end.
          </div>
          <div className="actions">
            <button className="btn" type="button" onClick={onNext}>
              {nextLabel}
            </button>
          </div>
        </>
      )}
      {reveal && (
        <>
          <div className={`feedback ${isCorrect ? "good" : "bad"}`} ref={feedbackRef} tabIndex={-1}>
            {/* Read as one item, so VoiceOver doesn't stop after the bold verdict. */}
            <Spoken text={[isCorrect ? "Right." : "Not quite.", sortSummary, exercise.why, note].filter(Boolean).join(" ")}>
              <strong>{isCorrect ? "Right." : "Not quite."}</strong> {sortSummary && `${sortSummary} `}
              {exercise.why}
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
      <FeedbackButton target={{ type: "exercise", id: exercise.id, title: exercise.question }} />
    </section>
  );
}
