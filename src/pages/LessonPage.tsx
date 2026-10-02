import { useEffect, useRef, useState } from "react";
import type { LearningPath, Lesson } from "../content/types";
import Burst from "../components/Burst";
import ExerciseCard from "../components/ExerciseCard";
import { lessonScenes } from "../art/scenes";
import { XP, completeLesson, recordActivity, recordLessonAnswer, type Progress } from "../lib/progress";
import type { UpdateProgress } from "../lib/useProgress";
import { announceScreen } from "../lib/focus";
import { hrefFor } from "../lib/route";

type Props = {
  lesson: Lesson;
  path: LearningPath;
  progress: Progress;
  update: UpdateProgress;
};

/** Steps: 0 = reading, 1..n = exercises, n + 1 = done. */
export default function LessonPage({ lesson, path, progress, update }: Props) {
  const [step, setStep] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [wasComplete] = useState(() => Boolean(progress.completedLessons[lesson.id]));
  const total = lesson.exercises.length;
  const doneStep = total + 1;

  // Each step replaces the whole screen, so announce it like a new page (the route change covers step 0).
  const firstStep = useRef(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const where = step === doneStep ? "Complete" : `Exercise ${step} of ${total}`;
    announceScreen(`${where} · ${lesson.code} ${lesson.title}`);
  }, [step, doneStep, total, lesson.code, lesson.title]);

  function next() {
    if (step === total) update((p) => recordActivity(completeLesson(p, lesson.id), new Date()));
    setStep((s) => s + 1);
  }

  const licenses = lesson.sources
    .flatMap((s) => s.license ?? [])
    .filter((l, i, all) => all.findIndex((x) => x.url === l.url) === i);
  const nextLesson = path.lessons.find((l) => l.id !== lesson.id && !progress.completedLessons[l.id]);

  return (
    <>
      <div>
        <a className="back" href={hrefFor({ name: "home" })}>
          ← All lessons
        </a>
        {/* Visual only: the eyebrow on each screen says "Exercise 1 of 2" in text. */}
        <div className="steps" aria-hidden="true">
          {Array.from({ length: total + 2 }, (_, i) => (
            <i key={i} className={i <= step ? "on" : ""} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <article className="lesson">
          <div className="eyebrow">{lesson.code} · Lesson</div>
          <h1>{lesson.title}</h1>
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
            <button className="btn" type="button" onClick={next}>
              Start practice ({total} exercises)
            </button>
          </div>
        </article>
      )}

      {step >= 1 && step <= total && (
        <ExerciseCard
          key={lesson.exercises[step - 1].id}
          code={lesson.code}
          position={`Exercise ${step} of ${total}`}
          exercise={lesson.exercises[step - 1]}
          nextLabel={step === total ? "Finish lesson" : "Next exercise"}
          noteFor={(correct) => (correct ? null : "Added to your review pile, so you can practice it again.")}
          onAnswer={(correct) => {
            if (correct) setFirstTry((n) => n + 1);
            update((p) => recordLessonAnswer(p, lesson.exercises[step - 1].id, correct, new Date()));
          }}
          onNext={next}
        />
      )}

      {step === doneStep && (
        <section className="panel done-card">
          <div className="eyebrow">{lesson.code} complete</div>
          <h1 className="done-title">{lesson.title}: done</h1>
          <Burst>
            <div className="big">+{firstTry * XP.correctFirstTry + (wasComplete ? 0 : XP.lessonComplete)} XP</div>
          </Burst>
          <p>
            {firstTry} of {total} right on the first try.
            {firstTry < total && " Missed exercises are waiting in your review pile."}
          </p>
          <div className="actions">
            {nextLesson && (
              <a className="btn" href={hrefFor({ name: "lesson", id: nextLesson.id })}>
                Next: {nextLesson.code} {nextLesson.title}
              </a>
            )}
            <a className="btn ghost" href={hrefFor({ name: "home" })}>
              All lessons
            </a>
          </div>
        </section>
      )}
    </>
  );
}
