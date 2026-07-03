# Source deck text — Datastore migration

Pasted/attached deck text used as the ingestion source for the sample document.
(v1 ingests text, not binary `.pptx`.) A machine-readable map of this text lives
in [`deck.json`](deck.json) and is fed to `doqmentary ingest`.

## Project background
The order-management system stores state in a self-hosted relational database that the
team patches and scales by hand. Incidents from manual failover and a looming
end-of-life for the current database version are driving a migration.

## Detailed scope
Migrate the order-management datastore to the managed database platform, including
schema, data, and application connection strings. Establish automated backups and
region-appropriate replication.

## Out of scope
Reworking the order-management application logic, changing the public API, and migrating
analytics/reporting stores are out of scope for this effort.

## Target conceptual design
The application connects through the central identity provider to a managed database
instance with automated backups and in-region replication.

## Assumptions and dependencies
Assumes the managed platform is available in the required region and that the central
identity provider supports the application's workload identity. Depends on the identity
provider's availability.

## Risks and mitigations
Risk: data loss during cutover. Mitigation: dual-write validation window and tested
rollback. Risk: extended downtime. Mitigation: rehearsed migration with a maintenance
window and a go/no-go checkpoint.

## Next steps
Confirm target region, schedule the migration window, and run a rehearsal in staging.
