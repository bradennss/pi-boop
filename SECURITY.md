# Security Policy

## Scope and behavior

`pi-boop` is a Pi extension. Like all Pi extensions it runs with your full user permissions. This extension:

- Writes the terminal bell character to standard error when Pi settles and waits for input.
- When `PI_BOOP_SOUND` or `--boop-sound` is set, spawns the platform audio player (`afplay`, `paplay`, or PowerShell) with the path you provide to play that file.
- Has no network calls, no telemetry, and no credential access. It has no runtime dependencies.

## Reporting a vulnerability

Please report suspected vulnerabilities privately via a [GitHub security advisory](https://github.com/bradennss/pi-boop/security/advisories/new). You will receive an acknowledgement within a few days.
