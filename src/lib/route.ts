import { useEffect, useState } from "react";

/**
 * Tiny hash router: #/ , #/path/heuristics , #/lesson/h1 , #/review , #/account , #/privacy , #/skills , #/credits , #/achievements , #/practice , #/challenge/forms , #/certificate/forms/2026-10-02/Name
 * Swap for a real router when the app needs nested routes or server rendering.
 */
export type Route = { name: "home" } | { name: "path"; id: string } | { name: "lesson"; id: string } | { name: "review" } | { name: "account" } | { name: "privacy" } | { name: "skills" } | { name: "credits" } | { name: "achievements" } | { name: "practice" } | { name: "challenge"; id: string }
  | { name: "certificate"; path: string; date: string; learner: string };

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
  if (parts[0] === "practice") return { name: "practice" };
  if (parts[0] === "challenge" && parts[1]) return { name: "challenge", id: parts[1] };
  if (parts[0] === "certificate" && parts[1] && parts[2] && parts[3]) {
    try {
      return { name: "certificate", path: parts[1], date: parts[2], learner: decodeURIComponent(parts.slice(3).join("/")) };
    } catch {
      // A badly encoded name: treat the link as unknown.
    }
  }
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
    case "practice":
      return "#/practice";
    case "challenge":
      return `#/challenge/${route.id}`;
    case "certificate":
      return `#/certificate/${route.path}/${route.date}/${encodeURIComponent(route.learner)}`;
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
