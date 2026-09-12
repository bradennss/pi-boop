# pi-boop

A [Pi](https://pi.dev) extension that plays the terminal bell or a custom sound when Pi is waiting for input.

## Install

```bash
# from npm
pi install npm:pi-boop

# or from git
pi install git:github.com/bradennss/pi-boop

# try it for a single run without installing
pi -e npm:pi-boop
```

## Usage

Once installed, pi-boop rings the terminal bell every time Pi settles and waits for you.

Run `/boop` at any time to play the sound and check your setup.

### Play a custom sound

Point pi-boop at an audio file to play it instead of the bell:

```bash
export PI_BOOP_SOUND=~/sounds/ready.wav
```

Or set it for a single run:

```bash
pi --boop-sound ~/sounds/ready.wav
```

pi-boop plays the file with the platform's player (`afplay` on macOS, `paplay` on Linux, PowerShell on Windows). If the file cannot be played, it falls back to the terminal bell.

### Turn it off

```bash
export PI_BOOP_DISABLE=1   # every run
pi --boop-off              # a single run
```

## Requirements

- Node.js >= 20.

## Development

```bash
pnpm install
pnpm run check
```

## Contributing

Every change that affects the published package needs a [changeset](https://github.com/changesets/changesets):

```bash
pnpm changeset
```
