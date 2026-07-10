## ADDED Requirements

### Requirement: List command surfaces all documents
The CLI SHALL provide a `list` command that walks the `documents/` directory, reads each document's effective configuration, and prints a catalog of document name, type, and assembly status.

#### Scenario: List shows all documents
- **WHEN** the user runs `doqmentary list`
- **THEN** the CLI SHALL output one row per document in `documents/`, showing its folder name, `type` value (or `—` if unset), and whether it has been assembled

#### Scenario: List filtered by type
- **WHEN** the user runs `doqmentary list --type solution-outline`
- **THEN** the CLI SHALL output only documents whose effective config declares `type: solution-outline`

#### Scenario: List with JSON output
- **WHEN** the user runs `doqmentary list --json`
- **THEN** the CLI SHALL emit a JSON array where each element contains `name`, `type`, and `assembled` fields

#### Scenario: Empty document store
- **WHEN** the `documents/` directory contains no document subdirectories
- **THEN** `doqmentary list` SHALL exit zero and print a message indicating no documents were found
