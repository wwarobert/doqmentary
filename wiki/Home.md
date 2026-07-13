Config-driven solution outlines as reviewable markdown — the document is the deliverable.

Solution architects re-author the stable ~80% of every solution outline by hand, repeatedly
restating the same enterprise principles and prior decisions. doqmentary turns outlines into
config-driven markdown documents where the stable enterprise layer is injected automatically,
only the situation-specific parts are authored, and every document passes a persona-based
review board before publication.

## How it works

```
  1. CONFIGURE       2. AUTHOR           3. REVIEW            4. ASSEMBLE
  ─────────────      ─────────────────   ──────────────────   ─────────────
  doqmentary.yaml    Copilot Chat:       Review board:        CLI:
  declares sections  author skill        3 personas           assemble +
  and personas       fills each block    approve the          validate →
                     section by section  document             linked wiki
```

| Step | Where | Tool |
|------|-------|------|
| Configure sections and personas | Repo | Edit `doqmentary.yaml` |
| Scaffold a new document | Terminal | `doqmentary new` |
| Author sections | Copilot Chat | `@author-solution-outline` |
| Assemble wiki | Terminal | `doqmentary assemble` |
| Validate | Terminal | `doqmentary validate` |
| Review | Copilot Chat | `@review-enterprise-architect`, `@review-solution-architect`, `@review-manager-readability` |

## Where to start

| I want to… | Go to |
|------------|-------|
| Understand the core concepts | [Concepts/Brain-and-Hands-Split](Concepts/Brain-and-Hands-Split) |
| Install and set up doqmentary | [Setup/Prerequisites](Setup/Prerequisites) |
| Write my first document now | [Guides/Your-First-Document](Guides/Your-First-Document) |
| Look up a CLI command | [Reference/CLI-Commands](Reference/CLI-Commands) |
| Understand the config schema | [Reference/Configuration-Schema](Reference/Configuration-Schema) |
