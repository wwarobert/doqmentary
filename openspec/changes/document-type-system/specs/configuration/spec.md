## ADDED Requirements

### Requirement: Document type as intermediate config layer
When a per-document configuration declares a `type` field, the system SHALL load the corresponding `document-types/<type>.yaml` file and insert it as an intermediate layer between the global default and the per-document override. The effective configuration resolution order SHALL be: global `doqmentary.yaml` → `document-types/<type>.yaml` → per-document `doqmentary.yaml`.

#### Scenario: Type layer supplies sections
- **WHEN** a document config declares `type: adr` and `document-types/adr.yaml` defines `sections`
- **THEN** the effective `sections` for that document SHALL come from `document-types/adr.yaml` unless the per-document config also declares `sections`

#### Scenario: Per-document override still wins
- **WHEN** a document config declares `type: adr` and also declares its own `sections`
- **THEN** the per-document `sections` SHALL replace the type's sections entirely (wholesale replace, consistent with existing merge semantics)

#### Scenario: No type field — existing behavior unchanged
- **WHEN** a document config does not declare a `type` field
- **THEN** the effective config SHALL be resolved exactly as before: global defaults merged with per-document overrides, with no intermediate layer

## MODIFIED Requirements

### Requirement: Declarative configuration
The system SHALL be driven by a declarative configuration that defines `sections`, `personas`, `output`, `language`, and optionally `type`. Adding or removing a section or persona SHALL require only editing configuration, not code.

#### Scenario: Add a section via config
- **WHEN** a user adds a new entry to the `sections` list in configuration
- **THEN** the author skill, review board, and CLI assembly SHALL include that section without any code change

#### Scenario: Remove a persona via config
- **WHEN** a user removes a persona entry from the `personas` list
- **THEN** the review board SHALL run without that persona and SHALL NOT report it as missing

#### Scenario: Set the document language
- **WHEN** the `language` field is set to a supported language code
- **THEN** authored content and the assembled document SHALL be produced in that language

#### Scenario: Set the document type
- **WHEN** the `type` field is set to a name matching a file in `document-types/`
- **THEN** that type's sections and personas SHALL form the intermediate layer of the effective configuration for that document
