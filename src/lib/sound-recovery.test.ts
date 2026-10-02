import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SOUNDS, playSound, resetSoundForTests } from "./sound";

/** A stand-in for AudioContext that records which notes start and lets tests control its state. */
class FakeContext {
  static instances: FakeContext[] = [];
  static initialState = "running";
  static resume: (c: FakeContext) => Promise<void> = (c) => {
    c.setState("running");
    return Promise.resolve();
  };
  state: string = FakeContext.initialState;
  currentTime = 0;
  destination = {};
  started: number[] = [];
  private listeners = new Set<() => void>();
  constructor() {
    FakeContext.instances.push(this);
  }
  setState(s: string) {
    this.state = s;
    this.listeners.forEach((l) => l());
  }
  resume() {
    return FakeContext.resume(this);
  }
  close() {
    this.state = "closed";
    return Promise.resolve();
  }
  addEventListener(_: string, l: () => void) {
    this.listeners.add(l);
  }
  removeEventListener(_: string, l: () => void) {
    this.listeners.delete(l);
  }
  createOscillator() {
    const started = this.started;
    return { type: "", frequency: { value: 0 }, connect: (g: unknown) => g, stop() {}, start() { started.push(this.frequency.value); } };
  }
  createGain() {
    const noop = () => undefined;
    return { gain: { setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop }, connect: (d: unknown) => d };
  }
}

const correct = SOUNDS.correct.map((n) => n.freq);
const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  resetSoundForTests();
  FakeContext.instances = [];
  FakeContext.initialState = "running";
  FakeContext.resume = (c) => {
    c.setState("running");
    return Promise.resolve();
  };
  vi.stubGlobal("window", { AudioContext: FakeContext });
});
afterEach(() => vi.unstubAllGlobals());

describe("sound playback recovery", () => {
  it("plays straight away when audio is running", () => {
    playSound("correct", true);
    expect(FakeContext.instances[0].started).toEqual(correct);
  });

  it("plays nothing when sound is off", () => {
    playSound("correct", false);
    expect(FakeContext.instances).toHaveLength(0);
  });

  it("resumes suspended audio and plays once it's running", async () => {
    FakeContext.initialState = "suspended";
    playSound("correct", true);
    await flush();
    expect(FakeContext.instances).toHaveLength(1);
    expect(FakeContext.instances[0].started).toEqual(correct);
  });

  it("replaces audio Safari left 'interrupted' after the app was in the background", () => {
    playSound("correct", true);
    FakeContext.instances[0].setState("interrupted"); // app backgrounded, screen locked, phone call...
    playSound("wrong", true);
    expect(FakeContext.instances).toHaveLength(2);
    expect(FakeContext.instances[1].started).toEqual(SOUNDS.wrong.map((n) => n.freq));
  });

  it("starts fresh on the next tap if resuming fails", async () => {
    FakeContext.initialState = "suspended";
    FakeContext.resume = () => Promise.reject(new Error("not allowed"));
    playSound("correct", true);
    await flush();
    FakeContext.initialState = "running";
    playSound("correct", true);
    expect(FakeContext.instances).toHaveLength(2);
    expect(FakeContext.instances[1].started).toEqual(correct);
  });

  it("starts fresh on the next tap if resuming never finishes", () => {
    vi.useFakeTimers();
    FakeContext.initialState = "suspended";
    FakeContext.resume = () => new Promise(() => {}); // hangs
    playSound("correct", true);
    vi.advanceTimersByTime(700);
    FakeContext.initialState = "running";
    playSound("correct", true);
    expect(FakeContext.instances).toHaveLength(2);
    expect(FakeContext.instances[1].started).toEqual(correct);
    vi.useRealTimers();
  });

  it("skips a sound that would arrive too late to match the answer", () => {
    vi.useFakeTimers();
    FakeContext.initialState = "suspended";
    let wakeUp = () => {};
    FakeContext.resume = (c) => new Promise((r) => (wakeUp = () => { c.setState("running"); r(); }));
    playSound("correct", true);
    vi.advanceTimersByTime(2000);
    wakeUp();
    expect(FakeContext.instances[0].started).toEqual([]);
    vi.useRealTimers();
  });
});
