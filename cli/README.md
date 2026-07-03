# doqmentary CLI (the hands)

The deterministic command-line tool that performs **file mechanics only** for
doqmentary documents. It never calls an AI model and runs fully offline — all
generation and judgment happen in GitHub Copilot (the brain).

## Runtime

- **Language / runtime:** Node.js (ESM JavaScript), `node >= 18`.
- **Only dependency:** [`js-yaml`](https://www.npmjs.com/package/js-yaml) for reading
  configuration and section front matter.

Install once (the only step that touches the network); the CLI itself is offline:

```bash
cd cli
npm install
```

Run it from the repository root (so it can find the global `doqmentary.yaml`):

```bash
node cli/bin/doqmentary.mjs <command> <solution> [options]
```

## Commands

| Command | Purpose |
|---|---|
| `new <solution>` | Scaffold a document with one entry per configured section. |
| `ingest <solution>` | Write provided deck text into a draft document's sections. |
| `assemble <solution>` | Build the linked wiki: home page, per-section pages, nav manifest. |
| `validate <solution>` | Check section completeness and internal-link integrity. |

Common options:

- `--root <dir>` — repository root (default: current directory).
- `--json` — emit machine-readable JSON instead of human text.

### `new`

```bash
node cli/bin/doqmentary.mjs new my-solution
```

Creates `documents/my-solution/sections/<id>.md` for every section in the effective
config, each with front matter and a hint comment describing how the section is filled
(situation / enterprise / derived).

### `ingest`

Map deck text into sections, either from a JSON map or a single section:

```bash
# JSON map: { "<section-id>": "<text>", ... }
node cli/bin/doqmentary.mjs ingest my-solution --map deck.json

# Single section
node cli/bin/doqmentary.mjs ingest my-solution --section project-background --text "..."
```

Binary `.pptx` parsing is **out of scope for v1** — provide pasted/attached text.

### `assemble`

```bash
node cli/bin/doqmentary.mjs assemble my-solution
```

Writes the wiki under `documents/my-solution/<output.dir>/` (default `wiki/`):
one page per body section, a home page (`index.md`) synthesized from the Summary with
links to detail pages, and a navigation manifest for the configured `output.target`.

### `validate`

```bash
node cli/bin/doqmentary.mjs validate my-solution --json
```

Reports missing/empty sections and broken internal links, and **exits non-zero** when
any issue is found (suitable for CI).

## Effective configuration

The effective config for a document is the **global default** merged with the
**per-document override**:

1. Read the global `<root>/doqmentary.yaml`.
2. If `documents/<solution>/doqmentary.yaml` exists, deep-merge it on top.

Merge rules (see [`src/config.mjs`](src/config.mjs)):

- **Plain objects** merge recursively (e.g. `output.target` can be overridden without
  restating `output.dir`).
- **Lists** (`sections`, `personas`) are **replaced wholesale** when present in the
  override, and inherited from the global default when omitted.
- **Scalars** (e.g. `language`) are replaced; per-document values win.

## Pluggable navigation

Assembly generates a navigation manifest for `output.target`. The mechanism is
pluggable ([`src/wiki/nav.mjs`](src/wiki/nav.mjs)): the v1 `markdown` target emits a
portable `_sidebar.md`. Additional targets (Azure DevOps `.order`, MkDocs
`mkdocs.yml`, …) can be registered with `registerTarget` without changing page bodies.

## Layout produced

```
documents/<solution>/
  doqmentary.yaml        # optional per-document override
  sections/<id>.md       # authored/ingested section content (one per section)
  wiki/                  # assembled output
    index.md             # home page (synthesized Summary)
    <section-id>.md      # one page per body section
    _sidebar.md          # navigation manifest (markdown target)
```
