## ADDED Requirements

### Requirement: Named document type definitions
The system SHALL support a `document-types/` directory containing named type configuration files. Each file SHALL define the `sections`, `personas`, and `title` for that type and SHALL follow the same schema as a per-document `doqmentary.yaml`.

#### Scenario: Type file defines sections and personas
- **WHEN** a file `document-types/solution-outline.yaml` exists and declares `sections` and `personas`
- **THEN** any document whose config declares `type: solution-outline` SHALL use those sections and personas as its intermediate config layer

#### Scenario: Missing type file reported on validate
- **WHEN** a document config declares a `type` that has no corresponding file in `document-types/`
- **THEN** `doqmentary validate` SHALL report the unknown type as an issue and exit non-zero

### Requirement: Example types ship with the repo
The system SHALL ship at least one committed example type config (`*.example.yaml`) in `document-types/` that demonstrates the type schema and serves as a test fixture.

#### Scenario: Example type is tracked by git
- **WHEN** the repo is cloned fresh
- **THEN** `document-types/*.example.yaml` files SHALL be present and usable as type configs

### Requirement: Real org types stay private
The `.gitignore` SHALL exclude `document-types/*.yaml` while allowing `document-types/*.example.yaml` and `document-types/README.md`, so that adopting orgs can define private type configs that are never committed.

#### Scenario: Real type config not staged
- **WHEN** a file `document-types/my-org-type.yaml` exists (not `.example.yaml`)
- **THEN** `git status` SHALL NOT show it as a tracked or staged file
