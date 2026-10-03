/** A medal for achievements. Decorative: the badge name and its status are always in text next to it. */
export default function BadgeIcon({ earned }: { earned: boolean }) {
  return (
    <svg className={`badge-icon ${earned ? "earned" : "locked"}`} viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false">
      <path className="badge-ribbon" d="M11 3h7l3 10h-7zM29 3h-7l-3 10h7z" />
      <circle className="badge-disc" cx="20" cy="25" r="12" />
      {earned ? (
        <path className="badge-mark" d="M14.5 25.5l3.8 3.8 7.2-7.6" />
      ) : (
        <path className="badge-mark" d="M16.5 24v-2a3.5 3.5 0 0 1 7 0v2M15 24h10v7H15z" />
      )}
    </svg>
  );
}
