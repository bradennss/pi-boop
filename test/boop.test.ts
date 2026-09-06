import { expect, test } from "vitest";
import {
  resolveConfig,
  settingsFromEnv,
  soundPlayerCommand,
} from "../src/boop.ts";

test("resolveConfig trims the sound file and keeps a real path", () => {
  expect(resolveConfig({ soundFile: "  /tmp/boop.wav  " })).toEqual({
    enabled: true,
    soundFile: "/tmp/boop.wav",
  });
});

test("resolveConfig treats a blank sound file as none", () => {
  expect(resolveConfig({ soundFile: "   " }).soundFile).toBeUndefined();
});

test("resolveConfig disables when asked", () => {
  expect(resolveConfig({ disabled: true }).enabled).toBe(false);
  expect(resolveConfig({}).enabled).toBe(true);
});

test("settingsFromEnv reads the sound path and disable flag", () => {
  expect(
    settingsFromEnv({ PI_BOOP_SOUND: "/s.wav", PI_BOOP_DISABLE: "yes" }),
  ).toEqual({ soundFile: "/s.wav", disabled: true });
});

test("settingsFromEnv leaves disabled false for other values", () => {
  expect(settingsFromEnv({ PI_BOOP_DISABLE: "0" }).disabled).toBe(false);
  expect(settingsFromEnv({}).disabled).toBe(false);
});

test("soundPlayerCommand picks a player per platform", () => {
  expect(soundPlayerCommand("darwin", "/s.wav")).toEqual({
    command: "afplay",
    args: ["/s.wav"],
  });
  expect(soundPlayerCommand("linux", "/s.wav")).toEqual({
    command: "paplay",
    args: ["/s.wav"],
  });
  expect(soundPlayerCommand("win32", "/s.wav")?.command).toBe("powershell");
});

test("soundPlayerCommand returns nothing on unsupported platforms", () => {
  expect(soundPlayerCommand("aix", "/s.wav")).toBeUndefined();
});
