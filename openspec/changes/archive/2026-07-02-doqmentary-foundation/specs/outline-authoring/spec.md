## ADDED Requirements

### Requirement: Configured sections drive authoring
The author skill SHALL produce content for exactly the sections defined in the effective configuration, in the configured order.

#### Scenario: Author honors configured section set
- **WHEN** the effective configuration defines a set of sections
- **THEN** the author skill SHALL produce one unit of content per configured section and no others

### Requirement: Fixed versus variable blocks
The author skill SHALL distinguish fixed blocks (populated from enterprise context or boilerplate) from variable blocks (situation-specific) and SHALL interview the user only for variable blocks.

#### Scenario: Fixed block auto-populated
- **WHEN** a section is bound to an enterprise library or marked as boilerplate
- **THEN** the author skill SHALL populate it from context without asking the user to write it

#### Scenario: Variable block prompted
- **WHEN** a section is situation-specific
- **THEN** the author skill SHALL prompt the user for the information needed to write it

### Requirement: Summary synthesized from body
The author skill SHALL generate the Summary (home) section last, by synthesizing it from the body sections, and SHALL NOT ask the user to author the Summary directly.

#### Scenario: Summary generated after body
- **WHEN** all body sections have content
- **THEN** the author skill SHALL synthesize the Summary from them

#### Scenario: Incomplete body surfaces gaps
- **WHEN** the Summary cannot be synthesized because a body section is missing or empty
- **THEN** the author skill SHALL report which body section is incomplete rather than fabricate summary content

### Requirement: Deck text ingestion
The author skill SHALL accept pasted or attached source deck text as input and map it into the configured sections. Parsing of binary `.pptx` files is out of scope for this capability.

#### Scenario: Pasted deck text mapped to sections
- **WHEN** a user provides deck section text as input
- **THEN** the author skill SHALL map the provided content into the corresponding configured sections
