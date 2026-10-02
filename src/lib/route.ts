import { useEffect, useState } from "react";

/**
 * Tiny hash router: #/ , #/lesson/h1 , #/review
 * Swap for a real router when the app needs nested routes or server rendering.
 */
export type Route = { name: "home" } | { name: "lesson"; id: string } | { name: "review" };

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "lesson" && parts[1]) return { name: "lesson", id: parts[1] };
  if (parts[0] === "review") return { name: "review" };
  return { name: "home" };
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case "lesson":
      return `#/lesson/${route.id}`;
    case "review":
      return "#/review";
    default:
      return "#/";
  }
}

export function navigate(route: Route) {
  window.location.hash = hrefFor(route);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseRoute(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
