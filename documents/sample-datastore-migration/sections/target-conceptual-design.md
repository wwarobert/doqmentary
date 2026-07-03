---
id: target-conceptual-design
title: Target conceptual design
status: authored
layer: situation
---

```mermaid
flowchart LR
  App[Order-management app] -->|workload identity| IdP[Central identity provider]
  App --> DB[(Managed database)]
  DB --> Backup[Automated backups]
  DB --> Replica[(In-region replica)]
```

The order-management application authenticates through the central identity provider
using its workload identity and connects to a managed database instance. The managed
platform provides automated backups and an in-region replica for resilience.
