## Context

doqmentary ships five change-workflow Copilot skills (`openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `openspec-explore`, `openspec-sync-specs`) and five matching slash-command prompts (`opsx-*.prompt.md`). All five skills are generic openspec scaffolding: they carry multi-store boilerplate, reference `/opsx:*` commands, and contain no doqmentary-specific knowledge. A first-time contributor sees commands and conventions that are foreign to the doqmentary vocabulary and misses project-critical guardrails (no-model-in-CLI, test command, brain vs hands split).

## Goals / Non-Goals

**Goals:**
- All five skills renamed to `doqmentary-*` prefix; skill `name` fields match folder names
- All five prompts renamed to `doqmentary-*.prompt.md`; slash commands become `/doqmentary:*`
- Store-selection boilerplate stripped from every file
- `openspec` upstream metadata fields removed
- `doqmentary-apply-change` carries the brain/hands distinction and test command
- `doqmentary-propose` prompts contributor to classify work as brain or hands
- `doqmentary-explore` carries doqmentary domain framing
- `doqmentary.collection.yml` and `AGENTS.md` updated to use new names/paths
- Spec created for the `change-workflow` capability

**Non-Goals:**
- Changing the underlying openspec CLI calls (commands stay the same)
- Modifying any CLI source in `cli/`
- Adding new workflow steps beyond the existing five

## Decisions

**Prompts as thin shims**
Prompt files will contain only a `description` frontmatter field and a one-line body delegating to the skill. The skill is the single source of truth for behavior. Rationale: duplication between prompt and skill causes drift; the skill body is what the agent reads when invoked via the skill registry.

**Folder rename = delete old + create new**
Skill folders are renamed by creating new `doqmentary-*` folders and deleting the old `openspec-*` folders. The folder name must match the skill `name` field — there is no rename-in-place. Old folders are removed as part of the same change so the collection manifest is never in an inconsistent state.

**Doqmentary-specific injections per skill**

| Skill | What gets added |
|---|---|
| `doqmentary-propose` | Opening prompt to classify change as brain (`.github/skills|agents|instructions/`) or hands (`cli/src/`) before writing artifacts |
| `doqmentary-apply-change` | Before-implementation checklist: run `cd cli && npm test` from repo root; never add model calls to CLI code; `documents/**/wiki/` is regenerable |
| `doqmentary-explore` | Domain context block: solution outlines, Copilot primitives, brain/hands split; offer to create artifacts uses `/doqmentary:propose` |
| `doqmentary-archive-change` | Sync prompt reference updated to `/doqmentary:sync` |
| `doqmentary-sync-specs` | No additions beyond stripping boilerplate; specs path already correct |

## Risks / Trade-offs

**Divergence from upstream openspec** → Skills are now a doqmentary fork. Any future openspec skill updates must be manually reviewed and selectively applied. Accepted: doqmentary is opinionated enough that generic skills are actively harmful.

**`doqmentary.collection.yml` path references** → Paths must match new folder names exactly or the collection install will silently point to missing files. Mitigation: update collection manifest as part of the same PR.
