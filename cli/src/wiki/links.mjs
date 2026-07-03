import path from 'node:path';
import { readFile } from '../fsutil.mjs';

const LINK = /\[[^\]]*\]\(([^)]+)\)/g;

/**
 * Check cross-link integrity between the pages of an assembled document.
 * Only *internal* page-to-page markdown links are validated: relative `.md`
 * targets within the output directory. External URLs, anchors, and links that
 * escape the document (starting with `../` or `/`) are ignored.
 *
 * Returns an array of { page, link } for every broken internal link.
 */
export function checkLinks(outDir, pageFiles) {
  const known = new Set(pageFiles);
  const issues = [];
  for (const file of pageFiles) {
    const text = readFile(path.join(outDir, file));
    let m;
    while ((m = LINK.exec(text)) !== null) {
      const target = m[1].split('#')[0].trim();
      if (!target) continue;
      if (/^[a-z][a-z0-9+.-]*:\/\//i.test(target)) continue; // external URL
      if (target.startsWith('..') || target.startsWith('/')) continue; // outside document
      if (!target.endsWith('.md')) continue; // not a page link
      if (!known.has(target)) issues.push({ page: file, link: target });
    }
  }
  return issues;
}
