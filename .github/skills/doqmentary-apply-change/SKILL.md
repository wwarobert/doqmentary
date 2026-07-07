---
name: doqmentary-apply-change
description: Implement tasks from a doqmentary change. Use when the user wants to start implementing, continue implementation, or work through tasks.
---

Implement tasks from a doqmentary change.

**Input**: Optionally specify a change name. If omitted, infer from conversation context. If ambiguous, prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `openspec list --json` and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: `<name>`" and how to override (e.g., `/doqmentary:apply <other>`).

2. **Check status**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse: `schemaName`, `planningHome`, `changeRoot`, `actionContext`.

3. **Get apply instructions**
   ```bash
   openspec instructions apply --change "<name>" --json
   ```
   Returns `contextFiles`, progress, task list, and dynamic instruction.

   - `state: "blocked"` → show message, suggest completing missing artifacts first
   - `state: "all_done"` → congratulate, suggest `/doqmentary:archive`
   - Otherwise → proceed

4. **Read context files**

   Read every file listed under `contextFiles` (proposal, specs, design, tasks).

5. **Before starting — doqmentary pre-flight checklist**

   Identify the layer of each pending task:
   - **Hands tasks** (touching `cli/src/`, `cli/bin/`, `cli/test/`):
     - Run `cd cli && npm test` from the **repo root** before and after each hands task
     - **Never add model calls to CLI source** — the CLI is deterministic and offline; all generation and judgment belongs in Copilot primitives
     - Only one external dependency allowed (`js-yaml`); do not add others without discussion
   - **Brain tasks** (touching `.github/skills/`, `.github/agents/`, `.github/instructions/`, `.github/prompts/`):
     - No automated test suite; correctness is verified by reading and reasoning
     - `documents/**/wiki/` output is regenerable via `assemble` — no careful git handling needed there
   - **Both**: apply hands guardrails for any CLI file touched

6. **Show current progress**

   Display:
   - Schema and layer classification
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

7. **Implement tasks (loop until done or blocked)**

   For each pending task:
   - State which task is being worked on
   - Make changes — minimal and focused
   - Mark complete in tasks file: `- [ ]` → `- [x]`
   - Continue to next task

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

8. **On completion or pause, show status**

   Display tasks completed this session and overall progress.
   If paused: explain why and wait for guidance.
   If all done: proceed to the closing checklist below.

## Closing checklist (all tasks complete)

Run this when every task in `tasks.md` is marked `[x]`.

**a. Sync delta specs (if any exist)**

Check whether the change has delta specs:
```bash
openspec status --change "<name>" --json
```
If `artifactPaths.specs.existingOutputPaths` is non-empty, offer to sync:
> "Delta specs found. Sync to `openspec/specs/` now? (recommended before archiving)"

If yes, for each delta spec file apply its ADDED/MODIFIED/REMOVED/RENAMED sections to the corresponding `openspec/specs/<capability>/spec.md`. Create the main spec file if it doesn't exist yet.

If no, skip — the contributor can sync later by running `openspec` directly.

**b. Archive the change**

Offer:
> "Archive this change? This moves it to `openspec/changes/archive/` and keeps the active folder clean."

If yes:
```bash
# Generate archive name with today's date
$date = Get-Date -Format "yyyy-MM-dd"
Move-Item "openspec\changes\<name>" "openspec\changes\archive\$date-<name>"
```
Report the archive location.

If no, skip — the change folder stays in `openspec/changes/` and can be archived later.

**c. Final summary**

Report:
- Tasks completed
- Whether specs were synced
- Whether change was archived (and where)
- Overall: "Change complete ✓"

**Output During Implementation**

```
## Implementing: <change-name>

Working on task 3/7: <task description>
[...implementation...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation...]
✓ Task complete
```

**Output On Completion**

```
## Implementation Complete

**Change:** <change-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! Ready to archive — run `/doqmentary:archive`.
```

**Output On Pause (Issue Encountered)**

```
## Implementation Paused

**Change:** <change-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>

What would you like to do?
```

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting
- Run `cd cli && npm test` from repo root before and after every hands (CLI) task
- Never add model calls to `cli/src/` — all generation/judgment belongs in Copilot primitives
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest updating artifacts
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
