import { dayLabel, type Certificate } from "./certificate";

const W = 1200;
const H = 850;

/** Theme colors from the design tokens, so the image matches the app. */
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Largest font size (down to `min`) at which `text` fits in `maxWidth`. */
function fit(ctx: CanvasRenderingContext2D, text: string, font: (size: number) => string, start: number, min: number, maxWidth: number): number {
  let size = start;
  ctx.font = font(size);
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = font(size);
  }
  return size;
}

/** Splits text into lines that fit `maxWidth` with the current font. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/** Draws the certificate as a 1200×850 PNG, for posting or saving. */
export async function certificateImage(c: Certificate, site: string): Promise<File> {
  const display = (size: number, weight = 800) => `${weight} ${size}px "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif`;
  const body = (size: number, weight = 400) => `${weight} ${size}px "Atkinson Hyperlegible", sans-serif`;
  await Promise.all([document.fonts.load(display(40)), document.fonts.load(display(40, 700)), document.fonts.load(body(24)), document.fonts.load(body(24, 700))]);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const [bg, surface, fg, muted, accent, mark, markInk] = ["--bg", "--surface", "--fg", "--muted", "--accent", "--mark", "--mark-ink"].map(token);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = surface;
  ctx.fillRect(40, 40, W - 80, H - 80);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(58, 58, W - 116, H - 116);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const mid = W / 2;

  ctx.font = display(34);
  ctx.fillStyle = fg;
  const brand = "Open UX ";
  const brandWidth = ctx.measureText(brand + "Lab").width;
  ctx.textAlign = "left";
  ctx.fillText(brand, mid - brandWidth / 2, 150);
  ctx.fillStyle = accent;
  ctx.fillText("Lab", mid - brandWidth / 2 + ctx.measureText(brand).width, 150);
  ctx.textAlign = "center";

  ctx.font = body(22, 700);
  ctx.fillStyle = muted;
  ctx.fillText("CERTIFICATE OF COMPLETION", mid, 230);

  const nameSize = fit(ctx, c.learner, (s) => display(s), 76, 36, W - 240);
  ctx.font = display(nameSize);
  ctx.fillStyle = fg;
  ctx.fillText(c.learner, mid, 335);

  ctx.font = body(28);
  ctx.fillStyle = muted;
  ctx.fillText("completed the learning path", mid, 405);

  ctx.font = display(48, 700);
  ctx.fillStyle = accent;
  const titleLines = wrap(ctx, c.path.title, W - 260);
  titleLines.forEach((line, i) => ctx.fillText(line, mid, 480 + i * 58));
  const afterTitle = 480 + (titleLines.length - 1) * 58;

  const exercises = c.path.lessons.reduce((n, l) => n + l.exercises.length, 0);
  ctx.font = body(24);
  ctx.fillStyle = muted;
  ctx.fillText(`${c.path.lessons.length} lessons · ${exercises} exercises`, mid, afterTitle + 60);

  // Seal: a gold disc with a check.
  const sealY = H - 225;
  ctx.beginPath();
  ctx.arc(mid, sealY, 46, 0, Math.PI * 2);
  ctx.fillStyle = mark;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = markInk;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mid - 20, sealY + 2);
  ctx.lineTo(mid - 5, sealY + 17);
  ctx.lineTo(mid + 22, sealY - 14);
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  ctx.font = body(24, 700);
  ctx.fillStyle = fg;
  ctx.fillText(dayLabel(c.date), mid, H - 135);
  ctx.font = body(20);
  ctx.fillStyle = muted;
  ctx.fillText(site, mid, H - 103);

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No image"))), "image/png"));
  const slug = c.path.id.replace(/[^a-z0-9-]/gi, "");
  return new File([blob], `open-ux-lab-certificate-${slug}.png`, { type: "image/png" });
}
