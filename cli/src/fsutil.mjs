import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export function readYaml(file) {
  return yaml.load(fs.readFileSync(file, 'utf8')) ?? {};
}

export function exists(p) {
  return fs.existsSync(p);
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

export function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content);
}

export function writeYaml(p, data) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, yaml.dump(data));
}

export function listMarkdown(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Parse YAML front matter, returning { data, body }. */
export function parseFrontmatter(text) {
  const m = text.match(FRONTMATTER);
  if (!m) return { data: {}, body: text };
  return { data: yaml.load(m[1]) ?? {}, body: m[2] };
}

/** Serialize a document with YAML front matter. */
export function stringifyFrontmatter(data, body) {
  const fm = yaml.dump(data).trimEnd();
  return `---\n${fm}\n---\n\n${(body ?? '').replace(/^\n+/, '')}`;
}

/** A body is "empty" if it has no content once comments and whitespace are removed. */
export function bodyIsEmpty(body) {
  const stripped = (body ?? '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, '');
  return stripped.length === 0;
}
