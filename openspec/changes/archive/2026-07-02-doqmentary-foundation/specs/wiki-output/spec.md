## ADDED Requirements

### Requirement: Wiki document assembly
The system SHALL assemble approved section content into a navigable "document" composed of multiple linked pages: one page per body section plus a home page. In v1 the output SHALL be plain linked markdown.

#### Scenario: One page per section plus home
- **WHEN** a document is assembled
- **THEN** the output SHALL contain one markdown page per body section and a home page

#### Scenario: Plain linked markdown in v1
- **WHEN** the output format is the v1 default
- **THEN** pages SHALL link to each other using relative markdown links portable across common wiki renderers

### Requirement: Home page is the synthesized summary
The home page SHALL be the synthesized Summary, and its blocks SHALL link to the detail pages they summarize.

#### Scenario: Summary blocks link to detail pages
- **WHEN** the home page is assembled
- **THEN** each summary block SHALL link to the detail page it summarizes

### Requirement: Navigation manifest is pluggable
The system SHALL generate navigation for the configured output target, and the navigation mechanism SHALL be pluggable so that additional targets (for example Azure DevOps `.order` or MkDocs `mkdocs.yml`) can be added without changing page content.

#### Scenario: Target selects nav mechanism
- **WHEN** the `output.target` is set
- **THEN** the assembler SHALL generate the navigation manifest appropriate to that target while leaving page bodies unchanged

### Requirement: Cross-link integrity
Assembled documents SHALL contain no broken internal links between pages.

#### Scenario: Internal links resolve
- **WHEN** a document is assembled
- **THEN** every internal link SHALL point to an existing page within the document
