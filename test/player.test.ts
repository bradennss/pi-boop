import { EventEmitter } from "node:events";
import { expect, test, vi } from "vitest";
import type { BoopConfig } from "../src/boop.ts";
import { boop, type PlayerDeps } from "../src/player.ts";

interface FakeChild extends EventEmitter {
  unref: () => void;
}

function fakeChild(): FakeChild {
  const child = new EventEmitter() as FakeChild;
  child.unref = vi.fn();
  return child;
}

function makeDeps(
  platform: NodeJS.Platform,
  child: FakeChild = fakeChild(),
): PlayerDeps {
  return {
    platform,
    ringBell: vi.fn(),
    spawn: vi.fn(() => child) as unknown as PlayerDeps["spawn"],
  };
}

const withSound: BoopConfig = { enabled: true, soundFile: "/s.wav" };
const bellOnly: BoopConfig = { enabled: true, soundFile: undefined };

test("boop does nothing when disabled", () => {
  const deps = makeDeps("darwin");
  boop({ enabled: false, soundFile: "/s.wav" }, deps);
  expect(deps.spawn).not.toHaveBeenCalled();
  expect(deps.ringBell).not.toHaveBeenCalled();
});

test("boop rings the bell when no sound file is set", () => {
  const deps = makeDeps("darwin");
  boop(bellOnly, deps);
  expect(deps.ringBell).toHaveBeenCalledOnce();
  expect(deps.spawn).not.toHaveBeenCalled();
});

test("boop spawns the platform player for a sound file", () => {
  const deps = makeDeps("darwin");
  boop(withSound, deps);
  expect(deps.spawn).toHaveBeenCalledWith("afplay", ["/s.wav"], {
    stdio: "ignore",
  });
  expect(deps.ringBell).not.toHaveBeenCalled();
});

test("boop falls back to the bell on an unsupported platform", () => {
  const deps = makeDeps("aix");
  boop(withSound, deps);
  expect(deps.spawn).not.toHaveBeenCalled();
  expect(deps.ringBell).toHaveBeenCalledOnce();
});

test("boop falls back to the bell when the player fails to start", () => {
  const child = fakeChild();
  const deps = makeDeps("darwin", child);
  boop(withSound, deps);
  expect(deps.ringBell).not.toHaveBeenCalled();
  child.emit("error", new Error("spawn afplay ENOENT"));
  expect(deps.ringBell).toHaveBeenCalledOnce();
});
