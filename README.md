# doqmentary

**Config-driven solution outlines as reviewable markdown — the document is the deliverable.**

Solution architects re-author the stable ~80% of every solution outline by hand in
PowerPoint, repeatedly restating the same enterprise principles and prior decisions
while only a small part is truly situation-specific. `doqmentary` turns outlines into
config-driven markdown "documents" where the stable enterprise layer is injected
automatically, only the situation-specific parts are authored, and every document
passes a persona-based review board before publication.

Unlike code-oriented spec tooling, **the document itself is the deliverable** — the
goal is the *right documentation*, not code generated from it.

## The Copilot-brain / CLI-hands split

doqmentary deliberately separates judgment from mechanics:

| | Role | Runs in | Model? |
|---|---|---|---|
| **The brain** | Authoring, review, Summary synthesis | GitHub Copilot (skills + agents + instructions) | Yes |
| **The hands** | Scaffolding, ingest, assembly, validation | The `doqmentary` CLI | **No** — deterministic, offline |

Model-backed work runs in GitHub Copilot so the full model roster is available for
free. The CLI performs only deterministic file mechanics and never calls a model, so
it always works offline and never blocks on credentials.

## How it works

1. **Configure** — `doqmentary.yaml` declares `sections`, `personas`, `output`, and
   `language`. Global defaults are overridable per document. Adding or removing a
   section or persona is a config edit, not a code change.
2. **Author** — the [author skill](.github/skills/author-solution-outline/SKILL.md)
   iterates the configured sections: it auto-fills fixed/library-bound blocks from the
   [enterprise libraries](enterprise/), interviews you for the situation-specific
   blocks, and synthesizes the **Summary** last from the body.
3. **Review** — the 3-persona [review board](.github/agents/) (Enterprise Architect,
   Solution Architect, Manager/readability) is the quality gate. Because there is no
   compiler, **all personas approving = done**.
4. **Assemble** — the [CLI](cli/) builds a navigable wiki: one linked page per body
   section plus a synthesized home page, with cross-link integrity checked.

## Repository layout

```
.github/
  skills/author-solution-outline/   # Copilot author skill (the brain)
  agents/                           # review board personas (the brain)
  instructions/                     # enterprise-context injection (the brain)
  doqmentary.collection.yml         # plugin manifest bundling the above
enterprise/
  principles/                       # stable, addressable enterprise principles
  decisions/                        # stable, addressable prior decisions (ADRs)
cli/                                # deterministic CLI (the hands): new/ingest/assemble/validate
documents/                          # generated solution outlines live here
doqmentary.yaml                     # global default configuration
```

## v1 scope decisions

- **Ingestion** is paste/attach deck **text** — no binary `.pptx` parsing yet.
- **Output** is plain linked **markdown** — platform-specific nav manifests
  (Azure DevOps `.order`, MkDocs `mkdocs.yml`, …) are pluggable and deferred.
- **Personas** are config-light: authored `*.agent.md` files that *read* the shared
  config, rather than fully data-driven rubrics.
- The **CLI never calls a model** — all generation/judgment happens in Copilot.

## Configuration

The configuration model is declarative and layered. See
[`doqmentary.yaml`](doqmentary.yaml) for the annotated global defaults and
[`cli/README.md`](cli/README.md) for the merge/precedence rules and CLI usage. A
per-document override example lives in
[`documents/example-solution/doqmentary.yaml`](documents/example-solution/doqmentary.yaml).

### Section schema

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Stable identifier (kebab-case); used for filenames and links. |
| `title` | yes | Human-readable heading. |
| `derived` | no | `true` if synthesized from other sections (e.g. the Summary). |
| `layer` | no | `enterprise` (fixed, from a library), `situation` (variable, interviewed), or `synthesis` (derived). |
| `source` | no | Enterprise library the block draws from: `principles` or `decisions`. |
| `render` | no | Renderer hint, e.g. `mermaid` for diagrams. |
| `blocks` | no | For derived sections, the summary blocks and what each summarizes. |

### Persona schema

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Stable identifier; matches the `*.agent.md` file name. |
| `title` | yes | Display name. |
| `lens` | yes | The single concern this persona reviews for. |
| `checks` | yes | Repeatable checklist items the persona verifies. |

### Merge / precedence

Effective config = **global defaults** deep-merged with the **per-document override**,
where per-document values win. Object keys merge recursively; scalar values and lists
(`sections`, `personas`) are replaced wholesale when present in the override, and
inherited from the global default when omitted. See
[`cli/README.md`](cli/README.md#effective-configuration) for the exact rules.