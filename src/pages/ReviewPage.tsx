import { useEffect, useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { findExercise } from "../content/paths";
import { recordActivity, recordReviewAnswer, type Progress } from "../lib/progress";
import type { UpdateProgress } from "../lib/useProgress";
import { hrefFor } from "../lib/route";

type Props = { progress: Progress; update: UpdateProgress };

export default function ReviewPage({ progress, update }: Props) {
  // Snapshot the queue when review starts so answering doesn't reshuffle it.
  const [queue] = useState(() =>
    Object.keys(progress.review)
      .map(findExercise)
      .filter((x): x is NonNullable<typeof x> => Boolean(x)),
  );
  const [index, setIndex] = useState(0);
  const [right, setRight] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [index]);

  function next() {
    if (index === queue.length - 1) update((p) => recordActivity(p, new Date()));
    setIndex((i) => i + 1);
  }

  if (queue.length === 0 || index >= queue.length) {
    const left = Object.keys(progress.review).length;
    return (
      <section className="panel done-card">
        <div className="eyebrow">{queue.length === 0 ? "Nothing to review" : "Review complete"}</div>
        {queue.length > 0 && (
          <div className="big">
            {right}/{queue.length}
          </div>
        )}
        <p>{left ? `${left} still in your review pile.` : "Your review pile is empty."}</p>
        <div className="actions">
          <a className="btn" href={hrefFor({ name: "home" })}>
            All lessons
          </a>
        </div>
      </section>
    );
  }

  const { lesson, exercise } = queue[index];
  return (
    <>
      <div>
        <a className="back" href={hrefFor({ name: "home" })}>
          ← All lessons
        </a>
        <div className="eyebrow review-count">
          Review {index + 1} of {queue.length}
        </div>
      </div>
      <ExerciseCard
        key={exercise.id}
        code={lesson.code}
        exercise={exercise}
        nextLabel={index === queue.length - 1 ? "Finish review" : "Next"}
        onAnswer={(correct) => {
          if (correct) setRight((n) => n + 1);
          update((p) => recordReviewAnswer(p, exercise.id, correct));
        }}
        onNext={next}
      />
    </>
  );
}
