# Configuration Schema

doqmentary uses a layered YAML configuration. The global defaults live in
`doqmentary.yaml` at the repository root. Any document can override values with
a per-document `doqmentary.yaml` inside its folder.

**Merge rules:**
- Plain objects merge recursively (nested keys are combined)
- Arrays (`sections`, `personas`) are **replaced wholesale** when present in the override
- Scalar values are replaced
- Omitted values are inherited from the global

## Top-level fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `version` | integer | `1` | Config schema version. Always `1` for v1. |
| `language` | string | `en` | ISO language code for authored and assembled content. |
| `output` | object | — | Assembly output settings (see below). |
| `sections` | array | — | Ordered list of section definitions (see below). |
| `personas` | array | — | Review board persona definitions (see below). |

## `output` object

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `output.target` | string | `markdown` | Navigation manifest format. `markdown` produces `_sidebar.md`. |
| `output.dir` | string | `wiki` | Sub-folder inside the document directory for assembled pages. |

## Section schema (`sections[]`)

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | yes | string | Stable kebab-case identifier. Used for filenames and wiki page links. Never reuse an ID. |
| `title` | yes | string | Human-readable section heading. Used as the page title in the assembled wiki. |
| `layer` | no | string | Context layer: `situation`, `enterprise`, or `synthesis`. Guides the author skill. |
| `derived` | no | boolean | `true` if this section is synthesised from other sections (e.g. Summary). Derived sections are not authored directly. |
| `source` | no | string | Enterprise library this section draws from: `principles` or `decisions`. |
| `render` | no | string | Renderer hint for the author skill. `mermaid` requests a Mermaid diagram. |
| `blocks` | no | array | For derived sections: the summary blocks and what each summarises (see below). |

### `blocks[]` schema (derived sections only)

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Block identifier (used internally). |
| `title` | yes | Block heading in the assembled home page. |
| `summarizes` | no | ID of the body section this block links to. |
| `layer` | no | Layer hint for the block (e.g. `enterprise`). |
| `source` | no | Enterprise source for this block (`principles`). |

## Persona schema (`personas[]`)

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Identifier matching the `.github/agents/<id>.agent.md` filename. |
| `title` | yes | Display name for the persona. |
| `lens` | yes | One-sentence description of what this persona reviews for. |
| `checks` | yes | Array of repeatable checklist items the persona verifies. |

## Example: minimal two-section config

```yaml
version: 1
language: en
output:
  target: markdown
  dir: wiki
sections:
  - id: background
    title: Background
    layer: situation
  - id: scope
    title: Scope
    layer: situation
```

## Example: per-document override

```yaml
# documents/my-solution/doqmentary.yaml
# Replaces the global sections list for this document only.
sections:
  - id: background
    title: Project background
    layer: situation
  - id: scope
    title: In scope
    layer: situation
  - id: out-of-scope
    title: Out of scope
    layer: situation
```
