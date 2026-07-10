# continuous-integration Specification

## Purpose

Define the continuous-integration workflow that runs the automated test suite on every push and pull request, using only public registries, and fails the build on any test failure.

## Requirements

### Requirement: Continuous integration runs the test suite
The system SHALL provide a continuous-integration workflow that runs the automated test suite on push and on pull request.

#### Scenario: Tests run on push
- **WHEN** commits are pushed to the repository
- **THEN** the CI workflow SHALL install dependencies and run the test suite

#### Scenario: Tests run on pull request
- **WHEN** a pull request is opened or updated
- **THEN** the CI workflow SHALL run the test suite and report status

### Requirement: Clean, public-registry environment
The CI workflow SHALL install dependencies from the public package registry and SHALL NOT depend on any private registry credentials.

#### Scenario: Install without private credentials
- **WHEN** the CI workflow installs the CLI dependencies
- **THEN** it SHALL resolve them from the public registry without requiring private authentication

### Requirement: Failing tests fail the build
The CI workflow SHALL fail when the test suite fails, so that regressions block merging.

#### Scenario: Build fails on a failing test
- **WHEN** any test in the suite fails during CI
- **THEN** the workflow SHALL exit with a non-zero status and report failure
