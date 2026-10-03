import { useEffect, useState } from "react";

/**
 * Tiny hash router: #/ , #/path/heuristics , #/lesson/h1 , #/review , #/account , #/privacy , #/skills , #/credits , #/achievements
 * Swap for a real router when the app needs nested routes or server rendering.
 */
export type Route = { name: "home" } | { name: "path"; id: string } | { name: "lesson"; id: string } | { name: "review" } | { name: "account" } | { name: "privacy" } | { name: "skills" } | { name: "credits" } | { name: "achievements" };

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "path" && parts[1]) return { name: "path", id: parts[1] };
  if (parts[0] === "lesson" && parts[1]) return { name: "lesson", id: parts[1] };
  if (parts[0] === "review") return { name: "review" };
  if (parts[0] === "account") return { name: "account" };
  if (parts[0] === "privacy") return { name: "privacy" };
  if (parts[0] === "skills") return { name: "skills" };
  if (parts[0] === "credits") return { name: "credits" };
  if (parts[0] === "achievements") return { name: "achievements" };
  return { name: "home" };
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case "path":
      return `#/path/${route.id}`;
    case "lesson":
      return `#/lesson/${route.id}`;
    case "review":
      return "#/review";
    case "account":
      return "#/account";
    case "privacy":
      return "#/privacy";
    case "skills":
      return "#/skills";
    case "credits":
      return "#/credits";
    case "achievements":
      return "#/achievements";
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
