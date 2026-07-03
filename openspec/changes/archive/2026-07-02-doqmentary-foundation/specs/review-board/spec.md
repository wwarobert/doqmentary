## ADDED Requirements

### Requirement: Persona-based review board
The system SHALL review each document with a review board composed of the configured personas. In the default configuration the board SHALL include an Enterprise Architect persona, a Solution Architect persona, and a Manager (non-technical readability) persona.

#### Scenario: Each configured persona reviews
- **WHEN** a document is submitted for review
- **THEN** the system SHALL run one review pass per configured persona

#### Scenario: Persona-specific lens
- **WHEN** a persona reviews the document
- **THEN** it SHALL evaluate against its declared lens: the Enterprise Architect against principles and decisions alignment, the Solution Architect against technical soundness, and the Manager against readability for a non-technical reader

### Requirement: Review board is the quality gate
Because there is no build or compilation step, review board approval SHALL be the definition of "done" for a document. A document SHALL NOT be considered ready for publication until every configured persona approves.

#### Scenario: Approval required from all personas
- **WHEN** at least one configured persona has not approved
- **THEN** the document SHALL NOT be marked ready for publication

#### Scenario: All approvals mark readiness
- **WHEN** every configured persona approves
- **THEN** the document SHALL be marked ready for publication

### Requirement: Revise loop
When a persona raises issues, the system SHALL support revising the affected sections and re-running the review, forming an author–review–revise loop.

#### Scenario: Feedback returns to authoring
- **WHEN** a persona reports issues on a section
- **THEN** the system SHALL allow revision of that section and re-submission to the review board

### Requirement: Completeness and alignment checks
The review SHALL confirm that every configured section is present and non-empty, that the enterprise principles and decisions referenced are honored, and that the document is readable by a non-technical reader.

#### Scenario: Missing section blocks approval
- **WHEN** a configured section is absent or empty
- **THEN** the review board SHALL report it and SHALL NOT approve the document
