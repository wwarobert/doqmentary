import {
  loadEffectiveConfig,
  sectionsOf,
  bodySections,
  derivedSections,
  titlesById,
} from '../config.mjs';
import { sectionFile, wikiDir } from '../paths.mjs';
import { exists, readFile, writeFile, parseFrontmatter } from '../fsutil.mjs';
import { buildNav } from '../wiki/nav.mjs';
import { checkLinks } from '../wiki/links.mjs';

/** Split a markdown body into a map of { <H2 heading text>: <content> }. */
function splitByH2(body) {
  const map = {};
  let current = null;
  for (const line of (body ?? '').split('\n')) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      current = m[1].trim();
      map[current] = [];
    } else if (current !== null) {
      map[current].push(line);
    }
  }
  for (const k of Object.keys(map)) map[k] = map[k].join('\n').trim();
  return map;
}

/** Build the home page from the synthesized Summary, linking blocks to detail pages. */
function renderHome(summary, cfg, content) {
  const blocks = Array.isArray(summary.blocks) ? summary.blocks : [];
  const synthesized = splitByH2(content[summary.id]?.body || '');
  const titles = titlesById(cfg);
  const bodyIds = new Set(bodySections(cfg).map((s) => s.id));

  const parts = [];
  for (const b of blocks) {
    let block = `## ${b.title}\n\n`;
    const text = synthesized[b.title];
    if (text) block += `${text}\n`;
    else block += `<!-- gap: summary block "${b.title}" has no synthesized content -->\n`;
    if (b.summarizes && bodyIds.has(b.summarizes)) {
      block += `\nSee [${titles[b.summarizes]}](${b.summarizes}.md).\n`;
    }
    parts.push(block.trimEnd());
  }
  return parts.join('\n\n');
}

/** Assemble section content into a linked wiki: home page, per-section pages, nav manifest. */
export function cmdAssemble(args) {
  const solution = args._[0];
  if (!solution) return { ok: false, error: 'Usage: doqmentary assemble <solution> [--root <dir>]' };

  const cfg = loadEffectiveConfig(args.root, solution);
  const outDir = wikiDir(args.root, solution, cfg);
  const target = cfg?.output?.target || 'markdown';

  // Gather all section content from the draft document.
  const content = {};
  for (const s of sectionsOf(cfg)) {
    const file = sectionFile(args.root, solution, s.id);
    content[s.id] = exists(file)
      ? parseFrontmatter(readFile(file))
      : { data: {}, body: '' };
  }

  // One page per body section.
  const pages = [];
  for (const s of bodySections(cfg)) {
    pages.push({ id: s.id, file: `${s.id}.md`, title: s.title, body: (content[s.id].body || '').trim() });
  }

  // Home page from the synthesized Summary (first derived section).
  const summary = derivedSections(cfg)[0];
  const home = summary
    ? { id: summary.id, file: 'index.md', title: summary.title, body: renderHome(summary, cfg, content), home: true }
    : { id: 'home', file: 'index.md', title: 'Home', body: pages.map((p) => `- [${p.title}](${p.file})`).join('\n'), home: true };
  pages.unshift(home);

  // Write pages.
  const written = [];
  for (const pg of pages) {
    writeFile(`${outDir}/${pg.file}`, `# ${pg.title}\n\n${(pg.body || '').trim()}\n`);
    written.push(pg.file);
  }

  // Navigation manifest (pluggable by target).
  const nav = buildNav(target, pages, cfg);
  if (nav) {
    writeFile(`${outDir}/${nav.file}`, nav.content);
    written.push(nav.file);
  }

  // Cross-link integrity.
  const linkIssues = checkLinks(outDir, pages.map((p) => p.file));

  return {
    ok: linkIssues.length === 0,
    solution,
    target,
    outDir,
    pages: written,
    navFile: nav?.file,
    linkIssues,
  };
}
