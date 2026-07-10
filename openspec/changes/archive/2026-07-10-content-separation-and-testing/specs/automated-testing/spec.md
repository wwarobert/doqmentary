## ADDED Requirements

### Requirement: Deterministic CLI test suite
The system SHALL provide an automated test suite that verifies the deterministic behaviors of the CLI. The suite SHALL run offline and SHALL NOT require any AI model.

#### Scenario: Test suite runs offline
- **WHEN** the test suite is executed without network or model access
- **THEN** it SHALL run to completion and report pass/fail results

### Requirement: Coverage of core behaviors
The test suite SHALL cover effective-configuration resolution, each CLI command, and wiki-output integrity, including both success and failure paths.

#### Scenario: Configuration merge is verified
- **WHEN** the configuration-resolution tests run
- **THEN** they SHALL assert that a per-document override wins, that lists are replaced wholesale, and that omitted values are inherited from the global defaults

#### Scenario: Validation failure path is verified
- **WHEN** a document with a missing or empty section is validated during tests
- **THEN** the test SHALL assert a reported issue and a non-zero exit status

#### Scenario: Link integrity is verified
- **WHEN** an assembled document containing a broken internal link is checked during tests
- **THEN** the test SHALL assert that the broken link is reported

### Requirement: End-to-end pipeline test
The test suite SHALL include an end-to-end test that runs the full `new → ingest → assemble → validate` pipeline and asserts the produced files and exit codes.

#### Scenario: Full pipeline succeeds on the example fixture
- **WHEN** the end-to-end test runs the pipeline against the committed example fixtures in a temporary location
- **THEN** it SHALL assert that the expected pages are produced and that validation exits successfully

### Requirement: Tests use committed fixtures only
The test suite SHALL exercise only committed example fixtures and SHALL NOT depend on any private company content.

#### Scenario: Green on a bare clone
- **WHEN** the test suite runs on a fresh clone that contains no private enterprise entries
- **THEN** all tests SHALL be able to run and pass using the shipped examples and sample sources
