import { useEffect, useRef } from "react";
import { findLesson, paths } from "./content/paths";
import { announceScreen } from "./lib/focus";
import { useCloudSync } from "./lib/useCloudSync";
import { useProgress } from "./lib/useProgress";
import { useRoute } from "./lib/route";
import Header from "./components/Header";
import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import PrivacyPage from "./pages/PrivacyPage";
import ReviewPage from "./pages/ReviewPage";

export default function App() {
  const [progress, update] = useProgress();
  const { status: syncStatus, syncNow } = useCloudSync(progress, update);
  const route = useRoute();
  const totalLessons = paths.reduce((n, p) => n + p.lessons.length, 0);

  // Title and focus on every route change. On first load, keep the browser's default focus.
  const firstRender = useRef(true);
  const routeKey = route.name === "lesson" ? `lesson/${route.id}` : route.name;
  useEffect(() => {
    const found = route.name === "lesson" ? findLesson(route.id) : undefined;
    const title =
      route.name === "lesson" && found ? `${found.lesson.code} ${found.lesson.title}`
      : route.name === "review" ? "Review"
      : route.name === "account" ? "Account"
      : route.name === "privacy" ? "Privacy"
      : "";
    if (firstRender.current) {
      firstRender.current = false;
      document.title = title ? `${title} – Open UX Lab` : "Open UX Lab";
    } else {
      announceScreen(title);
    }
    // routeKey captures everything about the route that matters here.
  }, [routeKey]);

  let page;
  if (route.name === "lesson") {
    const found = findLesson(route.id);
    page = found ? (
      <LessonPage key={found.lesson.id} lesson={found.lesson} path={found.path} progress={progress} update={update} />
    ) : (
      <HomePage progress={progress} />
    );
  } else if (route.name === "account") {
    page = <AccountPage status={syncStatus} syncNow={() => void syncNow()} update={update} />;
  } else if (route.name === "privacy") {
    page = <PrivacyPage />;
  } else if (route.name === "review") {
    page = <ReviewPage progress={progress} update={update} />;
  } else {
    page = <HomePage progress={progress} />;
  }

  return (
    <>
      {/* preventDefault: "#main" would otherwise be read as a route by the hash router. */}
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to main content
      </a>
      <Header progress={progress} totalLessons={totalLessons} syncStatus={syncStatus} />
      <main className="main" id="main" tabIndex={-1}>
        {page}
      </main>
    </>
  );
}
