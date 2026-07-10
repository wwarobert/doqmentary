import { loadEffectiveConfig, sectionsOf, UnknownTypeError, InvalidTypeNameError } from '../config.mjs';
import { sectionFile, wikiDir } from '../paths.mjs';
import { exists, readFile, parseFrontmatter, bodyIsEmpty, listMarkdown } from '../fsutil.mjs';
import { checkLinks } from '../wiki/links.mjs';

/**
 * Validate a document against the effective configuration:
 * - every configured section is present and non-empty (completeness), and
 * - the assembled wiki (if present) has no broken internal links (integrity).
 * Returns `ok: false` when any issue is found so the CLI exits non-zero.
 */
export function cmdValidate(args) {
  const solution = args._[0];
  if (!solution) return { ok: false, error: 'Usage: doqmentary validate <solution> [--root <dir>]' };

  const issues = [];

  let cfg;
  try {
    cfg = loadEffectiveConfig(args.root, solution);
  } catch (err) {
    if (err instanceof UnknownTypeError) {
      issues.push({ type: 'unknown-type', typeName: err.typeName });
      return { ok: false, solution, issues };
    }
    if (err instanceof InvalidTypeNameError) {
      issues.push({ type: 'invalid-type', typeName: err.typeName });
      return { ok: false, solution, issues };
    }
    throw err;
  }

  // Completeness: each configured section must exist and be non-empty.
  for (const s of sectionsOf(cfg)) {
    const file = sectionFile(args.root, solution, s.id);
    if (!exists(file)) {
      issues.push({ type: 'missing-section', section: s.id });
      continue;
    }
    const { body } = parseFrontmatter(readFile(file));
    if (bodyIsEmpty(body)) issues.push({ type: 'empty-section', section: s.id });
  }

  // Internal-link integrity on the assembled wiki, if it exists.
  const outDir = wikiDir(args.root, solution, cfg);
  if (exists(outDir)) {
    const files = listMarkdown(outDir);
    for (const li of checkLinks(outDir, files)) {
      issues.push({ type: 'broken-link', page: li.page, link: li.link });
    }
  }

  return { ok: issues.length === 0, solution, issues };
}
