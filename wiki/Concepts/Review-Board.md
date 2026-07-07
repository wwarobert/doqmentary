# Review Board

The review board is the quality gate for a doqmentary document. It consists of
three AI personas, each reviewing the document from a distinct lens. A document is
**done** when all three personas approve.

## Why a review board?

Solution outlines have no compiler. Without a systematic review, it's easy to miss
a relevant enterprise principle, leave a vague risk mitigation, or write a Summary
that reads well to an architect but confuses a stakeholder. The three-persona board
covers the three most common failure modes.

## The three personas

| Persona | Lens | Key checks |
|---------|------|------------|
| **Enterprise Architect** | Alignment with enterprise principles and prior decisions | Every referenced principle is relevant; no applicable principle omitted; each decision is honoured |
| **Solution Architect** | Technical soundness and pattern fitness | Design is coherent and implementable; trade-offs stated; risks have proportionate mitigations |
| **Manager (readability)** | Clarity for a non-technical reader | Summary is self-contained; next steps have clear owners and dates; no unexplained jargon |

## Running the review board in Copilot

Each persona is a Copilot agent. Invoke them by name in Copilot Chat with the
document context in scope:

```
@review-enterprise-architect  Review documents/my-solution/
@review-solution-architect    Review documents/my-solution/
@review-manager-readability   Review documents/my-solution/
```

Each agent reads the section files, applies its checklist, and returns either:
- **Approved** — this lens is satisfied
- **Changes requested** — specific issues with actionable feedback

## Iterating on feedback

Address each issue in the relevant section file, then re-run the persona that
flagged it. You do not need to re-run personas that already approved unless you
changed content in their area.

After addressing all feedback, run `doqmentary assemble` and `doqmentary validate`
again before considering the document final.

## What "done" means

All three personas have approved in the same iteration (no outstanding change
requests). The document can then be published (shared, linked, etc.) in its
assembled wiki form.

See [Guides/Review-and-Publish](Guides/Review-and-Publish) for the full review
workflow.
