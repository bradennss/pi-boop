/** The ASCII BEL character. Writing it to a terminal rings the terminal bell. */
export const BELL = "\u0007";

/** Resolved runtime behavior for a single boop. */
export interface BoopConfig {
  enabled: boolean;
  soundFile: string | undefined;
}

/** Unnormalized settings gathered from the environment or CLI flags. */
export interface RawBoopSettings {
  soundFile?: string;
  disabled?: boolean;
}

/** Normalize raw settings into a config the player can act on. */
export function resolveConfig(raw: RawBoopSettings): BoopConfig {
  const soundFile = raw.soundFile?.trim() ?? "";
  return {
    enabled: raw.disabled !== true,
    soundFile: soundFile.length > 0 ? soundFile : undefined,
  };
}

const TRUTHY = new Set(["1", "true", "yes", "on"]);

/** Read raw settings from process environment variables. */
export function settingsFromEnv(
  env: Record<string, string | undefined>,
): RawBoopSettings {
  return {
    soundFile: env.PI_BOOP_SOUND,
    disabled: TRUTHY.has((env.PI_BOOP_DISABLE ?? "").trim().toLowerCase()),
  };
}

/** A spawnable command that plays an audio file. */
export interface PlayerCommand {
  command: string;
  args: string[];
}

/** Pick the command that plays a sound file on the given platform. */
export function soundPlayerCommand(
  platform: NodeJS.Platform,
  soundFile: string,
): PlayerCommand | undefined {
  switch (platform) {
    case "darwin":
      return { command: "afplay", args: [soundFile] };
    case "linux":
      return { command: "paplay", args: [soundFile] };
    case "win32":
      return {
        command: "powershell",
        args: [
          "-NoProfile",
          "-Command",
          `(New-Object Media.SoundPlayer '${soundFile}').PlaySync()`,
        ],
      };
    default:
      return undefined;
  }
}
