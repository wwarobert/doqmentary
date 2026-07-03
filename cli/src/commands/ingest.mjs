import { loadEffectiveConfig, sectionsOf } from '../config.mjs';
import { sectionFile } from '../paths.mjs';
import {
  exists,
  readFile,
  writeFile,
  parseFrontmatter,
  stringifyFrontmatter,
} from '../fsutil.mjs';

/**
 * Ingest provided deck text into a draft document's sections.
 * Input is either a JSON map file (`--map <file>`: { "<section-id>": "text" })
 * or a single section (`--section <id> --text "<text>"`).
 * Binary `.pptx` parsing is intentionally out of scope for v1.
 */
export function cmdIngest(args) {
  const solution = args._[0];
  if (!solution) {
    return {
      ok: false,
      error: 'Usage: doqmentary ingest <solution> --map <file.json> | --section <id> --text "<text>"',
    };
  }

  const cfg = loadEffectiveConfig(args.root, solution);
  const sections = sectionsOf(cfg);
  const byId = new Map(sections.map((s) => [s.id, s]));

  let map;
  if (args.map) {
    if (!exists(args.map)) return { ok: false, error: `Map file not found: ${args.map}` };
    try {
      map = JSON.parse(readFile(args.map));
    } catch (e) {
      return { ok: false, error: `Could not parse JSON map: ${e.message}` };
    }
  } else if (args.section) {
    map = { [args.section]: args.text ?? '' };
  } else {
    return { ok: false, error: 'Provide --map <file.json> or --section <id> --text "<text>".' };
  }

  const written = [];
  const unknown = [];
  for (const [id, text] of Object.entries(map)) {
    const section = byId.get(id);
    if (!section) {
      unknown.push(id);
      continue;
    }
    const file = sectionFile(args.root, solution, id);
    let data;
    if (exists(file)) {
      data = parseFrontmatter(readFile(file)).data;
    } else {
      data = { id, title: section.title, status: 'draft' };
      if (section.layer) data.layer = section.layer;
      if (section.source) data.source = section.source;
    }
    data.status = 'ingested';
    writeFile(file, stringifyFrontmatter(data, `${String(text).trim()}\n`));
    written.push(id);
  }

  return { ok: unknown.length === 0, solution, written, unknown };
}
