## Context

doqmentary needs a getting-started wiki for adopters. The content must be accurate,
concise, and grounded in the actual tool — not aspirational. It must serve someone
who has never seen the repo before and needs to go from zero to a first published
document.

## Decisions

**D1 — Wiki source lives in `wiki/` in the main repo.**
Maintaining wiki source alongside code keeps it reviewable via PRs and avoids the
"orphaned wiki" problem. The `wiki/` directory mirrors the GitHub Wiki git repository
structure so pages can be pushed to `*.wiki.git` with a one-step `git push`.
Automated sync is deferred to a later change.

**D2 — Subdirectory organisation within `wiki/`.**
Pages are grouped into four subdirectories (`Concepts/`, `Setup/`, `Guides/`,
`Reference/`) matching the adopter's journey stages. GitHub Wiki supports
subdirectory paths in page URLs. A flat `_Sidebar.md` at the repo root provides
navigation.

**D3 — No `doqmentary` tool used for the wiki itself.**
The tool is designed for *solution outlines*, not general documentation. The wiki
pages are authored directly as markdown. Using the tool to document itself would
require adding a wiki-shaped section config that doesn't match the outline schema.

**D4 — Internal links use root-relative paths matching GitHub Wiki URLs.**
Links are written as `[text](Concepts/Brain-and-Hands-Split)` (no `.md` suffix) so
they resolve correctly in both the GitHub Wiki renderer and the repo file viewer.

**D5 — Content drawn from existing sources where available.**
CLI commands → `cli/README.md`. Configuration schema → annotated `doqmentary.yaml`.
Brain/hands overview → `README.md`. New writing is scoped to the genuinely missing
pages: the interleaved authoring walkthrough, enterprise library setup, and
section/persona customisation.

**D6 — `Your-First-Document` is the highest-priority page.**
Without this page every adopter must reconstruct the interleaved brain+hands
workflow from a CLI reference and an overview. It is the single page with the
most impact and the most new writing.
