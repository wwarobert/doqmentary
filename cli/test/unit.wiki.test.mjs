import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkLinks } from '../src/wiki/links.mjs';
import { buildNav } from '../src/wiki/nav.mjs';

// ── helpers ───────────────────────────────────────────────────────────────────

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'doqmentary-wiki-'));
}

function cleanupDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

// ── checkLinks ────────────────────────────────────────────────────────────────

test('checkLinks – broken internal link is reported', () => {
  const dir = makeTempDir();
  try {
    fs.writeFileSync(path.join(dir, 'page.md'), '# Page\n\n[See missing](missing.md)\n');
    const issues = checkLinks(dir, ['page.md']);
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].page, 'page.md');
    assert.strictEqual(issues[0].link, 'missing.md');
  } finally {
    cleanupDir(dir);
  }
});

test('checkLinks – valid internal link is not reported', () => {
  const dir = makeTempDir();
  try {
    fs.writeFileSync(path.join(dir, 'page.md'), '# Page\n\n[See other](other.md)\n');
    fs.writeFileSync(path.join(dir, 'other.md'), '# Other\n');
    const issues = checkLinks(dir, ['page.md', 'other.md']);
    assert.strictEqual(issues.length, 0);
  } finally {
    cleanupDir(dir);
  }
});

test('checkLinks – external URLs are skipped', () => {
  const dir = makeTempDir();
  try {
    fs.writeFileSync(path.join(dir, 'page.md'), '# Page\n\n[Ext](https://example.com)\n');
    const issues = checkLinks(dir, ['page.md']);
    assert.strictEqual(issues.length, 0);
  } finally {
    cleanupDir(dir);
  }
});

test('checkLinks – ../ links that escape the document are skipped', () => {
  const dir = makeTempDir();
  try {
    fs.writeFileSync(path.join(dir, 'page.md'), '# Page\n\n[Up](../other/page.md)\n');
    const issues = checkLinks(dir, ['page.md']);
    assert.strictEqual(issues.length, 0);
  } finally {
    cleanupDir(dir);
  }
});

test('checkLinks – anchor fragments are stripped before checking', () => {
  const dir = makeTempDir();
  try {
    fs.writeFileSync(path.join(dir, 'page.md'), '# Page\n\n[Ref](other.md#section)\n');
    fs.writeFileSync(path.join(dir, 'other.md'), '# Other\n');
    const issues = checkLinks(dir, ['page.md', 'other.md']);
    assert.strictEqual(issues.length, 0);
  } finally {
    cleanupDir(dir);
  }
});

test('checkLinks – non-md links are ignored', () => {
  const dir = makeTempDir();
  try {
    fs.writeFileSync(path.join(dir, 'page.md'), '# Page\n\n[Image](diagram.png)\n');
    const issues = checkLinks(dir, ['page.md']);
    assert.strictEqual(issues.length, 0);
  } finally {
    cleanupDir(dir);
  }
});

// ── buildNav ──────────────────────────────────────────────────────────────────

test('buildNav – markdown target produces _sidebar.md with correct links', () => {
  const pages = [
    { id: 'home', file: 'index.md', title: 'Home', home: true },
    { id: 'background', file: 'background.md', title: 'Background' },
    { id: 'scope', file: 'scope.md', title: 'Scope' },
  ];
  const nav = buildNav('markdown', pages, {});
  assert.strictEqual(nav.file, '_sidebar.md');
  assert.ok(nav.content.includes('[Home](index.md)'));
  assert.ok(nav.content.includes('[Background](background.md)'));
  assert.ok(nav.content.includes('[Scope](scope.md)'));
});

test('buildNav – unknown target falls back to markdown', () => {
  const pages = [{ id: 'a', file: 'a.md', title: 'A' }];
  const nav = buildNav('unknown-target', pages, {});
  assert.strictEqual(nav.file, '_sidebar.md');
});
