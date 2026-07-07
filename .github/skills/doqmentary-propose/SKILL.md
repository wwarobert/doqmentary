---
name: doqmentary-propose
description: Propose a new doqmentary change with all artifacts generated in one step. Use when the user wants to describe what they want to build and get a complete proposal with design, specs, and tasks ready for implementation.
---

Propose a new change — create the change directory and generate all artifacts in one step.

I'll create a change with:
- `proposal.md` (what & why)
- `design.md` (how)
- `tasks.md` (implementation steps)

When ready to implement, run `/doqmentary:apply`.

---

**Input**: A change name (kebab-case) OR a description of what you want to build.

**Steps**

1. **If no clear input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add new section layer" → `add-section-layer`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Classify the change**

   Before creating any artifacts, identify which layer the change touches:
   - **Brain** — Copilot primitives: `.github/skills/`, `.github/agents/`, `.github/instructions/`, `.github/prompts/`
   - **Hands** — CLI mechanics: `cli/src/`, `cli/test/`, `cli/bin/`
   - **Both** — change spans both layers

   Ask the user if it's not obvious. State the classification clearly: "This looks like a **hands** change (CLI source)." The classification guides task breakdown and guardrails in the task list.

3. **Create the change directory**
   ```bash
   openspec new change "<name>"
   ```

4. **Get the artifact build order**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to get:
   - `applyRequires`: artifact IDs needed before implementation
   - `artifacts`: list of all artifacts with status and dependencies
   - `planningHome`, `changeRoot`, `artifactPaths`, `actionContext`: path and scope context — use these, do not assume paths

5. **Create artifacts in sequence until apply-ready**

   Use the **TodoWrite tool** to track progress through the artifacts.

   Loop through artifacts in dependency order (no pending dependencies first):

   a. **For each artifact that is `ready`**:
      - Get instructions: `openspec instructions <artifact-id> --change "<name>" --json`
      - The JSON includes: `context`, `rules`, `template`, `instruction`, `resolvedOutputPath`, `dependencies`
      - Read any completed dependency files for context
      - Create the artifact file using `template` as structure; write to `resolvedOutputPath`
      - Apply `context` and `rules` as constraints — do NOT copy them into the file
      - Show brief progress: "Created `<artifact-id>`"

   b. **Continue until all `applyRequires` artifacts are done**
      - After each artifact, re-run `openspec status --change "<name>" --json`
      - Stop when every artifact ID in `applyRequires` has `status: "done"`

   c. **If an artifact needs user input**: use **AskUserQuestion tool**, then continue.

6. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

After all artifacts are created, summarize:
- Change name and location
- Brain / Hands / Both classification
- Artifacts created with brief descriptions
- "All artifacts created! Ready for implementation."
- "Run `/doqmentary:apply` or ask me to implement to start working on the tasks."

**Artifact Creation Guidelines**

- Follow the `instruction` field from `openspec instructions` for each artifact type
- Read dependency artifacts for context before creating new ones
- Use `template` as the structure for your output — fill in its sections
- **IMPORTANT**: `context` and `rules` are constraints for YOU, not content for the file — do NOT copy `<context>`, `<rules>`, `<project_context>` blocks into the artifact

**Guardrails**
- Create ALL artifacts needed for implementation (defined by the schema's `apply.requires`)
- Always read dependency artifacts before creating a new one
- If context is critically unclear, ask the user — but prefer reasonable decisions to keep momentum
- If a change with that name already exists, ask if the user wants to continue it or create a new one
- Verify each artifact file exists after writing before proceeding to next
