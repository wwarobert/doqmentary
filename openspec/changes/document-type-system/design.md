## Context

doqmentary's config model is already generic — `sections[]` and `personas[]` can define any document structure. But the system exposes only one implicit type: the solution outline embedded in the global `doqmentary.yaml`. There is no way to name a type, pick a type when creating a document, or browse documents by type. The `author-solution-outline` Copilot skill is named and framed specifically for that one type.

The goal of this change is to promote the implicit type to a first-class concept without breaking any existing documents or workflows.

## Goals / Non-Goals

**Goals:**
- Introduce `document-types/` as the org-owned registry of named type configs.
- Add `type: <name>` to per-document config as an optional, backward-compatible field.
- Extend config resolution to load the named type as an intermediate layer.
- Add `doqmentary list [--type <name>]` as a deterministic catalog command.
- Extend `doqmentary new` with `--type <name>` to bootstrap from a type config.
- Generalize `author-solution-outline` → `author-document` (type-aware, same interview logic).
- Ship example type configs (`*.example.yaml`) on the same gitignore boundary as enterprise libraries.

**Non-Goals:**
- A hierarchical or tag-based taxonomy beyond the single `type` field.
- Any metadata store, database, or index file — `list` reads the file system directly.
- Automatic type inference from content.
- Changing the behavior of assembly, validate, or ingest.
- Adding npm dependencies.

## Decisions

### Decision: document-types/ as discrete YAML files (not embedded in global config)

**Chosen:** Each type lives in `document-types/<name>.yaml` with the same schema as the existing config: `title`, `sections[]`, `personas[]`.

**Rejected:** Embedding an `types:` map in `doqmentary.yaml`. This would bloat the global config and make it harder for orgs to maintain private types independently.

**Rationale:** Discrete files mirror the enterprise library pattern (`enterprise/principles/*.md`). Orgs can add, remove, and version type files without touching the global config. The same gitignore pattern (`!*.example.yaml`) keeps real org types private while examples ship with the repo.

### Decision: Type as an intermediate config layer

**Chosen:** Config resolution order becomes: `global doqmentary.yaml` → `document-types/<type>.yaml` → `per-document doqmentary.yaml`. The document override always wins. Documents without `type` skip the intermediate layer — zero regression.

**Rejected:** Per-document config directly re-listing sections (already possible today; no change needed). Rejected because it doesn't allow org-level type reuse.

**Rationale:** Preserves the existing merge semantics. `sections[]` and `personas[]` still replace wholesale when present. A document can partially override a type by listing its own `sections`.

### Decision: list command as a file-system walk (no catalog metadata file)

**Chosen:** `doqmentary list` walks `documents/`, reads each document's `doqmentary.yaml`, and reports type + assembly status (presence of `wiki/index.md`). No catalog.yaml, no index.

**Rejected:** Maintaining a `catalog.yaml` file updated on `new`/`assemble`. This would require CLI commands to maintain side-effect state and could drift out of sync.

**Rationale:** Consistent with the CLI's deterministic, stateless design. The file system is the catalog.

### Decision: author-document replaces author-solution-outline (rename, not fork)

**Chosen:** The skill is renamed and its framing generalized. The interview logic (situation → interview, enterprise → auto-fill, synthesis → derive last) is unchanged — it already operates on whatever sections are configured. The skill reads `type` from effective config to set its framing (e.g., "I'm authoring a solution outline" vs "I'm authoring an ADR").

**Rejected:** Forking a skill per type. This would explode maintenance surface as types grow.

**Rationale:** The section-layer model is already type-agnostic. The only thing that was type-specific was the skill's name and framing language. The enterprise-context instructions already apply to `documents/**/*.md` — no change needed there beyond broadening the description.

### Decision: gitignore boundary for document-types/

**Chosen:** `.gitignore` ignores `document-types/*.yaml` but allows `document-types/*.example.yaml` and `document-types/README.md`. Same pattern as `enterprise/`.

**Rationale:** Org-specific type definitions (which reveal org taxonomy and vocabulary) stay private. Example types ship with the repo as functional demonstration and test fixtures.

## Risks / Trade-offs

**[Risk] `type` field silently ignored if document-types/ file is missing** → Mitigation: `validate` reports unknown type as a warning; `new --type` fails fast with a clear error if the type file doesn't exist.

**[Risk] Renaming the Copilot skill breaks existing invocations** → Mitigation: Keep a redirect/alias in the old skill file pointing to the new one for one release cycle; update AGENTS.md and wiki.

**[Risk] list command is slow on large document stores** → Mitigation: Out of scope for v1; the file-system walk is proportional to document count, which is small in practice.

## Open Questions

- Should `doqmentary list` also show the document title (first `h1` from any assembled page)? Deferred — folder name is sufficient for v1.
- Should example types ship as `solution-outline.example.yaml` (matching enterprise pattern exactly) or as a named `examples/` subdirectory? Decision: flat file in `document-types/` matching the enterprise convention.
