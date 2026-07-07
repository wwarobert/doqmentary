## ADDED Requirements

### Requirement: Full structured GitHub Wiki for adopters
The system SHALL provide a GitHub Wiki that covers concepts, setup, guides, and
reference for a team adopting doqmentary.

#### Scenario: Adopter can go from zero to first document
- **WHEN** a new adopter reads the wiki
- **THEN** they SHALL be able to install the tool, configure their enterprise
  libraries, and produce a first assembled, validated document without referring
  to any other source

#### Scenario: Interleaved workflow is documented
- **WHEN** an adopter reads the Your-First-Document guide
- **THEN** they SHALL see which steps happen in the terminal (CLI) and which
  happen in Copilot Chat (brain), in the correct order

#### Scenario: Enterprise library setup is documented
- **WHEN** an adopter reads the Configure-Enterprise-Libraries page
- **THEN** they SHALL know how to add a real principle or decision, understand
  the `*.example.md` naming convention, and understand the gitignore boundary

#### Scenario: Wiki navigation covers all pages
- **WHEN** an adopter views the GitHub Wiki sidebar
- **THEN** every published page SHALL appear in the sidebar, grouped by section

### Requirement: Wiki source is reviewable
The wiki source SHALL be committed to the main repository under `wiki/` so that
changes can be reviewed via pull requests before being synced to the GitHub Wiki.

#### Scenario: Wiki changes go through PR review
- **WHEN** a wiki page is updated
- **THEN** the change SHALL be committed to `wiki/` in the main repo and reviewed
  via a PR before the wiki git repo is updated
