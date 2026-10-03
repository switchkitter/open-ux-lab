import { rosette } from "../components/Seal";
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
  const [bg, surface, fg, muted, accent, mark] = ["--bg", "--surface", "--fg", "--muted", "--accent", "--mark"].map(token);

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

  // Seal: the same rosette, ring, check and ribbons as the page (components/Seal.tsx), scaled up.
  const s = 1.2;
  const sealY = 618;
  const sx = (x: number) => mid + (x - 40) * s;
  const sy = (y: number) => sealY + (y - 38) * s;
  ctx.fillStyle = accent;
  for (const tail of [
    [[27, 58], [18, 92], [29, 86], [36, 95], [42, 62]],
    [[53, 58], [62, 92], [51, 86], [44, 95], [38, 62]],
  ]) {
    ctx.beginPath();
    tail.forEach(([x, y], i) => (i ? ctx.lineTo(sx(x), sy(y)) : ctx.moveTo(sx(x), sy(y))));
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  rosette(40, 38, 33, 29).forEach(([x, y], i) => (i ? ctx.lineTo(sx(x), sy(y)) : ctx.moveTo(sx(x), sy(y))));
  ctx.closePath();
  ctx.fillStyle = mark;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mid, sealY, 22 * s, 0, Math.PI * 2);
  ctx.strokeStyle = surface;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(sx(29), sy(39));
  ctx.lineTo(sx(37), sy(47));
  ctx.lineTo(sx(52), sy(31));
  ctx.lineWidth = 5 * s;
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
