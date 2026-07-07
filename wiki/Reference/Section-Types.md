# Section Types

Every section in a doqmentary document has a **type** that determines how it is
filled and how the author skill handles it. The type is set by the `layer` field
(and the `derived` flag) in the section's config entry.

## `situation` — user-authored per solution

The section contains content specific to this particular solution. The author skill
interviews the user to gather this content, then writes the responses into the
section file.

**Characteristics:**
- Unique content per document
- Authored through conversation with the author skill
- Can also be populated by ingestion (`doqmentary ingest`)

**Common examples:** Project background, Detailed scope, Out of scope, Target
conceptual design, Assumptions & dependencies, Risks & mitigations, Next steps

**Config:**
```yaml
- id: project-background
  title: Project background
  layer: situation
```

**Hint in scaffolded file:**
```
<!-- situation: interview the user for this content -->
```

## `enterprise` — library-bound

The section draws content from the enterprise libraries (`principles/` or
`decisions/`). The author skill selects the relevant entries for this solution and
records how each one applies.

**Characteristics:**
- Content comes from your enterprise library, not free-form authoring
- Selection is judgment-driven (the skill reads the libraries and picks relevant entries)
- The Enterprise Architect persona verifies completeness and correct application

**Common examples:** Key design decisions (from `decisions`), Project principles
(from `principles`)

**Config:**
```yaml
- id: key-design-decisions
  title: Key design decisions
  layer: enterprise
  source: decisions
```

**Hint in scaffolded file:**
```
<!-- enterprise: auto-populate by selecting relevant decisions from enterprise/decisions/ with an application note per entry -->
```

## `synthesis` — derived from other sections

The section is synthesised by the author skill from the content of other body
sections. It is never authored directly. The `derived: true` flag marks it as
excluded from direct authoring.

**Characteristics:**
- Always filled last (after all body sections are complete)
- The author skill reads body sections and synthesises a coherent summary
- Not authored through interview; generated from context

**Common example:** Summary (home page content)

**Config:**
```yaml
- id: summary
  title: Summary
  derived: true
  layer: synthesis
  blocks:
    - id: scope-background
      title: Scope & background
      summarizes: project-background
    - id: project-architecture
      title: Project architecture
      summarizes: target-conceptual-design
```

**Hint in scaffolded file:**
```
<!-- derived: synthesized from the body by the author skill; do not author directly -->
```

## Summary

| Layer | `derived` | Filled by | In assembled home page? |
|-------|-----------|-----------|------------------------|
| `situation` | `false` | Author skill (interview) or ingest | No (own page) |
| `enterprise` | `false` | Author skill (library selection) | No (own page) |
| `synthesis` | `true` | Author skill (from body sections) | Yes (becomes home page) |
