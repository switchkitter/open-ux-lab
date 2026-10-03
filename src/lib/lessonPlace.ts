/**
 * Where a learner stopped inside a lesson, so they can continue from the next exercise instead of
 * starting over. Answers themselves are saved in progress as they're given; this only remembers the
 * place. Kept in this browser only (not synced), and forgotten after a week.
 */

export type LessonPlace = {
  /** The next exercise to show, 1-based. */
  step: number;
  /** Exercises answered right on the first try so far, for the done screen. */
  firstTry: number;
  /** When it was saved (ms since epoch). */
  at: number;
};

type Places = Record<string, LessonPlace>;

const KEY = "open-ux-lab:lesson-places";
export const PLACE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Drops places older than a week and anything with the wrong shape. */
export function prunePlaces(raw: unknown, now: number): Places {
  if (!raw || typeof raw !== "object") return {};
  const places: Places = {};
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    const p = v as Partial<LessonPlace>;
    if (typeof p?.step !== "number" || typeof p.firstTry !== "number" || typeof p.at !== "number") continue;
    if (now - p.at > PLACE_MAX_AGE_MS || p.step < 2) continue;
    places[id] = { step: p.step, firstTry: p.firstTry, at: p.at };
  }
  return places;
}

function read(now: number): Places {
  try {
    return prunePlaces(JSON.parse(localStorage.getItem(KEY) ?? "{}"), now);
  } catch {
    return {};
  }
}

function write(places: Places) {
  try {
    localStorage.setItem(KEY, JSON.stringify(places));
  } catch {
    // Without storage, lessons simply start from the reading next time.
  }
}

/** The saved place in a lesson, if it's still within the lesson's exercises. */
export function loadPlace(lessonId: string, totalExercises: number, now = Date.now()): LessonPlace | null {
  const place = read(now)[lessonId];
  return place && place.step <= totalExercises ? place : null;
}

export function savePlace(lessonId: string, place: Omit<LessonPlace, "at">, now = Date.now()) {
  write({ ...read(now), [lessonId]: { ...place, at: now } });
}

export function clearPlace(lessonId: string, now = Date.now()) {
  const places = read(now);
  if (!(lessonId in places)) return;
  delete places[lessonId];
  write(places);
}
