# content-separation Specification

## Purpose

Define the version-control boundaries that keep regenerable, machine-specific, and company-private content out of the repository while ensuring shipped examples remain committed and active.

## Requirements

### Requirement: Version-control boundary
The repository SHALL exclude from version control all regenerable and machine-specific artifacts: installed dependencies and assembled wiki output. These SHALL be reproducible from committed sources.

#### Scenario: Dependencies are not committed
- **WHEN** the CLI dependencies are installed into `cli/node_modules/`
- **THEN** that directory SHALL be ignored by version control and SHALL be restorable from the committed lockfile

#### Scenario: Generated wiki output is not committed
- **WHEN** the assemble command produces wiki pages under a document's output directory
- **THEN** that generated output SHALL be ignored by version control and SHALL be reproducible by re-running assembly

### Requirement: Company-specific enterprise content stays private
Real enterprise `principles` and `decisions` entries SHALL be excluded from version control, so that company-specific content is never published, while the library index and shipped examples remain committed.

#### Scenario: A real principle is not committed
- **WHEN** a company adds a real entry to `enterprise/principles/` that is not an example
- **THEN** that entry SHALL be ignored by version control

#### Scenario: A real decision is not committed
- **WHEN** a company adds a real entry to `enterprise/decisions/` that is not an example
- **THEN** that entry SHALL be ignored by version control

### Requirement: Shipped examples remain committed and active
The framework SHALL ship example principles and decisions that are both committed to version control and treated as active enterprise context, so that authoring, review, and tests function on a fresh clone with no private content.

#### Scenario: Examples are committed
- **WHEN** the repository is cloned fresh
- **THEN** the example principles and decisions SHALL be present

#### Scenario: Examples are active context
- **WHEN** the author skill or a reviewer reads the enterprise libraries on a fresh clone
- **THEN** the shipped examples SHALL be selectable as enterprise context, with their stable identifiers resolving as before
