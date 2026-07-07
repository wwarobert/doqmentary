# Ingest Deck Content

If you have existing deck content — presentation slides, notes, or a brief — you can
ingest it directly into section files instead of authoring from scratch in Copilot.
Ingestion is handled by the CLI; no model is involved.

## When to use ingestion

- You have a PowerPoint deck or slide notes you want to use as the raw content
- A colleague has already written content for some sections
- You want to pre-populate sections before the author skill refines them

**Binary `.pptx` files are not supported in v1.** Copy the text content from your
slides and paste it into the JSON map (see below).

## Option A — JSON map (multiple sections)

Create a JSON file mapping section IDs to their text content:

```json
{
  "project-background": "The order-management system stores state in a self-hosted relational database...",
  "detailed-scope": "Migrate the order-management datastore to the managed platform...",
  "out-of-scope": "Reworking the application logic and changing the public API are out of scope.",
  "risks-mitigations": "- **Data loss during cutover.** Mitigation: dual-write validation window.\n- **Extended downtime.** Mitigation: rehearsed migration with go/no-go checkpoint."
}
```

Save it as (e.g.) `deck.json`, then run:

```bash
node cli/bin/doqmentary.mjs ingest my-solution --map deck.json
```

Sections in the map are written to their section files with `status: ingested`.
Sections not in the map are left unchanged (still `status: draft`).

If the map references an unknown section ID, the command reports the unknown IDs and
returns a non-zero exit code — no partial writes occur for unknown sections.

## Option B — Single section (inline text)

For a single section, pass the content inline:

```bash
node cli/bin/doqmentary.mjs ingest my-solution \
  --section project-background \
  --text "The order-management system stores state in a self-hosted database..."
```

## After ingestion

Ingested sections have raw deck content. You can:

1. **Use as-is** — if the text is already well-structured and complete
2. **Refine with the author skill** — invoke `@author-solution-outline` to polish
   ingested sections and fill any gaps
3. **Edit directly** — open the section file in VS Code and edit the markdown body

Once sections are populated, proceed with `doqmentary assemble` and validation as
described in [Guides/Your-First-Document](Your-First-Document).

## Overwriting existing content

Ingest **overwrites** the body of a section file if the file already exists. The
front matter (`id`, `title`, `layer`) is preserved; only the body is replaced. There
is no undo — commit your section files to git before running ingest if you want a
rollback point.
