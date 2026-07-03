---
id: PRIN-002
title: Secure by default
status: active
tags: [security, identity]
---

**Statement.** Every component is secured by default: least-privilege identities,
encryption in transit and at rest, and no anonymous access.

**Rationale.** Retrofitting security is costlier and riskier than building it in.
Defaults determine the majority of the security posture.

**Implications.** Designs must name the identity model and the data-protection
approach; any deviation from secure defaults must be justified and mitigated.
