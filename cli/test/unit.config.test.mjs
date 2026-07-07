import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deepMerge, loadEffectiveConfig } from '../src/config.mjs';

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
