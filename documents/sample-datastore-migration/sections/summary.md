---
id: summary
title: Summary
status: synthesized
layer: synthesis
derived: true
---

## Scope & background

A self-hosted, hand-operated order-management database is nearing end-of-life and
causing failover incidents; this effort migrates it to the managed database platform.

## Project architecture

The application connects through the central identity provider to a managed database
with automated backups and an in-region replica.

## Project principles

Applies `PRIN-001` (prefer managed services) by moving off the self-hosted engine,
`PRIN-002` (secure by default) via workload-identity access and encryption, and
`PRIN-003` (data residency) via in-region replication.

## Dependencies

Depends on the managed platform being available in the required region and on the
central identity provider supporting the application's workload identity.
