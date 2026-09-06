# pi-boop

A [Pi](https://pi.dev) extension that plays the terminal bell or a custom sound file when Pi finishes a turn and waits for user input.

## How it works

- `index.ts` registers the `agent_settled` handler, the `boop-sound` and `boop-off` CLI flags, and the `/boop` test command.
- `src/boop.ts` holds the pure config and player-command logic.
- `src/player.ts` performs the side effects: spawn the sound player or write the bell, with the bell as fallback.

Config comes from `PI_BOOP_SOUND` and `PI_BOOP_DISABLE` env vars, or the `--boop-sound` and `--boop-off` flags.

## Verify

```sh
pnpm run format
pnpm run typecheck
pnpm run lint
pnpm test
```

## Contributing and publishing

Follow this workflow:

1. Make the change on a feature branch and run `pnpm run check`.
2. Add a [changeset](https://github.com/changesets/changesets) with `pnpm changeset`. Pick the bump level and write the summary. The `Changeset Check` workflow fails the PR without one.
3. Open a pull request into `main`. Wait for the `CI` and `Changeset Check` workflows to pass, then merge.
4. On merge to `main`, the `Release` workflow opens or updates a `Version Packages` PR that bumps the version and updates `CHANGELOG.md`. Wait for it to appear.
5. Review and merge the `Version Packages` PR. That merge triggers the `Release` workflow again, which packs and publishes the package to npm.
