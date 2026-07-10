import path from 'node:path';
import { loadEffectiveConfig, sectionsOf, UnknownTypeError } from '../config.mjs';
import { sectionFile } from '../paths.mjs';
import { exists, writeFile, stringifyFrontmatter, writeYaml, readYaml } from '../fsutil.mjs';

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
  if (!solution) return { ok: false, error: 'Usage: doqmentary new <solution> [--type <name>] [--root <dir>]' };

  const typeName = args.type ?? null;

  // When --type is provided: validate the type file exists, then write the
  // per-document config (type: <name>) before resolving the effective config
  // so that the type layer is active during scaffolding.
  const docDir = path.join(args.root, 'documents', solution);
  const docConfigPath = path.join(docDir, 'doqmentary.yaml');

  if (typeName) {
    const typePath = path.join(args.root, 'document-types', `${typeName}.yaml`);
    if (!exists(typePath)) {
      return { ok: false, error: `Unknown document type "${typeName}": no file found at ${typePath}` };
    }
    if (!exists(docConfigPath)) {
      writeYaml(docConfigPath, { type: typeName });
    } else {
      const existing = readYaml(docConfigPath);
      if (!existing.type) {
        existing.type = typeName;
        writeYaml(docConfigPath, existing);
      } else if (existing.type === typeName) {
        // Same type — skip write, scaffold missing sections only (idempotent).
      } else {
        return {
          ok: false,
          error: `Type conflict: document already declares type "${existing.type}"; cannot apply type "${typeName}". Use --type ${existing.type} to scaffold missing sections, or remove the type field to re-type.`,
        };
      }
    }
  }

  let cfg;
  try {
    cfg = loadEffectiveConfig(args.root, solution);
  } catch (err) {
    if (err instanceof UnknownTypeError) return { ok: false, error: err.message };
    throw err;
  }

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
    type: typeName ?? undefined,
    sections: sections.map((s) => s.id),
    created,
    skipped,
  };
}
