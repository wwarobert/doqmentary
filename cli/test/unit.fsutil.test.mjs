import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter, bodyIsEmpty } from '../src/fsutil.mjs';

// ── parseFrontmatter ─────────────────────────────────────────────────────────

test('parseFrontmatter – no frontmatter returns empty data and full text as body', () => {
  const text = 'Just a plain body.\n';
  const { data, body } = parseFrontmatter(text);
  assert.deepEqual(data, {});
  assert.strictEqual(body, text);
});

test('parseFrontmatter – parses YAML data and separates body', () => {
  const text = '---\nid: bg\ntitle: Background\nstatus: draft\n---\n\nSome content.\n';
  const { data, body } = parseFrontmatter(text);
  assert.strictEqual(data.id, 'bg');
  assert.strictEqual(data.title, 'Background');
  assert.strictEqual(data.status, 'draft');
  assert.ok(body.includes('Some content.'));
});

test('parseFrontmatter – empty body after frontmatter is preserved', () => {
  const text = '---\nid: x\n---\n';
  const { data, body } = parseFrontmatter(text);
  assert.strictEqual(data.id, 'x');
  assert.strictEqual(body, '');
});

// ── bodyIsEmpty ───────────────────────────────────────────────────────────────

test('bodyIsEmpty – empty string is empty', () => {
  assert.strictEqual(bodyIsEmpty(''), true);
});

test('bodyIsEmpty – whitespace-only string is empty', () => {
  assert.strictEqual(bodyIsEmpty('   \n\n\t  '), true);
});

test('bodyIsEmpty – HTML comment only is empty', () => {
  assert.strictEqual(bodyIsEmpty('<!-- a hint here -->'), true);
});

test('bodyIsEmpty – HTML comment with surrounding whitespace is empty', () => {
  assert.strictEqual(bodyIsEmpty('\n<!-- draft -->\n'), true);
});

test('bodyIsEmpty – string with real content is not empty', () => {
  assert.strictEqual(bodyIsEmpty('Some actual content.'), false);
});

test('bodyIsEmpty – content after comment is not empty', () => {
  assert.strictEqual(bodyIsEmpty('<!-- hint -->\n\nReal text.'), false);
});

test('bodyIsEmpty – null/undefined treated as empty', () => {
  assert.strictEqual(bodyIsEmpty(null), true);
  assert.strictEqual(bodyIsEmpty(undefined), true);
});
