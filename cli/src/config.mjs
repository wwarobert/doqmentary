import path from 'node:path';
import { readYaml, exists } from './fsutil.mjs';

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
 * global `<root>/doqmentary.yaml` deep-merged with the per-document
 * `<root>/documents/<solution>/doqmentary.yaml` (document values win).
 */
export function loadEffectiveConfig(root, solution) {
  const globalPath = path.join(root, 'doqmentary.yaml');
  const global = exists(globalPath) ? readYaml(globalPath) : {};
  if (!solution) return global;
  const docPath = path.join(root, 'documents', solution, 'doqmentary.yaml');
  if (!exists(docPath)) return global;
  return deepMerge(global, readYaml(docPath));
}

export const sectionsOf = (c) => (Array.isArray(c?.sections) ? c.sections : []);
export const personasOf = (c) => (Array.isArray(c?.personas) ? c.personas : []);
export const bodySections = (c) => sectionsOf(c).filter((s) => !s.derived);
export const derivedSections = (c) => sectionsOf(c).filter((s) => s.derived);
export const titlesById = (c) =>
  Object.fromEntries(sectionsOf(c).map((s) => [s.id, s.title]));
