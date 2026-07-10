import path from 'node:path';
import { readYaml, exists } from './fsutil.mjs';

/** Thrown when a document declares a `type` that has no matching type file. */
export class UnknownTypeError extends Error {
  constructor(typeName, typePath) {
    super(`Unknown document type "${typeName}": no file found at ${typePath}`);
    this.typeName = typeName;
    this.typePath = typePath;
  }
}

/** Thrown when a document declares a `type` containing path-traversal characters. */
export class InvalidTypeNameError extends Error {
  constructor(typeName) {
    super(`Invalid document type name "${typeName}": type names must not contain path components (/, \\, or ..)`);
    this.typeName = typeName;
  }
}

export function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Deep-merge `override` onto `base`.
 * - Plain objects merge recursively.
 * - Arrays (e.g. `sections`, `personas`) are replaced wholesale when present.
 * - Scalars are replaced.
 * Anything omitted from `override` is inherited from `base`.
 */
export function deepMerge(base, override) {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override;
  const out = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (Array.isArray(v)) out[k] = v;
    else if (isPlainObject(v) && isPlainObject(base[k])) out[k] = deepMerge(base[k], v);
    else out[k] = v;
  }
  return out;
}

/**
 * Resolve the effective configuration for a document:
 * global `<root>/doqmentary.yaml`
 *   → `<root>/document-types/<type>.yaml`  (when the document declares `type`)
 *   → `<root>/documents/<solution>/doqmentary.yaml`  (document values always win)
 *
 * Throws `UnknownTypeError` when the document declares a `type` that has no
 * matching file in `document-types/`.
 */
export function loadEffectiveConfig(root, solution) {
  const globalPath = path.join(root, 'doqmentary.yaml');
  const global = exists(globalPath) ? readYaml(globalPath) : {};
  if (!solution) return global;
  const docPath = path.join(root, 'documents', solution, 'doqmentary.yaml');
  const docOverride = exists(docPath) ? readYaml(docPath) : {};

  // Type intermediate layer: load document-types/<type>.yaml when declared.
  const typeName = docOverride.type;
  let typeLayer = {};
  if (typeName) {
    if (/[/\\]|\.\./.test(typeName)) throw new InvalidTypeNameError(typeName);
    const typePath = path.join(root, 'document-types', `${typeName}.yaml`);
    if (!exists(typePath)) throw new UnknownTypeError(typeName, typePath);
    typeLayer = readYaml(typePath);
  }

  return deepMerge(deepMerge(global, typeLayer), docOverride);
}

export const sectionsOf = (c) => (Array.isArray(c?.sections) ? c.sections : []);
export const personasOf = (c) => (Array.isArray(c?.personas) ? c.personas : []);
export const bodySections = (c) => sectionsOf(c).filter((s) => !s.derived);
export const derivedSections = (c) => sectionsOf(c).filter((s) => s.derived);
export const titlesById = (c) =>
  Object.fromEntries(sectionsOf(c).map((s) => [s.id, s.title]));
