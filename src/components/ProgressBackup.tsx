import { useRef, useState, type ChangeEvent } from "react";
import { backupFileName, describeProgress, importBackup, makeBackup, readBackup } from "../lib/backup";
import type { Progress } from "../lib/progress";
import type { UpdateProgress } from "../lib/useProgress";

type Props = { progress: Progress; update: UpdateProgress };
type Message = { kind: "ok" | "error"; text: string };

/** Save progress to a file and load it elsewhere, no account needed. */
export default function ProgressBackup({ progress, update }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<Message | null>(null);

  async function save() {
    const now = new Date();
    const file = new File([makeBackup(progress, now)], backupFileName(now), { type: "application/json" });
    // Phones (including the installed app on iPhone) handle files through the share sheet: "Save to Files".
    const touch = window.matchMedia?.("(pointer: coarse)").matches;
    if (touch && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Open UX Lab progress" });
        setMessage({ kind: "ok", text: "Progress file ready. Keep it somewhere you can reach from your other device." });
      } catch (err) {
        if ((err as Error).name !== "AbortError") download(file);
      }
      return;
    }
    download(file);
  }

  function download(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage({ kind: "ok", text: `Saved ${file.name} to your downloads.` });
  }

  async function load(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // Lets the same file be chosen again.
    if (!file) return;
    if (file.size > 1_000_000) {
      setMessage({ kind: "error", text: "That file is too big to be an Open UX Lab progress file." });
      return;
    }
    const read = readBackup(await file.text());
    if (!read.ok) {
      setMessage({ kind: "error", text: read.error });
      return;
    }
    const merged = importBackup(progress, read.progress);
    if (JSON.stringify(merged) === JSON.stringify(progress)) {
      setMessage({ kind: "ok", text: "Nothing new in that file: everything in it is already here." });
      return;
    }
    update(() => merged);
    setMessage({ kind: "ok", text: `Progress loaded. You now have ${describeProgress(merged)}.` });
  }

  return (
    <div className="backup">
      <h2>Back up your progress</h2>
      <p>
        Save your progress to a file, then load it in another browser or on another device. Loading a file adds to the
        progress here. It never removes anything.
      </p>
      <div className="actions">
        <button className="btn ghost" type="button" onClick={() => void save()}>
          Save progress to a file
        </button>
        <button className="btn ghost" type="button" onClick={() => fileRef.current?.click()}>
          Load progress from a file
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" hidden tabIndex={-1} onChange={(e) => void load(e)} />
      </div>
      <div role="status">
        {message && (
          <p className={message.kind === "error" ? "form-error" : "notice"}>
            {message.kind === "error" && <span className="visually-hidden">Error: </span>}
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
