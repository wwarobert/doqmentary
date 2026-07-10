# document-types/

Named document type configurations for doqmentary.

Each `.yaml` file in this directory defines a document type — its sections, personas, and display title — using the same schema as `doqmentary.yaml`.

## Schema

```yaml
title: Human-readable type name (used by skills and list output)

sections:
  - id: kebab-case-id   # used as filename and wiki slug
    title: Section Title
    layer: situation     # situation | enterprise | synthesis
    # optional:
    derived: true        # mark synthesis sections as derived
    source: principles   # enterprise library to draw from (principles | decisions)
    render: mermaid      # renderer hint

personas:
  - id: review-persona-id   # matches .github/agents/<id>.agent.md
    title: Display Name
    lens: What this persona reviews for.
    checks:
      - Checklist item 1
      - Checklist item 2
```

## Gitignore convention

- `*.yaml` files (your real org types) are **excluded by `.gitignore`** — they stay private.
- `*.example.yaml` files are **tracked** — they ship with the repo as functional demos and test fixtures.
- `README.md` is tracked.

To add your own type:

1. Create `document-types/<your-type>.yaml` (not `.example.yaml`).
2. Define sections and personas.
3. Use it: `doqmentary new --type <your-type> <document-name>`.

## Architectural vs. Operational types

**Architectural types** (solution outlines, ADRs, solution designs, RFCs) SHOULD include at least one section with `layer: enterprise`. This gives the Enterprise Architect reviewer a structured anchoring point — a place where the document explicitly accounts for applicable principles and prior decisions. The shipped `solution-outline.example.yaml` models this convention.

**Operational types** (runbooks, post-mortems, incident reports) are explicitly exempted. These documents describe procedures or events and do not typically need to reference the enterprise library; omitting an enterprise-layer section is expected and correct for operational types.
