import { useEffect, useRef, useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { findExercise } from "../content/paths";
import { dueReviewIds, nextReview, recordActivity, recordReviewAnswer, reviewOutcome, whenLabel, type Progress } from "../lib/progress";
import type { UpdateProgress } from "../lib/useProgress";
import { count } from "../lib/analytics";
import { announceScreen } from "../lib/focus";
import { hrefFor } from "../lib/route";

type Props = { progress: Progress; update: UpdateProgress };

export default function ReviewPage({ progress, update }: Props) {
  // Snapshot the due items when review starts so answering doesn't reshuffle the queue.
  const [queue] = useState(() =>
    dueReviewIds(progress, new Date())
      .map(findExercise)
      .filter((x): x is NonNullable<typeof x> => Boolean(x)),
  );
  const [index, setIndex] = useState(0);
  const [right, setRight] = useState(0);

  const firstIndex = useRef(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstIndex.current) {
      firstIndex.current = false;
      return;
    }
    announceScreen(index >= queue.length ? "Review complete" : `Review ${index + 1} of ${queue.length}`);
  }, [index, queue.length]);

  function next() {
    if (index === queue.length - 1) {
      update((p) => recordActivity(p, new Date()));
      count("review_completed");
    }
    setIndex((i) => i + 1);
  }

  if (queue.length === 0 || index >= queue.length) {
    return (
      <section className="panel done-card">
        <div className="eyebrow">Review</div>
        <h1 className="done-title">{queue.length === 0 ? "Nothing to review" : "Review complete"}</h1>
        {queue.length > 0 && (
          <div className="big">{`${right} of ${queue.length} right`}</div>
        )}
        <p>{scheduleSummary(progress)}</p>
        <div className="actions">
          <a className="btn" href={hrefFor({ name: "home" })}>
            Home
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
          ← Home
        </a>
      </div>
      <ExerciseCard
        key={exercise.id}
        source={lesson.title}
        position={`Review ${index + 1} of ${queue.length}`}
        exercise={exercise}
        nextLabel={index === queue.length - 1 ? "Finish review" : "Next"}
        noteFor={(correct) => reviewOutcome(progress, exercise.id, correct)}
        onAnswer={(correct) => {
          if (correct) setRight((n) => n + 1);
          update((p) => recordReviewAnswer(p, exercise.id, correct, new Date()));
        }}
        onNext={next}
      />
    </>
  );
}

function scheduleSummary(progress: Progress): string {
  const now = new Date();
  const dueNow = dueReviewIds(progress, now).length;
  const upcoming = nextReview(progress, now);
  if (dueNow) return `${dueNow} still due today.`;
  if (!upcoming) return "Your review pile is empty.";
  const total = Object.keys(progress.review).length;
  return `Next review ${whenLabel(upcoming.day, now)} (${upcoming.count} ${upcoming.count === 1 ? "exercise" : "exercises"}). ${total} in your review pile in total.`;
}
