## Context

The `document-type-system` change passed the Enterprise Architect and was accepted as technically sound by the Solution Architect subject to three hardening items. This design addresses those items plus the EA advisory, keeping all changes minimal and scoped to the affected modules.

Current state of affected code:
- `new.mjs`: if `docConfigPath` exists, silently skips writing `type:` — `--type` has no effect.
- `config.mjs`: constructs `typePath = path.join(root, 'document-types', typeName + '.yaml')` with no guard on `typeName` content.
- `author-solution-outline/SKILL.md`: redirect header at top, full old body preserved below a `---` separator.
- `document-types/README.md`: no convention guidance on when to include enterprise-layer sections.

## Goals / Non-Goals

**Goals:**
- F1: `new --type` on an existing doc merges the type and scaffolds missing sections only; conflicts error explicitly.
- F2: `typeName` values containing `/`, `\`, or `..` are rejected before any filesystem access.
- F3: `author-solution-outline/SKILL.md` contains only the redirect — no executable instructions.
- EA advisory: `document-types/README.md` establishes the architectural vs. operational convention.

**Non-Goals:**
- A `--retype` flag for changing an existing type (deferred).
- Hard validation rule that architectural types must have enterprise sections (deferred; guidance only).
- Changes to assembly, ingest, or assemble behavior.

## Decisions

### Decision: F1 — merge type into existing config using a YAML read-modify-write

**Chosen:** Read the existing `doqmentary.yaml` with `readYaml`, set `data.type = typeName`, write back with `writeYaml`. Then call `loadEffectiveConfig` (which now finds the type and resolves correctly). If `data.type` already exists and differs from `typeName`, return an error before touching the file.

**Rejected:** Overwriting the entire file with `{ type: typeName }` — would destroy any other per-doc config the user has set (e.g. `language`). Rejected: skipping the write with a warning — the SA correctly identified silent no-op as the bug. Rejected: adding a `--retype` flag in this change — out of scope.

**Idempotency:** If `data.type === typeName` (same type, re-run), write is skipped and scaffold continues. No-op on the config, scaffold creates any missing sections.

### Decision: F2 — new `InvalidTypeNameError` class, not reuse `UnknownTypeError`

**Chosen:** Introduce `InvalidTypeNameError` (same module, same pattern as `UnknownTypeError`). Guard: `if (/[/\\]|\.\./.test(typeName))` before path construction. Validate surfaces it as `invalid-type` (distinct from `unknown-type`).

**Rejected:** Reusing `UnknownTypeError` with a special message — conflates two different failure modes; makes tests harder to assert precisely.

### Decision: F3 — replace entire body, keep frontmatter description

**Chosen:** Keep the YAML frontmatter (`name`, `description`) intact so Copilot's skill selector still matches on the description and routes to the redirect. Replace everything after the frontmatter with a single redirect block only — no `---` separator trick, no residual instructions.

**Rationale:** The description field is what makes the redirect discoverable. The body is what makes it dangerous. Keeping one, removing the other.

### Decision: EA advisory — convention in README, not in validate

**Chosen:** Add a "Architectural vs. Operational types" section to `document-types/README.md`. No CLI validation change. The example type (`solution-outline.example.yaml`) already models the convention.

**Rationale:** A blanket validation rule would false-positive on every operational type. Guidance in README + modeled in examples is sufficient for v1. Validate-level enforcement is recorded as a future option.

## Risks / Trade-offs

**[Risk] Read-modify-write of existing doqmentary.yaml loses YAML comments** → Mitigation: `js-yaml` dump does not preserve comments. This is existing behavior for any config write operation — acceptable for v1.

**[Risk] `InvalidTypeNameError` guard rejects legitimate type names with non-ASCII characters** → Mitigation: The guard only rejects `/`, `\`, and `..` — not Unicode. Type names are already constrained to kebab-case by convention.

**[Risk] Stripping `author-solution-outline` body breaks users who explicitly invoked it knowing it would execute the old instructions** → Mitigation: The redirect file has been live for one session cycle already. The redirect is clear. Breaking the old execution path is the intended outcome.
