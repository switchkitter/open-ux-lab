import { useEffect, useRef, useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import LoadingScreen, { useRefocusAfterLoad } from "../components/LoadingScreen";
import RewardsList from "../components/RewardsList";
import { useExercises } from "../content/load";
import type { Exercise, Lesson } from "../content/types";
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
  const [ids] = useState(() => (alreadyDone ? [] : practiceSet(progress, new Date()).map((i) => i.exercise.id)));
  const loaded = useExercises(ids);
  useRefocusAfterLoad(loaded.state === "ready");
  if (loaded.state !== "ready") {
    return <LoadingScreen back={<a className="back" href={hrefFor({ name: "home" })}>
        <span aria-hidden="true">←</span> Home
      </a>} eyebrow="Daily practice" title="Daily practice" state={loaded} />;
  }
  return <PracticeSession progress={progress} update={update} queue={loaded.value} alreadyDone={alreadyDone} />;
}

type SessionProps = Props & { queue: { lesson: Lesson; exercise: Exercise }[]; alreadyDone: boolean };

function PracticeSession({ progress, update, queue, alreadyDone }: SessionProps) {
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
