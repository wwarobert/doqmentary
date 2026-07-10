import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { cmdNew } from '../src/commands/new.mjs';
import { cmdIngest } from '../src/commands/ingest.mjs';
import { cmdAssemble } from '../src/commands/assemble.mjs';
import { cmdValidate } from '../src/commands/validate.mjs';
import { cmdList } from '../src/commands/list.mjs';

// ── helpers ───────────────────────────────────────────────────────────────────

const MINIMAL_CONFIG = `version: 1
output:
  target: markdown
  dir: wiki
sections:
  - id: background
    title: Background
    layer: situation
  - id: scope
    title: Scope
    layer: situation
`;

function makeTempRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doqmentary-int-'));
  fs.writeFileSync(path.join(dir, 'doqmentary.yaml'), MINIMAL_CONFIG);
  return dir;
}

function cleanupDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function args(root, solution, extra = {}) {
  return { _: [solution], root, ...extra };
}

function writeSectionFile(root, solution, id, body) {
  const file = path.join(root, 'documents', solution, 'sections', `${id}.md`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `---\nid: ${id}\ntitle: ${id}\nstatus: ingested\n---\n\n${body}\n`);
}

// ── cmdNew ────────────────────────────────────────────────────────────────────

test('cmdNew – creates section files for all configured sections', () => {
  const root = makeTempRoot();
  try {
    const result = cmdNew(args(root, 'sol'));
    assert.strictEqual(result.ok, true);
    assert.deepEqual(result.created, ['background', 'scope']);
    assert.strictEqual(result.skipped.length, 0);
    const sectionsDir = path.join(root, 'documents', 'sol', 'sections');
    assert.ok(fs.existsSync(path.join(sectionsDir, 'background.md')));
    assert.ok(fs.existsSync(path.join(sectionsDir, 'scope.md')));
  } finally {
    cleanupDir(root);
  }
});

test('cmdNew – skips existing section files', () => {
  const root = makeTempRoot();
  try {
    cmdNew(args(root, 'sol'));
    // Run again — both sections already exist.
    const result = cmdNew(args(root, 'sol'));
    assert.strictEqual(result.ok, true);
    assert.deepEqual(result.created, []);
    assert.deepEqual(result.skipped, ['background', 'scope']);
  } finally {
    cleanupDir(root);
  }
});

test('cmdNew – returns error when no solution is provided', () => {
  const root = makeTempRoot();
  try {
    const result = cmdNew({ _: [], root });
    assert.strictEqual(result.ok, false);
    assert.ok(result.error);
  } finally {
    cleanupDir(root);
  }
});

const TYPE_YAML = `title: Test Type
sections:
  - id: context
    title: Context
    layer: situation
  - id: decision
    title: Decision
    layer: situation
`;

test('cmdNew --type – scaffolds sections from type config and writes type to doc config', () => {
  const root = makeTempRoot();
  try {
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'test-type.yaml'), TYPE_YAML);
    const result = cmdNew(args(root, 'typed-doc', { type: 'test-type' }));
    assert.strictEqual(result.ok, true);
    assert.deepEqual(result.created, ['context', 'decision']);
    assert.strictEqual(result.type, 'test-type');
    // per-doc doqmentary.yaml should declare the type
    const docConfig = path.join(root, 'documents', 'typed-doc', 'doqmentary.yaml');
    assert.ok(fs.existsSync(docConfig));
    const content = fs.readFileSync(docConfig, 'utf8');
    assert.ok(content.includes('test-type'));
  } finally {
    cleanupDir(root);
  }
});

test('cmdNew --type – returns error when type file does not exist', () => {
  const root = makeTempRoot();
  try {
    const result = cmdNew(args(root, 'typed-doc', { type: 'nonexistent' }));
    assert.strictEqual(result.ok, false);
    assert.ok(result.error.includes('nonexistent'));
  } finally {
    cleanupDir(root);
  }
});

test('cmdNew --type – on existing untyped config merges type and scaffolds missing sections', () => {
  const root = makeTempRoot();
  try {
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'test-type.yaml'), TYPE_YAML);
    // Create the doc dir with a per-doc config that has no type.
    const docDir = path.join(root, 'documents', 'typed-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'language: fr\n');
    const result = cmdNew(args(root, 'typed-doc', { type: 'test-type' }));
    assert.strictEqual(result.ok, true);
    assert.deepEqual(result.created, ['context', 'decision']);
    assert.strictEqual(result.type, 'test-type');
    // Per-doc config should now have type merged in, with language preserved.
    const docConfig = path.join(docDir, 'doqmentary.yaml');
    const content = fs.readFileSync(docConfig, 'utf8');
    assert.ok(content.includes('test-type'));
    assert.ok(content.includes('fr'));
  } finally {
    cleanupDir(root);
  }
});

test('cmdNew --type – on existing same-typed config skips config write, scaffolds missing sections', () => {
  const root = makeTempRoot();
  try {
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'test-type.yaml'), TYPE_YAML);
    // First call: create from scratch.
    cmdNew(args(root, 'typed-doc', { type: 'test-type' }));
    // Remove one section to simulate a partial scaffold.
    const contextFile = path.join(root, 'documents', 'typed-doc', 'sections', 'context.md');
    fs.rmSync(contextFile);
    // Second call: same type, should scaffold missing section only.
    const result = cmdNew(args(root, 'typed-doc', { type: 'test-type' }));
    assert.strictEqual(result.ok, true);
    assert.deepEqual(result.created, ['context']);
    assert.deepEqual(result.skipped, ['decision']);
  } finally {
    cleanupDir(root);
  }
});

test('cmdNew --type – on existing different-typed config returns conflict error without scaffolding', () => {
  const root = makeTempRoot();
  try {
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'test-type.yaml'), TYPE_YAML);
    fs.writeFileSync(path.join(root, 'document-types', 'other-type.yaml'), TYPE_YAML);
    // Set up a doc with type: other-type.
    const docDir = path.join(root, 'documents', 'typed-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'type: other-type\n');
    const result = cmdNew(args(root, 'typed-doc', { type: 'test-type' }));
    assert.strictEqual(result.ok, false);
    assert.ok(result.error.includes('conflict') || result.error.includes('Conflict'));
    // Config should be unchanged.
    const content = fs.readFileSync(path.join(docDir, 'doqmentary.yaml'), 'utf8');
    assert.ok(content.includes('other-type'));
    assert.ok(!content.includes('test-type'));
    // No sections should have been scaffolded.
    assert.ok(!fs.existsSync(path.join(docDir, 'sections')));
  } finally {
    cleanupDir(root);
  }
});

// ── cmdIngest ─────────────────────────────────────────────────────────────────

test('cmdIngest – writes text to sections via map file', () => {
  const root = makeTempRoot();
  try {
    cmdNew(args(root, 'sol'));
    const mapFile = path.join(root, 'deck.json');
    fs.writeFileSync(mapFile, JSON.stringify({
      background: 'System migrates from self-hosted to managed datastore.',
      scope: 'Migrate schema, data, and connection strings.',
    }));
    const result = cmdIngest(args(root, 'sol', { map: mapFile }));
    assert.strictEqual(result.ok, true);
    assert.deepEqual(result.written, ['background', 'scope']);
    assert.deepEqual(result.unknown, []);
  } finally {
    cleanupDir(root);
  }
});

test('cmdIngest – reports unknown sections', () => {
  const root = makeTempRoot();
  try {
    cmdNew(args(root, 'sol'));
    const mapFile = path.join(root, 'deck.json');
    fs.writeFileSync(mapFile, JSON.stringify({ 'nonexistent-section': 'text' }));
    const result = cmdIngest(args(root, 'sol', { map: mapFile }));
    assert.strictEqual(result.ok, false);
    assert.ok(result.unknown.includes('nonexistent-section'));
  } finally {
    cleanupDir(root);
  }
});

test('cmdIngest – writes text via --section and --text', () => {
  const root = makeTempRoot();
  try {
    cmdNew(args(root, 'sol'));
    const result = cmdIngest(args(root, 'sol', { section: 'background', text: 'Inline text.' }));
    assert.strictEqual(result.ok, true);
    assert.deepEqual(result.written, ['background']);
  } finally {
    cleanupDir(root);
  }
});

// ── cmdAssemble ───────────────────────────────────────────────────────────────

test('cmdAssemble – produces pages, home, and nav', () => {
  const root = makeTempRoot();
  try {
    writeSectionFile(root, 'sol', 'background', 'The system history.');
    writeSectionFile(root, 'sol', 'scope', 'What is in scope.');
    const result = cmdAssemble(args(root, 'sol'));
    assert.strictEqual(result.ok, true);
    assert.ok(result.pages.includes('index.md'));
    assert.ok(result.pages.includes('background.md'));
    assert.ok(result.pages.includes('scope.md'));
    assert.ok(result.pages.includes('_sidebar.md'));
    const wikiDir = path.join(root, 'documents', 'sol', 'wiki');
    assert.ok(fs.existsSync(path.join(wikiDir, 'index.md')));
    assert.ok(fs.existsSync(path.join(wikiDir, '_sidebar.md')));
  } finally {
    cleanupDir(root);
  }
});

test('cmdAssemble – reports broken cross-page link', () => {
  const root = makeTempRoot();
  try {
    // background has a link to a page that is not in the wiki.
    writeSectionFile(root, 'sol', 'background', 'See [Extra](extra-detail.md) for more.');
    writeSectionFile(root, 'sol', 'scope', 'Content here.');
    const result = cmdAssemble(args(root, 'sol'));
    assert.strictEqual(result.ok, false);
    assert.ok(result.linkIssues.length > 0);
    assert.ok(result.linkIssues.some((i) => i.link === 'extra-detail.md'));
  } finally {
    cleanupDir(root);
  }
});

// ── cmdValidate ───────────────────────────────────────────────────────────────

test('cmdValidate – missing section produces issue and ok:false', () => {
  const root = makeTempRoot();
  try {
    // Write only one of the two sections.
    writeSectionFile(root, 'sol', 'background', 'Some content.');
    const result = cmdValidate(args(root, 'sol'));
    assert.strictEqual(result.ok, false);
    assert.ok(result.issues.some((i) => i.type === 'missing-section' && i.section === 'scope'));
  } finally {
    cleanupDir(root);
  }
});

test('cmdValidate – empty section produces issue and ok:false', () => {
  const root = makeTempRoot();
  try {
    writeSectionFile(root, 'sol', 'background', 'Some content.');
    // Write scope with empty body (only a comment).
    const scopeFile = path.join(root, 'documents', 'sol', 'sections', 'scope.md');
    fs.writeFileSync(scopeFile, '---\nid: scope\ntitle: Scope\nstatus: draft\n---\n\n<!-- hint -->\n');
    const result = cmdValidate(args(root, 'sol'));
    assert.strictEqual(result.ok, false);
    assert.ok(result.issues.some((i) => i.type === 'empty-section' && i.section === 'scope'));
  } finally {
    cleanupDir(root);
  }
});

test('cmdValidate – broken link in assembled wiki produces issue and ok:false', () => {
  const root = makeTempRoot();
  try {
    writeSectionFile(root, 'sol', 'background', 'Content here.');
    writeSectionFile(root, 'sol', 'scope', 'Content here.');
    // Directly seed the wiki with a page that has a broken link.
    const wikiDir = path.join(root, 'documents', 'sol', 'wiki');
    fs.mkdirSync(wikiDir, { recursive: true });
    fs.writeFileSync(path.join(wikiDir, 'background.md'), '# Background\n\n[Missing](nowhere.md)\n');
    fs.writeFileSync(path.join(wikiDir, 'scope.md'), '# Scope\n\nContent.\n');
    fs.writeFileSync(path.join(wikiDir, 'index.md'), '# Home\n\nContent.\n');
    const result = cmdValidate(args(root, 'sol'));
    assert.strictEqual(result.ok, false);
    assert.ok(result.issues.some((i) => i.type === 'broken-link'));
  } finally {
    cleanupDir(root);
  }
});

test('cmdValidate – fully populated document with clean wiki passes', () => {
  const root = makeTempRoot();
  try {
    writeSectionFile(root, 'sol', 'background', 'Content here.');
    writeSectionFile(root, 'sol', 'scope', 'Content here.');
    cmdAssemble(args(root, 'sol'));
    const result = cmdValidate(args(root, 'sol'));
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.issues.length, 0);
  } finally {
    cleanupDir(root);
  }
});

test('cmdValidate – document with unknown type reports unknown-type issue', () => {
  const root = makeTempRoot();
  try {
    const docDir = path.join(root, 'documents', 'typed-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'type: nonexistent\n');
    const result = cmdValidate(args(root, 'typed-doc'));
    assert.strictEqual(result.ok, false);
    assert.ok(result.issues.some((i) => i.type === 'unknown-type'));
  } finally {
    cleanupDir(root);
  }
});

test('cmdValidate – document with traversal type reports invalid-type issue and exits non-zero', () => {
  const root = makeTempRoot();
  try {
    const docDir = path.join(root, 'documents', 'traversal-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'type: ../../etc\n');
    const result = cmdValidate(args(root, 'traversal-doc'));
    assert.strictEqual(result.ok, false);
    assert.ok(result.issues.some((i) => i.type === 'invalid-type'));
  } finally {
    cleanupDir(root);
  }
});

// ── cmdList ───────────────────────────────────────────────────────────────────

const LIST_TYPE_YAML = `title: List Test Type
sections:
  - id: context
    title: Context
    layer: situation
`;

test('cmdList – returns all documents with their type and assembled status', () => {
  const root = makeTempRoot();
  try {
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'my-type.yaml'), LIST_TYPE_YAML);

    // doc-a: typed, not assembled
    cmdNew(args(root, 'doc-a', { type: 'my-type' }));
    // doc-b: no type, assembled
    cmdNew(args(root, 'doc-b'));
    writeSectionFile(root, 'doc-b', 'background', 'Content.');
    writeSectionFile(root, 'doc-b', 'scope', 'Content.');
    cmdAssemble(args(root, 'doc-b'));

    const result = cmdList(args(root, ''));
    assert.strictEqual(result.ok, true);
    const names = result.documents.map((d) => d.name);
    assert.ok(names.includes('doc-a'));
    assert.ok(names.includes('doc-b'));
    const docA = result.documents.find((d) => d.name === 'doc-a');
    const docB = result.documents.find((d) => d.name === 'doc-b');
    assert.strictEqual(docA.type, 'my-type');
    assert.strictEqual(docA.assembled, false);
    assert.strictEqual(docB.assembled, true);
  } finally {
    cleanupDir(root);
  }
});

test('cmdList --type – filters to only matching document type', () => {
  const root = makeTempRoot();
  try {
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'my-type.yaml'), LIST_TYPE_YAML);

    cmdNew(args(root, 'doc-a', { type: 'my-type' }));
    cmdNew(args(root, 'doc-b')); // no type

    const result = cmdList(args(root, '', { type: 'my-type' }));
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.documents.length, 1);
    assert.strictEqual(result.documents[0].name, 'doc-a');
  } finally {
    cleanupDir(root);
  }
});

test('cmdList --json – result documents array has expected shape', () => {
  const root = makeTempRoot();
  try {
    cmdNew(args(root, 'doc-a'));
    const result = cmdList(args(root, '', { json: true }));
    assert.strictEqual(result.ok, true);
    assert.ok(Array.isArray(result.documents));
    const doc = result.documents[0];
    assert.ok('name' in doc);
    assert.ok('type' in doc);
    assert.ok('assembled' in doc);
  } finally {
    cleanupDir(root);
  }
});

test('cmdList – returns ok with empty documents when documents/ is empty', () => {
  const root = makeTempRoot();
  try {
    fs.mkdirSync(path.join(root, 'documents'), { recursive: true });
    const result = cmdList(args(root, ''));
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.documents.length, 0);
  } finally {
    cleanupDir(root);
  }
});
