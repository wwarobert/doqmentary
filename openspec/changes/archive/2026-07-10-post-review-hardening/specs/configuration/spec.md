## ADDED Requirements

### Requirement: Type name validation before file resolution
The system SHALL validate that a `type` value does not contain path-traversal components (`/`, `\`, `..`) before constructing the file path. An invalid type name SHALL throw `InvalidTypeNameError`, which `validate` surfaces as an `invalid-type` issue distinct from `unknown-type`.

#### Scenario: Type name with path-traversal component is rejected
- **WHEN** a document config declares `type: ../../secret`
- **THEN** `loadEffectiveConfig` SHALL throw `InvalidTypeNameError` without accessing the filesystem
- **AND** `doqmentary validate` SHALL report an `invalid-type` issue and exit non-zero

#### Scenario: Type name with backslash is rejected
- **WHEN** a document config declares `type: ..\secret`
- **THEN** `loadEffectiveConfig` SHALL throw `InvalidTypeNameError`

#### Scenario: Valid kebab-case type name is not rejected
- **WHEN** a document config declares `type: solution-outline.example`
- **THEN** the guard SHALL not trigger and normal type resolution SHALL proceed
