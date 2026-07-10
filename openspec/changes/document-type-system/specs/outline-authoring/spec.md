## MODIFIED Requirements

### Requirement: Configured sections drive authoring
The author skill SHALL produce content for exactly the sections defined in the effective configuration, in the configured order. The effective configuration is type-aware: when the document declares a `type`, the skill SHALL read the type's sections and adapt its framing accordingly.

#### Scenario: Author honors configured section set
- **WHEN** the effective configuration defines a set of sections
- **THEN** the author skill SHALL produce one unit of content per configured section and no others

#### Scenario: Author adapts framing to document type
- **WHEN** the document declares `type: adr`
- **THEN** the author skill SHALL frame its interview and synthesis language to match an Architecture Decision Record rather than a solution outline

### Requirement: Fixed versus variable blocks
The author skill SHALL distinguish fixed blocks (populated from enterprise context or boilerplate) from variable blocks (situation-specific) and SHALL interview the user only for variable blocks.

#### Scenario: Fixed block auto-populated
- **WHEN** a section is bound to an enterprise library or marked as boilerplate
- **THEN** the author skill SHALL populate it from context without asking the user to write it

#### Scenario: Variable block prompted
- **WHEN** a section is situation-specific
- **THEN** the author skill SHALL prompt the user for the information needed to write it

### Requirement: Summary synthesized from body
The author skill SHALL generate the derived synthesis section last, by synthesizing it from the body sections, and SHALL NOT ask the user to author the synthesis section directly.

#### Scenario: Synthesis section generated after body
- **WHEN** all body sections have content
- **THEN** the author skill SHALL synthesize the derived section from them

#### Scenario: Incomplete body surfaces gaps
- **WHEN** the synthesis section cannot be produced because a body section is missing or empty
- **THEN** the author skill SHALL report which body section is incomplete rather than fabricate synthesized content

### Requirement: Deck text ingestion
The author skill SHALL accept pasted or attached source deck text as input and map it into the configured sections. Parsing of binary `.pptx` files is out of scope for this capability.

#### Scenario: Pasted deck text mapped to sections
- **WHEN** a user provides deck section text as input
- **THEN** the author skill SHALL map the provided content into the corresponding configured sections
