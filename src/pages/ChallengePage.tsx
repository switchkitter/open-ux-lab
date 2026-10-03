import { useEffect, useRef, useState } from "react";
import CertificateOffer from "../components/CertificateOffer";
import ExerciseCard from "../components/ExerciseCard";
import LoadingScreen, { useRefocusAfterLoad } from "../components/LoadingScreen";
import RewardsList from "../components/RewardsList";
import Spoken from "../components/Spoken";
import { useExercises } from "../content/load";
import type { Exercise, Lesson, PathMeta } from "../content/types";
import { announceScreen } from "../lib/focus";
import { challengeSet } from "../lib/practice";
import { CHALLENGE_PASS, completeChallenge, recordChallengeAnswer, type Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";
import type { UpdateProgress } from "../lib/useProgress";

type Props = { path: PathMeta; progress: Progress; update: UpdateProgress };
type Item = { lesson: Lesson; exercise: Exercise };

/** A scored round from across a finished path. Passing it unlocks the path's certificate. */
export default function ChallengePage({ path, progress, update }: Props) {
  // Each attempt gets a new random set; "Try again" starts a new attempt.
  const [attempt, setAttempt] = useState(0);
  const finished = path.lessons.every((l) => progress.completedLessons[l.id]);
  const back = (
    <a className="back" href={hrefFor({ name: "path", id: path.id })}>
      <span aria-hidden="true">←</span> {path.title}
    </a>
  );

  if (!finished) {
    const left = path.lessons.filter((l) => !progress.completedLessons[l.id]).length;
    return (
      <>
        {back}
        <section className="panel">
          <div className="eyebrow">Path challenge</div>
          <h1 className="page-title">Finish the path first</h1>
          <p>{`The challenge covers every lesson in ${path.title}, so it opens when you've finished them all. ${left} ${left === 1 ? "lesson" : "lessons"} to go.`}</p>
        </section>
      </>
    );
  }
  return <ChallengeAttempt key={attempt} path={path} progress={progress} update={update} back={back} onRetry={() => setAttempt((n) => n + 1)} />;
}

function ChallengeAttempt({ path, progress, update, back, onRetry }: Props & { back: React.ReactNode; onRetry: () => void }) {
  const [ids] = useState(() => challengeSet(path).map((i) => i.exercise.id));
  const loaded = useExercises(ids);
  useRefocusAfterLoad(loaded.state === "ready");
  if (loaded.state !== "ready") {
    return <LoadingScreen back={back} eyebrow="Path challenge" title={path.title} state={loaded} />;
  }
  return <ChallengeSession path={path} progress={progress} update={update} queue={loaded.value} back={back} onRetry={onRetry} />;
}

type SessionProps = Props & { queue: Item[]; back: React.ReactNode; onRetry: () => void };

function ChallengeSession({ path, progress, update, queue, back, onRetry }: SessionProps) {
  const [before] = useState(progress);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const total = queue.length;
  const score = results.filter(Boolean).length;
  const passed = score >= CHALLENGE_PASS;

  const firstIndex = useRef(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstIndex.current) {
      firstIndex.current = false;
      return;
    }
    announceScreen(index >= total ? "Challenge results" : `Question ${index + 1} of ${total} · Path challenge`);
  }, [index, total]);

  if (index >= total) {
    return (
      <>
        {back}
        <section className="panel done-card challenge-results">
          <div className="eyebrow">{`Path challenge · ${path.title}`}</div>
          <h1 className="done-title">{passed ? "You passed" : "Not this time"}</h1>
          <div className="big">{`${score} of ${total}`}</div>
          <p>
            {passed
              ? "You've earned your certificate for this path."
              : `You need ${CHALLENGE_PASS} of ${total} to pass. The questions you missed are in your review pile, so review them, then try again.`}
          </p>
          <RewardsList before={before} after={progress} />
          <div className="actions">
            <button className={passed ? "btn ghost" : "btn"} type="button" onClick={onRetry}>
              {passed ? "Take it again" : "Try again"}
            </button>
            <a className="btn ghost" href={hrefFor({ name: "path", id: path.id })}>
              {`Back to ${path.title}`}
            </a>
          </div>
        </section>

        {passed && <CertificateOffer path={path} />}

        <section aria-labelledby="answers-heading">
          <h2 id="answers-heading" className="lessons-heading">
            Your answers
          </h2>
          <ol className="challenge-answers">
            {queue.map(({ lesson, exercise }, i) => (
              <li key={exercise.id} className={`panel ${results[i] ? "right" : "wrong"}`}>
                <p className="challenge-q">{exercise.question}</p>
                <p className={`verdict ${results[i] ? "right" : "wrong"}`}>
                  <Spoken text={`${results[i] ? "Right" : "Missed"}, from ${lesson.title}`}>
                    <span aria-hidden="true">{results[i] ? "✓" : "✗"}</span> {results[i] ? "Right" : "Missed"} · {lesson.title}
                  </Spoken>
                </p>
                {!results[i] && <p className="challenge-why">{exercise.why}</p>}
              </li>
            ))}
          </ol>
        </section>

      </>
    );
  }

  const { lesson, exercise } = queue[index];
  const last = index === total - 1;
  return (
    <>
      {back}
      <ExerciseCard
        key={exercise.id}
        quiz
        source={lesson.title}
        position={`Challenge ${index + 1} of ${total}`}
        exercise={exercise}
        nextLabel={last ? "See results" : "Next question"}
        onAnswer={(correct) => {
          const all = [...results, correct];
          setResults(all);
          const now = new Date();
          // The last answer records the result, so leaving before "See results" loses nothing.
          update((p) => {
            const answered = recordChallengeAnswer(p, exercise.id, correct, now);
            return last ? completeChallenge(answered, path.id, all.filter(Boolean).length, now) : answered;
          });
        }}
        onNext={() => setIndex((i) => i + 1)}
      />
    </>
  );
}
