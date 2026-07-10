import fs from 'node:fs';
import path from 'node:path';
import { loadEffectiveConfig } from '../config.mjs';
import { exists } from '../fsutil.mjs';

/**
 * Walk `documents/`, read each document's effective config, and return a
 * catalog of { name, type, assembled } entries.
 *
 * Supports:
 *   --type <name>   filter to documents of that type only
 *   --json          emit JSON instead of a table
 */
export function cmdList(args) {
  const root = args.root;
  const filterType = args.type ?? null;

  const docsDir = path.join(root, 'documents');
  if (!exists(docsDir)) {
    return { ok: true, documents: [], message: 'No documents directory found.' };
  }

  let entries;
  try {
    entries = fs.readdirSync(docsDir, { withFileTypes: true });
  } catch {
    return { ok: true, documents: [], message: 'No documents found.' };
  }

  const documents = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;

    // Skip the README or other non-document files
    const docConfigPath = path.join(docsDir, name, 'doqmentary.yaml');
    const sectionsDir = path.join(docsDir, name, 'sections');
    if (!exists(docConfigPath) && !exists(sectionsDir)) continue;

    let typeName = null;
    try {
      const cfg = loadEffectiveConfig(root, name);
      typeName = cfg.type ?? null;
    } catch {
      // Unknown type or parse error — still include with type shown as '(unknown)'
      typeName = '(unknown)';
    }

    // Filter by --type when provided
    if (filterType !== null && typeName !== filterType) continue;

    // Detect assembly: wiki/index.md must exist
    const assembled = exists(path.join(docsDir, name, 'wiki', 'index.md'));

    documents.push({ name, type: typeName, assembled });
  }

  return { ok: true, documents };
}
