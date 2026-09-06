import { spawn } from "node:child_process";
import { BELL, soundPlayerCommand, type BoopConfig } from "./boop.ts";

/** Injectable side effects so the player can be tested without real audio. */
export interface PlayerDeps {
  platform: NodeJS.Platform;
  ringBell: () => void;
  spawn: typeof spawn;
}

/** Real dependencies wired to the current process. */
export function defaultDeps(): PlayerDeps {
  return {
    platform: process.platform,
    ringBell: () => {
      process.stderr.write(BELL);
    },
    spawn,
  };
}

/**
 * Play a single boop. Plays the configured sound file when one is set and the
 * platform has a player, otherwise rings the terminal bell. A failed sound
 * player also falls back to the bell.
 */
export function boop(
  config: BoopConfig,
  deps: PlayerDeps = defaultDeps(),
): void {
  if (!config.enabled) {
    return;
  }

  if (config.soundFile) {
    const command = soundPlayerCommand(deps.platform, config.soundFile);
    if (command) {
      const child = deps.spawn(command.command, command.args, {
        stdio: "ignore",
      });
      child.on("error", deps.ringBell);
      child.unref();
      return;
    }
  }

  deps.ringBell();
}
