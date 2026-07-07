/**
 * Asserts the .gitignore version-control boundary:
 * - plain enterprise/principles/PRIN-X.md  → ignored
 * - enterprise/principles/PRIN-001.example.md → not ignored (tracked)
 * - plain enterprise/decisions/ADR-X.md    → ignored
 * - enterprise/decisions/ADR-001.example.md  → not ignored (tracked)
 *
 * Uses `git check-ignore --quiet <path>` which exits 0 when ignored, 1 when not.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

function gitCheckIgnore(relativePath) {
  return spawnSync('git', ['check-ignore', '--quiet', relativePath], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
}

test('enterprise/principles/PRIN-X.md is git-ignored', () => {
  const result = gitCheckIgnore('enterprise/principles/PRIN-X.md');
  assert.strictEqual(result.status, 0, 'Expected PRIN-X.md to be ignored by .gitignore');
});

test('enterprise/principles/PRIN-001.example.md is not git-ignored', () => {
  const result = gitCheckIgnore('enterprise/principles/PRIN-001.example.md');
  assert.strictEqual(result.status, 1, 'Expected PRIN-001.example.md to be tracked (not ignored)');
});

test('enterprise/decisions/ADR-X.md is git-ignored', () => {
  const result = gitCheckIgnore('enterprise/decisions/ADR-X.md');
  assert.strictEqual(result.status, 0, 'Expected ADR-X.md to be ignored by .gitignore');
});

test('enterprise/decisions/ADR-001.example.md is not git-ignored', () => {
  const result = gitCheckIgnore('enterprise/decisions/ADR-001.example.md');
  assert.strictEqual(result.status, 1, 'Expected ADR-001.example.md to be tracked (not ignored)');
});
