# Your First Document

This guide walks through the complete workflow for producing a validated, reviewed
solution outline. It shows exactly which steps happen in the **terminal** (CLI) and
which happen in **Copilot Chat** (the brain).

**Estimated time:** 30–60 minutes for a real document; 10 minutes for a test run.

**Prerequisites:** [Installation](../Setup/Installation) complete, enterprise
libraries populated (or examples used for a test run).

---

## Step 1 — Scaffold the document (terminal)

Choose a solution name in kebab-case (e.g. `order-management-migration`):

```bash
node cli/bin/doqmentary.mjs new order-management-migration
```

This creates `documents/order-management-migration/sections/` with one file per
configured section, each containing front matter and a hint comment.

```
documents/order-management-migration/
└── sections/
    ├── summary.md              ← derived, do not author directly
    ├── project-background.md
    ├── detailed-scope.md
    ├── out-of-scope.md
    ├── target-conceptual-design.md
    ├── key-design-decisions.md
    ├── assumptions-dependencies.md
    ├── risks-mitigations.md
    └── next-steps.md
```

---

## Step 2 — Author the sections (Copilot Chat)

Open Copilot Chat in VS Code and invoke the author skill:

```
@author-solution-outline  Start authoring documents/order-management-migration/
```

The skill iterates through sections in order:

| Section type | What the skill does |
|---|---|
| `enterprise` (principles, decisions) | Auto-selects relevant entries from your libraries and writes the block |
| `situation` | Interviews you with targeted questions, writes your answers into the section |
| `synthesis` (Summary) | Synthesised last from the authored body sections |

**Tips:**
- Answer questions directly in Copilot Chat — the skill writes the answers to the section files.
- For `target-conceptual-design`, the skill emits architecture as a **Mermaid diagram**. Describe your architecture in plain language and it generates the diagram.
- If you have existing deck content (slides, notes), skip this step and use [ingest](Ingest-Deck-Content) instead.

The skill finishes by synthesising the **Summary** section from the body.

---

## Step 3 — Assemble the wiki (terminal)

```bash
node cli/bin/doqmentary.mjs assemble order-management-migration
```

This writes the assembled wiki to `documents/order-management-migration/wiki/`:
- One page per body section
- `index.md` — home page from the Summary
- `_sidebar.md` — navigation manifest

---

## Step 4 — Validate (terminal)

```bash
node cli/bin/doqmentary.mjs validate order-management-migration
```

Validation checks:
- Every configured section exists and is non-empty
- No broken internal links in the assembled wiki

If validation fails, fix the reported issues and re-run assemble + validate.

---

## Step 5 — Run the review board (Copilot Chat)

Invoke each persona in turn. The order does not matter but running the Enterprise
Architect first is conventional (their feedback often prompts body changes that
affect the other reviews):

```
@review-enterprise-architect  Review documents/order-management-migration/
```
```
@review-solution-architect    Review documents/order-management-migration/
```
```
@review-manager-readability   Review documents/order-management-migration/
```

Each persona returns **Approved** or **Changes requested** with specific, actionable
feedback. Address the feedback in the section files, then re-run any persona that
requested changes.

See [Guides/Review-and-Publish](Review-and-Publish) for detail on the review cycle.

---

## Step 6 — Final assemble (terminal)

After all review edits are complete and all three personas have approved, re-assemble
to incorporate any changes made during review:

```bash
node cli/bin/doqmentary.mjs assemble order-management-migration
node cli/bin/doqmentary.mjs validate order-management-migration
```

The document is now complete. Share the contents of
`documents/order-management-migration/wiki/` or publish it to your preferred wiki
platform.

---

## Quick reference

```
TERMINAL                                   COPILOT CHAT
──────────────────────────────────         ─────────────────────────────────────
doqmentary new <solution>                  
                                           @author-solution-outline
                                             → fills enterprise blocks
                                             → interviews for situation blocks
                                             → synthesizes Summary
doqmentary assemble <solution>             
doqmentary validate <solution>             
                                           @review-enterprise-architect
                                           @review-solution-architect
                                           @review-manager-readability
                                             → address feedback
doqmentary assemble <solution>  ← re-run  
doqmentary validate <solution>  ← re-run  
```
