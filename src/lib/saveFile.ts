/**
 * Saves a file the learner made (a progress backup, a certificate image). Phones, including the
 * installed app on iPhone, get the share sheet ("Save to Files", "Save Image"); everything else downloads.
 */
export async function saveFile(file: File, title: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const touch = window.matchMedia?.("(pointer: coarse)").matches;
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return "shared";
    } catch (err) {
      if ((err as Error).name === "AbortError") return "cancelled";
      // Sharing failed for another reason: fall back to a download.
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}
