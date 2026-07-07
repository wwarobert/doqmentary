## Why

Teams adopting doqmentary have no structured getting-started resource. The root
`README.md` provides an architectural overview and the `cli/README.md` a command
reference, but neither guides an adopter through the concrete steps of setting up the
tool for their organisation, customising the enterprise libraries, and producing a
first document. The brain/hands split — the most distinctive and confusing aspect of
the system — is explained conceptually but never shown as an interleaved workflow.
Without a getting-started wiki, every new user must reverse-engineer the workflow
from scattered references.

## What Changes

A full structured **GitHub Wiki** targeting the adopter persona (a team or individual
setting up doqmentary for their organisation). The wiki is maintained as markdown
source in a `wiki/` directory in the main repo, mirroring the GitHub Wiki git
repository's structure for easy sync.

Content is organised into four sections:

- **Concepts** — the mental models every user needs: the brain/hands split, document
  anatomy, enterprise libraries, and the review board.
- **Setup** — concrete installation, enterprise library configuration, and
  section/persona customisation steps.
- **Guides** — narrative walkthroughs: first document end-to-end, ingesting deck
  content, and running the review board.
- **Reference** — CLI commands, configuration schema, and section-type definitions.

## Capabilities

### New Capabilities
- `wiki-content`: The wiki pages and their navigation sidebar.

### Modified Capabilities
<!-- None -->

## Impact

- New directory: `wiki/` containing 14 content pages, a home page, and a
  navigation sidebar.
- No changes to CLI, skills, agents, instructions, or configuration schema.
- Wiki source is committed to the main repo; syncing to the GitHub Wiki git
  repo (`*.wiki.git`) is a manual step (automated sync is deferred to a later change).
