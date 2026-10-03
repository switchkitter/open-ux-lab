import { lessonIcons } from "../art";
import type { PathMeta } from "../content/types";
import type { Progress } from "../lib/progress";
import { hrefFor } from "../lib/route";

/** The lessons in a path, in order, each with its icon, status and a link. */
export default function LessonList({ path, progress }: { path: PathMeta; progress: Progress }) {
  const nextId = path.lessons.find((l) => !progress.completedLessons[l.id])?.id;
  return (
    <ol className="path">
      {path.lessons.map((lesson) => {
        const done = Boolean(progress.completedLessons[lesson.id]);
        const status = done ? (
          <span className="status done">Done</span>
        ) : lesson.id === nextId ? (
          <span className="status next">Up next</span>
        ) : (
          <span className="status todo">{`${lesson.minutes} min`}</span>
        );
        return (
          <li key={lesson.id}>
            <a className="row" href={hrefFor({ name: "lesson", id: lesson.id })}>
              <span className={`lesson-tile ${done ? "done" : ""}`} aria-hidden="true">
                {lessonIcons[lesson.id] ?? lesson.code}
              </span>
              <span className="row-title">
                {lesson.title}
                <span className="row-sub">{lesson.subtitle}</span>
              </span>
              {status}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
