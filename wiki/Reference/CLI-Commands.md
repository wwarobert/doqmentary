# CLI Commands

The `doqmentary` CLI performs deterministic file mechanics. It never calls a model
and runs fully offline.

**Run all commands from the repository root** (so the CLI can find `doqmentary.yaml`):

```bash
node cli/bin/doqmentary.mjs <command> <solution> [options]
```

## Global options

| Option | Description |
|--------|-------------|
| `--root <dir>` | Repository root directory. Default: current working directory. |
| `--json` | Emit machine-readable JSON instead of human-readable text. |

## `new`

Scaffold a new document with one section file per configured section.

```bash
node cli/bin/doqmentary.mjs new <solution> [--root <dir>]
```

Creates `documents/<solution>/sections/<id>.md` for every section in the effective
configuration. Each file is seeded with YAML front matter and a hint comment
describing how the section is filled (`situation`, `enterprise`, or `derived`).

**Skips existing files** — safe to re-run if you add new sections to the config.

**JSON output fields:** `ok`, `solution`, `sections`, `created`, `skipped`

## `ingest`

Write provided deck text into a draft document's sections.

```bash
# From a JSON map file
node cli/bin/doqmentary.mjs ingest <solution> --map <file.json> [--root <dir>]

# Single section inline
node cli/bin/doqmentary.mjs ingest <solution> --section <id> --text "<text>" [--root <dir>]
```

The JSON map format is `{ "<section-id>": "<text>", … }`. Unknown section IDs are
reported and the command exits non-zero, but known sections are still written.

**JSON output fields:** `ok`, `solution`, `written`, `unknown`

## `assemble`

Build the linked wiki from the document's section files.

```bash
node cli/bin/doqmentary.mjs assemble <solution> [--root <dir>]
```

Writes to `documents/<solution>/<output.dir>/` (default `wiki/`):

| File | Contents |
|------|----------|
| `<id>.md` | One page per body (non-derived) section |
| `index.md` | Home page synthesised from the Summary section |
| `_sidebar.md` | Navigation manifest (markdown target) |

**Cross-link integrity** is checked after writing. The command returns `ok: false`
and lists broken links if any internal `.md` link does not resolve to a known page.

**JSON output fields:** `ok`, `solution`, `target`, `outDir`, `pages`, `navFile`, `linkIssues`

## `validate`

Check a document's completeness and the assembled wiki's link integrity.

```bash
node cli/bin/doqmentary.mjs validate <solution> [--root <dir>] [--json]
```

Reports:

| Issue type | Meaning |
|------------|---------|
| `missing-section` | A configured section file does not exist |
| `empty-section` | A section file exists but its body is empty (or contains only hint comments) |
| `broken-link` | An assembled wiki page links to a `.md` file that is not in the wiki |

**Exits non-zero** when any issue is found, making it suitable for use in CI.

**JSON output fields:** `ok`, `solution`, `issues[]` (each with `type`, `section`/`page`/`link`)

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success (or validation passed) |
| `1` | Error or validation failure |
