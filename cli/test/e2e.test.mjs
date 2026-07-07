/**
 * End-to-end test: new → ingest → assemble → validate in a temporary root.
 * Uses only committed example fixtures and inline text — no private content.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cmdNew } from '../src/commands/new.mjs';
import { cmdIngest } from '../src/commands/ingest.mjs';
import { cmdAssemble } from '../src/commands/assemble.mjs';
import { cmdValidate } from '../src/commands/validate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Deck text derived from the committed sample fixture (deck.json).
const DECK = {
  background: 'The order-management system stores state in a self-hosted relational database that the team patches and scales by hand.',
  scope: 'Migrate the order-management datastore to the managed platform, including schema, data, and connection strings.',
};

test('new → ingest → assemble → validate pipeline completes successfully', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'doqmentary-e2e-'));
  try {
    // Minimal two-section config so all steps can succeed without private content.
    fs.writeFileSync(
      path.join(root, 'doqmentary.yaml'),
      `version: 1\noutput:\n  target: markdown\n  dir: wiki\nsections:\n  - id: background\n    title: Background\n    layer: situation\n  - id: scope\n    title: Scope\n    layer: situation\n`,
    );

    const a = (extra = {}) => ({ _: ['e2e-solution'], root, ...extra });

    // 1. new – scaffold section files.
    const newResult = cmdNew(a());
    assert.strictEqual(newResult.ok, true, `cmdNew failed: ${newResult.error}`);
    assert.deepEqual(newResult.created, ['background', 'scope']);

    // 2. ingest – populate sections from deck text.
    const mapFile = path.join(root, 'deck.json');
    fs.writeFileSync(mapFile, JSON.stringify(DECK));
    const ingestResult = cmdIngest(a({ map: mapFile }));
    assert.strictEqual(ingestResult.ok, true, `cmdIngest failed: unknown=${JSON.stringify(ingestResult.unknown)}`);
    assert.deepEqual(ingestResult.written.sort(), ['background', 'scope']);

    // 3. assemble – produce wiki pages and nav.
    const assembleResult = cmdAssemble(a());
    assert.strictEqual(assembleResult.ok, true, `cmdAssemble link issues: ${JSON.stringify(assembleResult.linkIssues)}`);
    assert.ok(assembleResult.pages.includes('index.md'));
    assert.ok(assembleResult.pages.includes('background.md'));
    assert.ok(assembleResult.pages.includes('scope.md'));
    assert.ok(assembleResult.pages.includes('_sidebar.md'));

    // Assert output files exist on disk.
    const wikiDir = path.join(root, 'documents', 'e2e-solution', 'wiki');
    for (const file of ['index.md', 'background.md', 'scope.md', '_sidebar.md']) {
      assert.ok(fs.existsSync(path.join(wikiDir, file)), `Missing output file: ${file}`);
    }

    // 4. validate – all sections present and non-empty; wiki links intact.
    const validateResult = cmdValidate(a());
    assert.strictEqual(validateResult.ok, true, `cmdValidate issues: ${JSON.stringify(validateResult.issues)}`);
    assert.strictEqual(validateResult.issues.length, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
