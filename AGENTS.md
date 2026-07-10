# doqmentary — agent instructions

Config-driven solution outlines as reviewable markdown. See [README.md](README.md) for the full overview.

## Brain / Hands split

| | Runs in | Model? |
|---|---|---|
| Authoring, review, Summary synthesis | GitHub Copilot skills + agents | Yes |
| Scaffolding, ingest, assembly, validation | `doqmentary` CLI | **No** — always offline |

**Never add model calls to CLI code.** All generation and judgment belongs in Copilot primitives (skills, agents, instructions).

## Build and test

```bash
# One-time install (only dependency: js-yaml)
cd cli && npm install

# Run all tests
cd cli && npm test
```

Run the CLI from the **repo root**, not from `cli/` — it resolves `doqmentary.yaml` relative to the working directory:

```bash
node cli/bin/doqmentary.mjs <command> <solution> [--root <dir>]
```

Full command reference: [cli/README.md](cli/README.md).

## Key paths

| Path | Contents |
|---|---|
| `doqmentary.yaml` | Global default config — sections, personas, output target |
| `documents/<solution>/sections/` | Authored section `.md` files (one per section id) |
| `documents/<solution>/wiki/` | Assembled wiki output (written by `assemble`) |
| `enterprise/principles/` | Addressable enterprise principles (`PRIN-001`, …) |
| `enterprise/decisions/` | Addressable ADRs (`ADR-001`, …) |
| `.github/skills/` | Copilot author skill + doqmentary change-workflow skills |
| `.github/agents/` | Review-board persona agents |
| `.github/instructions/` | Enterprise-context injection (auto-applied to `documents/**/*.md`) |
| `openspec/` | Change management: proposals, designs, task lists, specs |
| `cli/src/` | All CLI source (ESM `.mjs`, no TypeScript, no transpile step) |
| `cli/test/` | Tests — Node built-in runner (`node:test` + `node:assert/strict`) |

## Configuration conventions

- **Effective config** = global `doqmentary.yaml` **deep-merged** with per-document `doqmentary.yaml`. Plain objects merge recursively; **`sections` and `personas` arrays replace wholesale** when present in the override.
- Section `id` is **kebab-case** — used directly as the filename (`<id>.md`) and as the wiki page slug.
- Section `layer` values:
  - `enterprise` — fixed block drawn from a library (`source: principles` or `source: decisions`)
  - `situation` — variable block authored interactively
  - `synthesis` — derived from other sections; `derived: true`; **not scaffolded by `new`**
- See [cli/src/config.mjs](cli/src/config.mjs) for the deep-merge implementation.

## CLI conventions

- All source files are `.mjs` (ESM modules). No TypeScript, no build/transpile step.
- Only external dependency: `js-yaml`. Do not add dependencies without discussion.
- `--json` on any command emits machine-readable JSON instead of human text.
- `validate` exits non-zero when issues are found (suitable for CI).
- The CLI has no opinion about model output — it processes whatever markdown is in the section files.

## Copilot primitives

| Primitive | File | Purpose |
|---|---|---|
| Author skill | `.github/skills/author-document/SKILL.md` | Iterates sections, auto-fills enterprise blocks, interviews for situation blocks, synthesizes derived sections; type-aware |
| Enterprise-context instructions | `.github/instructions/enterprise-context.instructions.md` | Auto-injected for `documents/**/*.md`; governs library selection rules |
| Review-board agents | `.github/agents/*.agent.md` | 3-persona quality gate (Enterprise Architect, Solution Architect, Manager) |
| Collection manifest | `.github/doqmentary.collection.yml` | Bundles all primitives for single-step install |

## Review board

A document is ready when **all configured personas approve**. Personas are declared in the effective config's `personas` list. See [.github/agents/README.md](.github/agents/README.md).

Run each configured agent against the document; revise and re-run the full board until all approve, then `assemble`.

## Enterprise libraries

Read principles and decisions from their source files in `enterprise/` — never copy content into documents. Reference entries by stable id (`PRIN-001`, `ADR-001`). The [enterprise-context instructions](.github/instructions/enterprise-context.instructions.md) govern exactly how to select and apply entries.

## Change workflow

Active changes live in `openspec/changes/<name>/`. The standard flow is:

```
doqmentary-propose → doqmentary-explore → doqmentary-apply-change
```

`doqmentary-apply-change` handles the full lifecycle: implements tasks, then on completion offers to sync delta specs and archive the change inline. Completed changes are archived under `openspec/changes/archive/`. Main specs live in `openspec/specs/`.
