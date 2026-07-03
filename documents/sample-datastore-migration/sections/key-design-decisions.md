---
id: key-design-decisions
title: Key design decisions
status: authored
layer: enterprise
source: decisions
---

- **`ADR-001` — Standardize on the managed container platform.** *Impact:* reinforces
  choosing the managed database platform over a self-hosted engine, so the migration
  target aligns with the standardized operations model.
- **`ADR-002` — Centralized identity provider for all workloads.** *Impact:* the
  application connects to the new datastore using its workload identity through the
  central identity provider; no database-local credential store is introduced.
