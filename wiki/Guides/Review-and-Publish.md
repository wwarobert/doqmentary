# Review and Publish

This guide covers the full review cycle: invoking each persona, handling feedback,
iterating, and producing the final published wiki.

## Before reviewing

Ensure the document is assembled and valid:

```bash
node cli/bin/doqmentary.mjs assemble my-solution
node cli/bin/doqmentary.mjs validate my-solution
```

Validation must pass (exit 0) before submitting to the review board. A document with
missing sections or broken links will generate spurious review feedback.

## Invoking the review board

Open Copilot Chat in VS Code. Invoke each persona with the document path:

```
@review-enterprise-architect  Review documents/my-solution/
```

```
@review-solution-architect    Review documents/my-solution/
```

```
@review-manager-readability   Review documents/my-solution/
```

Each agent reads the section files, applies its checklist, and returns one of:

- **Approved** — the lens is satisfied, no action needed
- **Changes requested** — specific issues with the section, field, or passage that
  needs attention, plus guidance on how to address it

## Handling feedback

For each change request:

1. Open the relevant section file in `documents/my-solution/sections/`
2. Make the edit (directly in the file, or by asking Copilot Chat to help)
3. Re-run only the persona(s) that flagged the issue once you believe it is addressed

You do not need to re-run personas that already approved, unless your edits touched
content in their area.

## What each persona checks

**Enterprise Architect**
- Every referenced principle exists in the library and is relevant to this solution
- No applicable principle or decision was omitted
- Each selected entry records how it applies to this solution specifically

**Solution Architect**
- The target conceptual design is coherent and implementable as described
- Design decisions are justified with stated trade-offs
- Risks have concrete, proportionate mitigations
- Assumptions and dependencies are explicit and testable

**Manager (readability)**
- The Summary is understandable without reading the body sections
- Next steps have clear owners and actionable timescales
- No unexplained technical jargon in the Summary or Next steps

## When you are done

All three personas have approved in the same review pass with no outstanding change
requests. At this point:

1. Re-assemble to incorporate any last edits:
   ```bash
   node cli/bin/doqmentary.mjs assemble my-solution
   node cli/bin/doqmentary.mjs validate my-solution
   ```

2. The assembled wiki is in `documents/my-solution/wiki/`. Share it by:
   - Committing the wiki pages and linking to them in your project
   - Copying the pages to your team's wiki platform (Azure DevOps Wiki, Confluence, etc.)
   - Publishing via GitHub Pages

The `documents/my-solution/wiki/` directory is **git-ignored** in this repository.
If you want to track the assembled output, add an explicit negation in `.gitignore`
or copy to a separate publishing location.
