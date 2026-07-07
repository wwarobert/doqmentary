# Configure Sections and Personas

The global `doqmentary.yaml` at the repository root defines the sections and personas
used by all documents. Individual documents can override any setting in a
per-document `doqmentary.yaml`.

## Understanding the defaults

The shipped config defines a **9-section solution-outline template** and a **3-persona
review board**. These are starting points — adapt them to your organisation's needs.

View the full annotated defaults in [`doqmentary.yaml`](../doqmentary.yaml) (in the
repo root), or see [Reference/Configuration-Schema](Reference/Configuration-Schema).

## Adding a section

Add an entry to the `sections` list in `doqmentary.yaml`:

```yaml
sections:
  - id: cost-model           # kebab-case, used for filenames and links
    title: Cost model        # human-readable heading
    layer: situation         # situation | enterprise | synthesis
```

The new section will be scaffolded by `doqmentary new` and assembled by
`doqmentary assemble` on the next run. Existing documents are unaffected unless
you re-run `doqmentary new` (which skips already-existing files).

## Removing a section

Remove the entry from `sections`. Existing section files are not deleted — they
simply won't be included in future scaffolding or assembly. To clean up, delete
the section file manually.

## Reordering sections

The order of entries in `sections` controls the order of pages in the assembled wiki
and the order in which the author skill fills sections. Change the list order in
`doqmentary.yaml` to reorder.

## Per-document section overrides

A document can replace the global section list entirely by adding a `doqmentary.yaml`
inside its folder:

```
documents/my-solution/doqmentary.yaml
```

```yaml
# Completely replaces the global sections list for this document.
sections:
  - id: background
    title: Background
    layer: situation
  - id: scope
    title: Scope
    layer: situation
```

Per-document lists **replace** the global list wholesale — they are not merged or
appended. Any value omitted from the per-document config is inherited from the global.

## Customising personas

Personas are Copilot agent files at `.github/agents/<persona-id>.agent.md`. Each file
contains the persona's lens description and checklist.

To add a custom persona:
1. Create `.github/agents/review-my-persona.agent.md` following the pattern of the
   existing agent files.
2. Add an entry to the `personas` list in `doqmentary.yaml`:
   ```yaml
   personas:
     - id: review-my-persona
       title: My Custom Reviewer
       lens: What this persona reviews for.
       checks:
         - First checklist item.
         - Second checklist item.
   ```
3. The new persona becomes available as `@review-my-persona` in Copilot Chat.

---

Next: [Guides/Your-First-Document](Guides/Your-First-Document)
