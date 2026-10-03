import { useEffect, useRef, useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import RewardsList from "../components/RewardsList";
import { announceScreen } from "../lib/focus";
import { practiceSet } from "../lib/practice";
import { completePractice, dayKey, recordPracticeAnswer, type Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";
import type { UpdateProgress } from "../lib/useProgress";

type Props = { progress: Progress; update: UpdateProgress };

/** Today's practice: a few exercises from finished lessons. */
export default function PracticePage({ progress, update }: Props) {
  // Done already today (here or on another device): one set a day.
  const [alreadyDone] = useState(() => progress.practiceDay === dayKey(new Date()));
  // Snapshot the set when practice starts, so answering doesn't change it.
  const [queue] = useState(() => (alreadyDone ? [] : practiceSet(progress, new Date())));
  const [before] = useState(progress);
  const [index, setIndex] = useState(0);
  const [right, setRight] = useState(0);

  const firstIndex = useRef(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstIndex.current) {
      firstIndex.current = false;
      return;
    }
    announceScreen(index >= queue.length ? "Practice complete" : `Practice ${index + 1} of ${queue.length}`);
  }, [index, queue.length]);

  if (queue.length === 0 || index >= queue.length) {
    return (
      <section className="panel done-card">
        <div className="eyebrow">Daily practice</div>
        <h1 className="done-title">{alreadyDone ? "Done for today" : queue.length === 0 ? "Nothing to practice yet" : "Practice complete"}</h1>
        {alreadyDone ? (
          <p>You've finished today's practice. A new set will be ready tomorrow.</p>
        ) : queue.length === 0 ? (
          <p>Finish a couple of lessons first. Daily practice mixes exercises from lessons you've finished.</p>
        ) : (
          <>
            <div className="big">{`${right} of ${queue.length} right`}</div>
            <p>A new set will be ready tomorrow.</p>
            <RewardsList before={before} after={progress} />
          </>
        )}
        <div className="actions">
          <a className="btn" href={hrefFor({ name: "home" })}>
            Home
          </a>
        </div>
      </section>
    );
  }

  const { lesson, exercise } = queue[index];
  const last = index === queue.length - 1;
  return (
    <>
      <div>
        <a className="back" href={hrefFor({ name: "home" })}>
          <span aria-hidden="true">←</span> Home
        </a>
      </div>
      <ExerciseCard
        key={exercise.id}
        source={lesson.title}
        position={`Practice ${index + 1} of ${queue.length}`}
        exercise={exercise}
        nextLabel={last ? "Finish practice" : "Next"}
        noteFor={(correct) => (correct ? null : "Added to your review pile, so you can practice it again.")}
        onAnswer={(correct) => {
          if (correct) setRight((n) => n + 1);
          const now = new Date();
          // The last answer finishes the practice, so leaving before "Finish practice" loses nothing.
          update((p) => {
            const answered = recordPracticeAnswer(p, exercise.id, correct, now);
            return last ? completePractice(answered, now) : answered;
          });
        }}
        onNext={() => setIndex((i) => i + 1)}
      />
    </>
  );
}
