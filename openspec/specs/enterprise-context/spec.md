# enterprise-context Specification

## Purpose

Define the stable, global enterprise context libraries (principles and decisions) and how they are injected into Copilot and selectively applied with rationale during authoring and review.

## Requirements

### Requirement: Enterprise context libraries
The system SHALL maintain two stable, global enterprise context libraries: `principles` and `decisions`. Each entry SHALL be an individually identifiable item that can be selected and referenced by a document.

#### Scenario: Principle is individually addressable
- **WHEN** an enterprise principle is stored in the `principles` library
- **THEN** it SHALL have a stable identifier that a document can reference

#### Scenario: Decision is individually addressable
- **WHEN** a prior decision (ADR) is stored in the `decisions` library
- **THEN** it SHALL have a stable identifier that a document can reference

### Requirement: Context injection into Copilot
The system SHALL surface the enterprise libraries to GitHub Copilot as instructions so that authoring and review automatically have access to the applicable principles and decisions.

#### Scenario: Instructions applied during authoring
- **WHEN** the author skill runs for a document
- **THEN** the applicable enterprise principles and decisions SHALL be available to it as injected context without manual copying

### Requirement: Selection with rationale
When populating the "Project principles" and "Key design decisions" sections, the system SHALL select only the relevant library entries and SHALL state how each applies to the current document.

#### Scenario: Relevant principles selected with application note
- **WHEN** the author skill fills the "Project principles" section
- **THEN** it SHALL list only the principles relevant to the solution and SHALL include, for each, a note on how it applies

#### Scenario: Relevant decisions selected
- **WHEN** the author skill fills the "Key design decisions" section
- **THEN** it SHALL reference the relevant entries from the `decisions` library and SHALL state their impact on the solution
