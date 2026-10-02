import { describe, expect, it } from "vitest";
import { emptyProgress, type Progress } from "./progress";
import { sameProgress, syncProgress, type RemoteProgress, type SyncBase } from "./sync";

function fakeRemote(initial: Progress | null) {
  const state = { data: initial, saves: 0 };
  const remote: RemoteProgress = {
    load: async () => state.data,
    save: async (p) => {
      state.data = p;
      state.saves++;
    },
  };
  return { remote, state };
}

function memoryBase(initial: Progress | null = null): SyncBase & { value: Progress | null } {
  return {
    value: initial,
    load() {
      return this.value;
    },
    save(p) {
      this.value = p;
    },
  };
}

const p = (over: Partial<Progress>): Progress => ({ ...emptyProgress(), ...over });

describe("syncProgress", () => {
  it("uploads local progress when the server has none", async () => {
    const { remote, state } = fakeRemote(null);
    const base = memoryBase();
    const local = p({ xp: 30, completedLessons: { h1: true } });
    expect(await syncProgress(local, remote, base)).toEqual(local);
    expect(state.data).toEqual(local);
    expect(base.value).toEqual(local);
  });

  it("merges a second device into the server copy", async () => {
    const { remote, state } = fakeRemote(p({ xp: 50, completedLessons: { h1: true } }));
    const merged = await syncProgress(p({ completedLessons: { a1: true } }), remote, memoryBase());
    expect(merged.completedLessons).toEqual({ h1: true, a1: true });
    expect(state.data).toEqual(merged);
  });

  it("doesn't write to the server when nothing changed", async () => {
    const same = p({ xp: 10 });
    const { remote, state } = fakeRemote(same);
    await syncProgress({ ...same }, remote, memoryBase(same));
    expect(state.saves).toBe(0);
  });

  it("carries a cleared review item across devices", async () => {
    // Phone and laptop both last synced with item x in review; the phone then cleared it.
    const synced = p({ review: { x: { step: 1, due: "2026-10-01" } } });
    const { remote, state } = fakeRemote(synced);
    await syncProgress(p({ xp: 5 }), remote, memoryBase(synced)); // phone
    const laptop = await syncProgress(synced, remote, memoryBase(synced));
    expect(laptop.review).toEqual({});
    expect(state.data?.review).toEqual({});
  });
});

describe("sameProgress", () => {
  it("ignores key order", () => {
    expect(sameProgress(p({ completedLessons: { a: true, b: true } }), p({ completedLessons: { b: true, a: true } }))).toBe(true);
    expect(sameProgress(p({ xp: 1 }), p({ xp: 2 }))).toBe(false);
  });
});
