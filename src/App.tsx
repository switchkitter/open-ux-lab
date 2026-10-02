import { findLesson, paths } from "./content/paths";
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
      <Header progress={progress} totalLessons={totalLessons} syncStatus={syncStatus} />
      <main className="main">{page}</main>
    </>
  );
}
