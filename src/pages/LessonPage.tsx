import { useEffect, useRef, useState } from "react";
import LoadingScreen, { useRefocusAfterLoad } from "../components/LoadingScreen";
import { useLesson } from "../content/load";
import type { Lesson, PathMeta } from "../content/types";
import Burst from "../components/Burst";
import ExerciseCard from "../components/ExerciseCard";
import FeedbackButton from "../components/FeedbackButton";
import RewardsList from "../components/RewardsList";
import Spoken from "../components/Spoken";
import { lessonScenes } from "../art";
import { XP, completeLesson, recordActivity, recordLessonAnswer, type Progress } from "../lib/progress";
import type { UpdateProgress } from "../lib/useProgress";
import { count } from "../lib/analytics";
import { announceScreen } from "../lib/focus";
import { clearPlace, loadPlace, savePlace } from "../lib/lessonPlace";
import { play } from "../lib/useSound";
import { hrefFor } from "../lib/route";

type Props = {
  lesson: Lesson;
  path: PathMeta;
  progress: Progress;
  update: UpdateProgress;
};

/** Loads the lesson (its path's file), showing its title straight away. */
export default function LessonPage({ lessonId, path, progress, update }: Omit<Props, "lesson"> & { lessonId: string }) {
  const loaded = useLesson(path.id, lessonId);
  useRefocusAfterLoad(loaded.state === "ready");
  if (loaded.state !== "ready" || !loaded.value) {
    const index = path.lessons.findIndex((l) => l.id === lessonId);
    return (
      <LoadingScreen
        back={
          <a className="back" href={hrefFor({ name: "path", id: path.id })}>
            <span aria-hidden="true">←</span> {path.title}
          </a>
        }
        eyebrow={`${path.title} · Lesson ${index + 1} of ${path.lessons.length}`}
        title={path.lessons[index]?.title ?? ""}
        state={loaded.state === "ready" ? { state: "loading" } : loaded}
      />
    );
  }
  return <LessonSession lesson={loaded.value} path={path} progress={progress} update={update} />;
}

/** Steps: 0 = reading, 1..n = exercises, n + 1 = done. */
function LessonSession({ lesson, path, progress, update }: Props) {
  const total = lesson.exercises.length;
  const doneStep = total + 1;
  const [step, setStep] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [wasComplete] = useState(() => Boolean(progress.completedLessons[lesson.id]));
  // Progress when the lesson opened, to show what was earned on the done screen.
  const [before] = useState(progress);
  // Where the learner stopped last time, if they left partway through the exercises.
  const [place, setPlace] = useState(() => loadPlace(lesson.id, total));

  useEffect(() => count("lesson_opened", lesson.id), [lesson.id]);

  // Each step replaces the whole screen, so announce it like a new page (the route change covers step 0).
  const firstStep = useRef(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const where = step === doneStep ? "Complete" : `Exercise ${step} of ${total}`;
    announceScreen(`${where} · ${lesson.title}`);
  }, [step, doneStep, total, lesson.title]);

  function next() {
    if (step === total) play("complete");
    setStep((s) => s + 1);
  }

  function startPractice() {
    clearPlace(lesson.id);
    setPlace(null);
    setFirstTry(0);
    setStep(1);
  }

  function resume() {
    if (!place) return;
    setFirstTry(place.firstTry);
    setStep(place.step);
  }

  function dismissPlace() {
    clearPlace(lesson.id);
    setPlace(null);
    announceScreen(lesson.title);
  }

  // Answers are saved as they're given. The last answer also completes the lesson, so leaving before
  // pressing "Finish lesson" loses nothing; earlier answers save the place to continue from.
  function answer(correct: boolean) {
    const exercise = lesson.exercises[step - 1];
    const right = firstTry + (correct ? 1 : 0);
    setFirstTry(right);
    const now = new Date();
    if (step === total) {
      clearPlace(lesson.id);
      update((p) => recordActivity(completeLesson(recordLessonAnswer(p, exercise.id, correct, now, exercise.type), lesson.id, now, right === total), now));
      count("lesson_completed", lesson.id);
    } else {
      savePlace(lesson.id, { step: step + 1, firstTry: right });
      update((p) => recordLessonAnswer(p, exercise.id, correct, now, exercise.type));
    }
  }

  const licenses = lesson.sources
    .flatMap((s) => s.license ?? [])
    .filter((l, i, all) => all.findIndex((x) => x.url === l.url) === i);
  const nextLesson = path.lessons.find((l) => l.id !== lesson.id && !progress.completedLessons[l.id]);

  return (
    <>
      <div>
        <a className="back" href={hrefFor({ name: "path", id: path.id })}>
          <span aria-hidden="true">←</span> {path.title}
        </a>
        {/* Visual only: the eyebrow on each screen says "Exercise 1 of 2" in text. */}
        <div className="steps" aria-hidden="true">
          {Array.from({ length: total + 2 }, (_, i) => (
            <i key={i} className={i <= step ? "on" : ""} />
          ))}
        </div>
        {step >= 1 && step <= total && <p className="saved-note">Your answers are saved as you go, so you can leave and continue later.</p>}
      </div>

      {step === 0 && (
        <article className="lesson">
          <div className="eyebrow">
            {`${path.title} · Lesson ${path.lessons.findIndex((l) => l.id === lesson.id) + 1} of ${path.lessons.length}`}
          </div>
          <h1>{lesson.title}</h1>
          {place && (
            <div className="panel resume">
              <p>
                <Spoken text={`You stopped at exercise ${place.step} of ${total}. Your earlier answers are saved.`}>
                  <strong>{`You stopped at exercise ${place.step} of ${total}.`}</strong> Your earlier answers are saved.
                </Spoken>
              </p>
              <div className="actions">
                <button className="btn" type="button" onClick={resume}>
                  {`Continue from exercise ${place.step}`}
                </button>
                <button className="btn ghost" type="button" onClick={dismissPlace}>
                  Start again
                </button>
              </div>
            </div>
          )}
          {lessonScenes[lesson.id] && <figure className="scene">{lessonScenes[lesson.id]}</figure>}
          <div className="prose">
            {lesson.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <h2>In practice</h2>
            <ul>
              {lesson.practice.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="field">
              <b>Try it at work</b>
              {lesson.fieldExercise}
            </div>
            <div className="sources">
              Read more:{" "}
              {lesson.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title} <span aria-hidden="true">↗</span>
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              ))}
              {licenses.length > 0 && (
                <p className="license-note">
                  Linked guidance is published under{" "}
                  {licenses.map((l, i) => (
                    <span key={l.url}>
                      {i > 0 && " and "}
                      <a href={l.url} target="_blank" rel="noopener noreferrer">
                        {l.name}
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    </span>
                  ))}
                  . This lesson's text is our own summary.
                </p>
              )}
            </div>
          </div>
          <div className="actions">
            <button className={place ? "btn ghost" : "btn"} type="button" onClick={startPractice}>
              {`Start practice (${total} exercises)`}
            </button>
          </div>
          <FeedbackButton target={{ type: "lesson", id: lesson.id, title: lesson.title }} />
        </article>
      )}

      {step >= 1 && step <= total && (
        <ExerciseCard
          key={lesson.exercises[step - 1].id}
          position={`Exercise ${step} of ${total}`}
          exercise={lesson.exercises[step - 1]}
          nextLabel={step === total ? "Finish lesson" : "Next exercise"}
          noteFor={(correct) => (correct ? null : "Added to your review pile, so you can practice it again.")}
          onAnswer={answer}
          onNext={next}
        />
      )}

      {step === doneStep && (
        <section className="panel done-card">
          <div className="eyebrow">Lesson complete</div>
          <h1 className="done-title">{`${lesson.title}: done`}</h1>
          <Burst>
            <div className="big">{`+${firstTry * XP.correctFirstTry + (wasComplete ? 0 : XP.lessonComplete)} XP`}</div>
          </Burst>
          {/* One string per sentence: VoiceOver on iPhone reads each JSX text piece as a separate item. */}
          <p>{`${firstTry} of ${total} right on the first try.`}</p>
          {firstTry < total && <p>Missed exercises are waiting in your review pile.</p>}
          <RewardsList before={before} after={progress} />
          {path.lessons.every((l) => progress.completedLessons[l.id]) && (
            <p className="notice">
              {`You've finished every lesson in ${path.title}. `}
              <a href={hrefFor({ name: "challenge", id: path.id })}>Take the path challenge to earn your certificate</a>
            </p>
          )}
          <div className="actions">
            {nextLesson && (
              <a className="btn" href={hrefFor({ name: "lesson", id: nextLesson.id })}>
                Next: {nextLesson.title}
              </a>
            )}
            <a className="btn ghost" href={hrefFor({ name: "path", id: path.id })}>
              Back to {path.title}
            </a>
          </div>
        </section>
      )}
    </>
  );
}
