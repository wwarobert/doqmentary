## Why

doqmentary is ready to be committed to GitHub, but the working tree mixes three things that must not be pushed as-is: installed dependencies (`cli/node_modules/`), regenerable assembly output (`documents/**/wiki/`), and **company-specific enterprise content** (real `principles`/`decisions`). At the same time there is no automated test suite, so the CLI's deterministic behaviors (config merge, scaffolding, assembly, validation, link integrity) can regress silently. This change makes the repository safe to publish and continuously verifiable.

## What Changes

- Add a `.gitignore` that excludes `cli/node_modules/` (regenerable from the lockfile), `documents/**/wiki/` (regenerable via `assemble`), and real enterprise entries under `enterprise/principles/` and `enterprise/decisions/`.
- Ship the seeded principles/decisions as **committed, still-active examples** (renamed to `*.example.md`) so the version-control boundary keeps company entries private while examples remain functional context and test fixtures.
- Add an automated test suite (`node --test`, no new dependencies) covering CLI unit behaviors, per-command integration, and an end-to-end `new → ingest → assemble → validate` pipeline, all run against the committed examples/fixtures.
- Add a GitHub Actions CI workflow that installs and runs the tests on push and pull request, using the public npm registry and ignoring any private `.npmrc`.

## Capabilities

### New Capabilities
- `content-separation`: The version-control boundary — what is committed vs. ignored — and the rule that enterprise examples ship and stay active while real company principles/decisions remain private.
- `automated-testing`: The deterministic test suite covering the CLI's config resolution, commands, and wiki-output behaviors, run against committed example fixtures with no private content.
- `continuous-integration`: The CI workflow that runs the test suite on push/PR in a clean, public-registry environment.

### Modified Capabilities
<!-- None: existing spec requirements are unchanged; these are additive, cross-cutting capabilities. -->

## Impact

- New files: `.gitignore` (repo root), `cli/test/**`, `.github/workflows/*.yml`.
- Renames: `enterprise/principles/PRIN-*.md` → `PRIN-*.example.md` and `enterprise/decisions/ADR-*.md` → `ADR-*.example.md`; the library `README.md` index links update accordingly. Frontmatter ids (e.g. `PRIN-001`) are unchanged, so document references and injection keep resolving.
- No change to CLI behavior or config schema; the `*.md` glob the CLI and instructions already use continues to match `*.example.md`.
- Dependency posture unchanged for v1: the CLI keeps its single `js-yaml` dependency (config and front matter are YAML); the zero-dependency alternative is recorded in design as considered-and-deferred.
