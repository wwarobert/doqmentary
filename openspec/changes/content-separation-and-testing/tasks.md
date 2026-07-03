## 1. Version-control boundary

- [x] 1.1 Add a root `.gitignore` excluding `cli/node_modules/` and `documents/**/wiki/`
- [x] 1.2 Extend `.gitignore` to ignore real `enterprise/principles/*` and `enterprise/decisions/*` while allowing `README.md` and `*.example.md`
- [x] 1.3 Rename seeded entries to `*.example.md` (`PRIN-001..003`, `ADR-001..002`), keeping frontmatter ids unchanged
- [x] 1.4 Update the `enterprise/principles/README.md` and `enterprise/decisions/README.md` index links to the `*.example.md` filenames
- [x] 1.5 Verify the CLI, author skill, and `enterprise-context.instructions.md` still resolve the examples (glob `*.md` matches `*.example.md`; ids unchanged)

## 2. Automated tests

- [ ] 2.1 Add a `cli/test/` folder and a `test` script using `node --test` (no new dependencies)
- [ ] 2.2 Unit tests: `deepMerge`/`loadEffectiveConfig` (override wins, lists replace wholesale, omitted inherit), `parseFrontmatter`, `bodyIsEmpty`
- [ ] 2.3 Unit tests: `checkLinks` (broken internal link reported; external/`../` skipped) and `buildNav` (markdown target)
- [ ] 2.4 Integration tests: `new` and `ingest` against a temp `--root`, asserting created/ingested sections and unknown-section handling
- [ ] 2.5 Integration tests: `assemble` (pages + home + nav, link integrity) and `validate` failure paths (missing/empty section → non-zero; broken link reported)
- [ ] 2.6 End-to-end test: `new → ingest → assemble → validate` in a temp dir seeded from the committed example fixtures; assert files and exit codes
- [ ] 2.7 Add a test asserting the gitignore boundary: a plain `enterprise/principles/PRIN-X.md` is ignored while `*.example.md` is tracked

## 3. Continuous integration

- [ ] 3.1 Add a GitHub Actions workflow (`.github/workflows/ci.yml`) triggered on push and pull_request
- [ ] 3.2 Steps: checkout → setup Node → `npm ci` in `cli/` → `npm test`, pinned to the public npm registry (ignore any private `.npmrc`)
- [ ] 3.3 Ensure a failing test fails the workflow (non-zero exit blocks merge)

## 4. Validation

- [ ] 4.1 Run the full test suite locally (`npm test` in `cli/`) and confirm all tests pass on a clean checkout
- [ ] 4.2 Confirm `git status` shows no `node_modules/`, no `wiki/`, and no non-example enterprise entries staged
- [ ] 4.3 Run `openspec validate --change content-separation-and-testing --type change --strict` and resolve any issues
