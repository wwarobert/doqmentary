import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deepMerge, loadEffectiveConfig, UnknownTypeError, InvalidTypeNameError } from '../src/config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── helpers ──────────────────────────────────────────────────────────────────

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'doqmentary-cfg-'));
}

function cleanupDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

// ── deepMerge ────────────────────────────────────────────────────────────────

test('deepMerge – scalar override wins', () => {
  assert.deepEqual(deepMerge({ a: 1 }, { a: 2 }), { a: 2 });
});

test('deepMerge – omitted value is inherited from base', () => {
  assert.deepEqual(deepMerge({ a: 1, b: 2 }, { a: 9 }), { a: 9, b: 2 });
});

test('deepMerge – nested plain objects merge recursively', () => {
  assert.deepEqual(
    deepMerge({ x: { a: 1, b: 2 } }, { x: { b: 99 } }),
    { x: { a: 1, b: 99 } },
  );
});

test('deepMerge – arrays are replaced wholesale', () => {
  assert.deepEqual(
    deepMerge({ sections: ['a', 'b', 'c'] }, { sections: ['x'] }),
    { sections: ['x'] },
  );
});

test('deepMerge – undefined override returns base unchanged', () => {
  const base = { a: 1 };
  assert.strictEqual(deepMerge(base, undefined), base);
});

test('deepMerge – non-object override replaces base', () => {
  assert.strictEqual(deepMerge({ a: 1 }, 42), 42);
});

// ── loadEffectiveConfig ───────────────────────────────────────────────────────

const GLOBAL_YAML = `version: 1
language: en
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

test('loadEffectiveConfig – no per-doc override returns global config', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    const cfg = loadEffectiveConfig(root, 'my-doc');
    assert.strictEqual(cfg.language, 'en');
    assert.strictEqual(cfg.sections.length, 2);
  } finally {
    cleanupDir(root);
  }
});

test('loadEffectiveConfig – per-doc scalar override wins', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'language: fr\n');
    const cfg = loadEffectiveConfig(root, 'my-doc');
    assert.strictEqual(cfg.language, 'fr');
  } finally {
    cleanupDir(root);
  }
});

test('loadEffectiveConfig – per-doc list replaces global list wholesale', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(
      path.join(docDir, 'doqmentary.yaml'),
      'sections:\n  - id: custom\n    title: Custom\n',
    );
    const cfg = loadEffectiveConfig(root, 'my-doc');
    assert.strictEqual(cfg.sections.length, 1);
    assert.strictEqual(cfg.sections[0].id, 'custom');
  } finally {
    cleanupDir(root);
  }
});

test('loadEffectiveConfig – omitted per-doc value inherits from global', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'language: de\n');
    const cfg = loadEffectiveConfig(root, 'my-doc');
    assert.strictEqual(cfg.version, 1);       // inherited
    assert.strictEqual(cfg.language, 'de');   // overridden
  } finally {
    cleanupDir(root);
  }
});

// ── type intermediate layer ───────────────────────────────────────────────────

const TYPE_YAML = `title: My Type
sections:
  - id: context
    title: Context
    layer: situation
  - id: decision
    title: Decision
    layer: situation
`;

test('loadEffectiveConfig – type layer supplies sections when doc declares type', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'my-type.yaml'), TYPE_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'type: my-type\n');
    const cfg = loadEffectiveConfig(root, 'my-doc');
    assert.strictEqual(cfg.sections.length, 2);
    assert.strictEqual(cfg.sections[0].id, 'context');
    assert.strictEqual(cfg.sections[1].id, 'decision');
  } finally {
    cleanupDir(root);
  }
});

test('loadEffectiveConfig – per-doc sections override type sections (wholesale)', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'my-type.yaml'), TYPE_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(
      path.join(docDir, 'doqmentary.yaml'),
      'type: my-type\nsections:\n  - id: override\n    title: Override\n',
    );
    const cfg = loadEffectiveConfig(root, 'my-doc');
    assert.strictEqual(cfg.sections.length, 1);
    assert.strictEqual(cfg.sections[0].id, 'override');
  } finally {
    cleanupDir(root);
  }
});

test('loadEffectiveConfig – global scalar inherited through type layer when doc omits it', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'my-type.yaml'), TYPE_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'type: my-type\n');
    const cfg = loadEffectiveConfig(root, 'my-doc');
    assert.strictEqual(cfg.language, 'en');  // from global
    assert.strictEqual(cfg.version, 1);      // from global
  } finally {
    cleanupDir(root);
  }
});

test('loadEffectiveConfig – missing type file throws UnknownTypeError', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'type: nonexistent\n');
    assert.throws(
      () => loadEffectiveConfig(root, 'my-doc'),
      (err) => err instanceof UnknownTypeError && err.typeName === 'nonexistent',
    );
  } finally {
    cleanupDir(root);
  }
});

// ── InvalidTypeNameError (path-traversal guard) ───────────────────────────────

test('loadEffectiveConfig – traversal string ../../secret throws InvalidTypeNameError', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'type: ../../secret\n');
    assert.throws(
      () => loadEffectiveConfig(root, 'my-doc'),
      (err) => err instanceof InvalidTypeNameError && err.typeName === '../../secret',
    );
  } finally {
    cleanupDir(root);
  }
});

test('loadEffectiveConfig – backslash traversal ..\\\\secret throws InvalidTypeNameError', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'type: ..\\\\secret\n');
    assert.throws(
      () => loadEffectiveConfig(root, 'my-doc'),
      (err) => err instanceof InvalidTypeNameError,
    );
  } finally {
    cleanupDir(root);
  }
});

test('loadEffectiveConfig – valid kebab-case type name does not throw InvalidTypeNameError', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    fs.mkdirSync(path.join(root, 'document-types'), { recursive: true });
    fs.writeFileSync(path.join(root, 'document-types', 'my-type.yaml'), TYPE_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'type: my-type\n');
    // Should not throw InvalidTypeNameError — may throw nothing or UnknownTypeError only.
    assert.doesNotThrow(
      () => loadEffectiveConfig(root, 'my-doc'),
    );
  } finally {
    cleanupDir(root);
  }
});

test('loadEffectiveConfig – no type field uses two-layer merge unchanged', () => {
  const root = makeTempDir();
  try {
    fs.writeFileSync(path.join(root, 'doqmentary.yaml'), GLOBAL_YAML);
    const docDir = path.join(root, 'documents', 'my-doc');
    fs.mkdirSync(docDir, { recursive: true });
    fs.writeFileSync(path.join(docDir, 'doqmentary.yaml'), 'language: nl\n');
    const cfg = loadEffectiveConfig(root, 'my-doc');
    assert.strictEqual(cfg.language, 'nl');
    assert.strictEqual(cfg.sections.length, 2); // from global
  } finally {
    cleanupDir(root);
  }
});
