/**
 * pi-boop plays the terminal bell or a custom sound file when Pi finishes a
 * turn and is waiting for user input.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import {
  resolveConfig,
  settingsFromEnv,
  type BoopConfig,
  type RawBoopSettings,
} from "./src/boop.ts";
import { boop } from "./src/player.ts";

const SOUND_FLAG = "boop-sound";
const OFF_FLAG = "boop-off";

export default function piBoop(pi: ExtensionAPI): void {
  pi.registerFlag(SOUND_FLAG, {
    type: "string",
    description: "Path to a custom sound file to play when Pi waits for input.",
  });
  pi.registerFlag(OFF_FLAG, {
    type: "boolean",
    default: false,
    description: "Disable pi-boop for this run.",
  });

  function currentConfig(): BoopConfig {
    const env = settingsFromEnv(process.env);
    const soundFlag = pi.getFlag(SOUND_FLAG);
    const offFlag = pi.getFlag(OFF_FLAG);
    const raw: RawBoopSettings = {
      soundFile:
        typeof soundFlag === "string" && soundFlag ? soundFlag : env.soundFile,
      disabled: offFlag === true || env.disabled,
    };
    return resolveConfig(raw);
  }

  pi.on("agent_settled", async (_event, ctx) => {
    if (!ctx.isIdle()) {
      return;
    }
    boop(currentConfig());
  });

  pi.registerCommand("boop", {
    description: "Play the pi-boop sound now to test your configuration.",
    handler: async (_args, ctx) => {
      boop(currentConfig());
      ctx.ui.notify("Played pi-boop.", "info");
    },
  });
}
