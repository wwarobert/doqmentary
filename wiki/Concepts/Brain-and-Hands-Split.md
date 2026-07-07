# Brain and Hands Split

doqmentary deliberately separates **judgment** from **mechanics**. This is the single
most important concept to understand before using the tool.

## The split

| | Role | Runs in | Calls a model? |
|---|---|---|---|
| **The brain** | Authoring, review, Summary synthesis | GitHub Copilot (skills + agents + instructions) | Yes |
| **The hands** | Scaffolding, ingest, assembly, validation | The `doqmentary` CLI | **No — deterministic, offline** |

## Why this split exists

**The brain (Copilot)** handles everything that requires judgment:
- Selecting which enterprise principles apply to this specific solution
- Interviewing the user to gather situation-specific content
- Synthesising a coherent Summary from the authored body sections
- Reviewing the document from each persona's lens

**The hands (CLI)** handle everything deterministic:
- Scaffolding section files with the correct front matter
- Writing ingested text into the right section files
- Assembling section files into a linked wiki
- Checking that all sections are present and links are valid

## Why it matters in practice

Because the CLI **never calls a model**, it:
- Works fully **offline** — no API credentials or network access needed
- Always produces the **same output** for the same input (testable, CI-able)
- Is **fast** — assembly and validation are sub-second

Because Copilot handles authoring and review, you get:
- The full model roster, without paying for a separate API
- Contextual judgment — the skill reads your enterprise libraries and config
- A conversational interface for the collaborative parts of documentation

## The workflow rhythm

```
  TERMINAL                           COPILOT CHAT
  ────────────────────               ─────────────────────────────────
  doqmentary new my-solution         
                                     @author-solution-outline
                                       (fill sections, synthesize Summary)
  doqmentary assemble my-solution    
  doqmentary validate my-solution    
                                     @review-enterprise-architect
                                     @review-solution-architect
                                     @review-manager-readability
  doqmentary assemble my-solution    
  (after any review edits)           
```

You switch between terminal and Copilot Chat at specific handoff points. The full
walkthrough is in [Guides/Your-First-Document](Guides/Your-First-Document).
