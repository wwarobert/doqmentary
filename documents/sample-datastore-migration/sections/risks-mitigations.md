---
id: risks-mitigations
title: Risk & mitigations
status: ingested
layer: situation
---

- **Data loss during cutover.** Mitigation: a dual-write validation window and a tested rollback path.
- **Extended downtime.** Mitigation: a rehearsed migration in a maintenance window with a go/no-go checkpoint.
