## Context

doqmentary is being prepared for its first push to GitHub. The repository is a
**public framework** (CLI + Copilot skills/agents/instructions + config schema +
examples), but the same folders will, in real use, accumulate **private company
content** — actual enterprise principles and decisions. The working tree currently
also contains installed dependencies and generated wiki output. There is no automated
test suite yet, so the deterministic CLI can regress unnoticed.

This change sets the version-control boundary and adds automated verification. It does
not change any existing capability's requirements.

## Goals / Non-Goals

**Goals:**
- Make the repo safe to publish: never commit deps, generated output, or company-specific enterprise entries.
- Keep shipped examples **active** (not just reference) so authoring/review/tests work on a bare clone.
- Verify the CLI's deterministic behaviors automatically, using committed example fixtures only.
- Run the suite in CI on every push/PR in a clean, public-registry environment.

**Non-Goals:**
- Changing the config schema, CLI behavior, or any existing spec requirement.
- Version-controlling real company principles/decisions in this repo (that's the private-content-home open question).
- Removing the `js-yaml` dependency in v1 (recorded as a considered alternative below).
- Testing the model-backed Copilot steps (skills/agents) — those are judgment, not deterministic.

## Decisions

**D1 — Three-part version-control boundary.**
`.gitignore` excludes exactly three categories: `cli/node_modules/` (regenerable from `package-lock.json` via `npm ci`), `documents/**/wiki/` (regenerable via `assemble`), and real enterprise entries under `enterprise/principles/` and `enterprise/decisions/`. Everything else — CLI source, skills/agents/instructions, specs, `documents/` sources, and the example fixtures — is committed.

**D2 — Examples are committed *and active*, via a naming convention.**
Seeded entries are renamed to `*.example.md` and kept in the same folders the CLI and `enterprise-context.instructions.md` already scan (glob `*.md` still matches `*.example.md`). The gitignore keeps examples and ignores everything else:

```gitignore
enterprise/principles/*
!enterprise/principles/README.md
!enterprise/principles/*.example.md
enterprise/decisions/*
!enterprise/decisions/README.md
!enterprise/decisions/*.example.md
```

*Why not an `examples/` subfolder?* A subfolder would be reference-only unless the CLL and instructions were changed to also scan it — a code change that would also risk the example fixtures "going dark" on a fresh clone. The naming convention keeps examples functional with **no code change**. Frontmatter ids (`PRIN-001`) are unchanged, so existing references and injection keep resolving; only the README index links change.

**D3 — Tests use `node --test`, zero new dependencies.**
Node's built-in test runner matches the CLI's offline, minimal-dependency ethos. The CLI was built for this: pure functions, `--json` output, exit codes, and `--root` to target a temp directory.

Test pyramid:
- **Unit:** `deepMerge` / `loadEffectiveConfig` (override wins, lists replace, omitted inherit), `parseFrontmatter`, `bodyIsEmpty`, `checkLinks`, `buildNav`.
- **Integration:** each command (`new`, `ingest`, `assemble`, `validate`) against a temp `--root`, covering happy **and** failure paths (missing/empty section → non-zero; broken link → reported).
- **End-to-end:** `new → ingest → assemble → validate` in a temp dir seeded from the committed example fixtures; assert exit codes and produced files.

**D4 — Tests run against committed examples only.**
Fixtures are the `*.example.md` enterprise entries and the sample document sources (`documents/sample-datastore-migration/sections`, `deck.json`). `wiki/` is regenerated into a temp dir during tests, never read from a committed copy. This guarantees CI is green on a bare clone with zero private content present.

**D5 — CI = GitHub Actions, public registry.**
A workflow runs on push and PR: checkout → setup Node → `npm ci` (in `cli/`) → `npm test`. It explicitly uses the public registry (the workspace's private registry needs auth and is not available in CI). Optionally the workflow also runs `openspec validate --specs --strict`.

**D6 — Keep YAML + `js-yaml` for v1.**
Config and front matter stay YAML; the CLI keeps its single dependency. `node_modules/` is gitignored and restored via `npm ci`. *Alternative considered:* zero-dependency (JSON config parsed natively, or a hand-rolled mini-parser) — this would remove the install step, `node_modules/`, and the registry dependency entirely, which fits the "hands = offline, frictionless" ethos. Deferred because the whole config + front-matter design is already YAML (comments, no quoting) and front matter is conventionally YAML; revisiting is cheap and isolated to `fsutil.mjs`/`config.mjs`.

## Risks / Trade-offs

- **Private content leaks if the gitignore rule is wrong** → Mitigate with an explicit test/check that a plain `enterprise/principles/PRIN-X.md` is ignored while `*.example.md` is tracked.
- **Examples drift from being valid fixtures** → Mitigate: the E2E test *is* the example, so a broken example breaks CI.
- **`js-yaml` unavailable in a locked-down CI** → Mitigate: CI pins the public registry; the zero-dep path (D6 alternative) remains a fallback.
- **Renaming to `*.example.md` breaks links** → Mitigate: only the README index links change; ids and glob-based reads are unaffected; a link-integrity check covers the rest.

## Open Questions

- **Where do real company principles/decisions live long-term?** Git-ignored here means they're versioned nowhere. Candidates: a separate private repo/store (aligns with the enterprise-libraries open question from the foundation change), or a documented local-only convention.
- Should CI also lint the assembled wiki links and run `openspec validate --specs --strict` as a required gate, or keep those advisory for v1?
- Do real solution **documents** (not just enterprise entries) also need a privacy boundary later? (Out of scope now — user scoped "company-specific" to principles/decisions.)
