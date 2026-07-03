---
id: PRIN-003
title: Data residency stays in-region
status: active
tags: [data, compliance, residency]
---

**Statement.** Regulated and personal data remains within its designated geographic
region unless a documented legal basis permits otherwise.

**Rationale.** Data-residency obligations are a hard compliance constraint; violating
them creates legal and reputational risk that outweighs architectural convenience.

**Implications.** Region selection, replication, and backup topology must respect the
data's residency class; cross-region flows must be identified and justified.
