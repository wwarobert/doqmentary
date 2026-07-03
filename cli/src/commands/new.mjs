import { loadEffectiveConfig, sectionsOf } from '../config.mjs';
import { sectionFile } from '../paths.mjs';
import { exists, writeFile, stringifyFrontmatter } from '../fsutil.mjs';

function scaffoldSection(s) {
  const data = { id: s.id, title: s.title, status: 'draft' };
  if (s.layer) data.layer = s.layer;
  if (s.source) data.source = s.source;
  if (s.derived) data.derived = true;

  let hint;
  if (s.derived) {
    hint = '<!-- derived: synthesized from the body by the author skill; do not author directly -->';
  } else if (s.source) {
    hint = `<!-- enterprise: auto-populate by selecting relevant ${s.source} from enterprise/${s.source}/ with an application note per entry -->`;
  } else if (s.layer === 'enterprise') {
    hint = '<!-- enterprise: auto-populate from enterprise context -->';
  } else {
    hint = '<!-- situation: interview the user for this content -->';
  }
  return stringifyFrontmatter(data, `${hint}\n`);
}

/** Scaffold a new document with one entry per configured section. */
export function cmdNew(args) {
  const solution = args._[0];
  if (!solution) return { ok: false, error: 'Usage: doqmentary new <solution> [--root <dir>]' };

  const cfg = loadEffectiveConfig(args.root, solution);
  const sections = sectionsOf(cfg);
  if (sections.length === 0) {
    return { ok: false, error: 'No sections defined in the effective configuration.' };
  }

  const created = [];
  const skipped = [];
  for (const s of sections) {
    const file = sectionFile(args.root, solution, s.id);
    if (exists(file)) {
      skipped.push(s.id);
      continue;
    }
    writeFile(file, scaffoldSection(s));
    created.push(s.id);
  }

  return {
    ok: true,
    solution,
    sections: sections.map((s) => s.id),
    created,
    skipped,
  };
}
