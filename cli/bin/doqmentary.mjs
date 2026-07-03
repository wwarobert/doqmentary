#!/usr/bin/env node
import { cmdNew } from '../src/commands/new.mjs';
import { cmdIngest } from '../src/commands/ingest.mjs';
import { cmdAssemble } from '../src/commands/assemble.mjs';
import { cmdValidate } from '../src/commands/validate.mjs';

const COMMANDS = {
  new: cmdNew,
  ingest: cmdIngest,
  assemble: cmdAssemble,
  validate: cmdValidate,
};

function parseArgs(rest) {
  const args = { _: [], root: process.cwd(), json: false };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--json') args.json = true;
    else if (a === '--root') args.root = rest[++i];
    else if (a === '--map') args.map = rest[++i];
    else if (a === '--section') args.section = rest[++i];
    else if (a === '--text') args.text = rest[++i];
    else if (a.startsWith('--')) args[a.slice(2)] = rest[++i];
    else args._.push(a);
  }
  return args;
}

function usage() {
  return [
    'doqmentary — deterministic CLI for solution-outline documents (no model calls).',
    '',
    'Usage:',
    '  doqmentary new <solution>      [--root <dir>] [--json]',
    '  doqmentary ingest <solution>   (--map <file.json> | --section <id> --text "<text>") [--root <dir>] [--json]',
    '  doqmentary assemble <solution> [--root <dir>] [--json]',
    '  doqmentary validate <solution> [--root <dir>] [--json]',
  ].join('\n');
}

function printHuman(command, result) {
  if (result.error) {
    console.error(result.error);
    return;
  }
  switch (command) {
    case 'new':
      console.log(`Scaffolded document "${result.solution}".`);
      console.log(`  created: ${result.created.join(', ') || '(none)'}`);
      if (result.skipped.length) console.log(`  skipped (already exist): ${result.skipped.join(', ')}`);
      break;
    case 'ingest':
      console.log(`Ingested into "${result.solution}".`);
      console.log(`  written: ${result.written.join(', ') || '(none)'}`);
      if (result.unknown.length) console.error(`  unknown sections (ignored): ${result.unknown.join(', ')}`);
      break;
    case 'assemble':
      console.log(`Assembled "${result.solution}" (target: ${result.target}) -> ${result.outDir}`);
      console.log(`  pages: ${result.pages.join(', ')}`);
      if (result.linkIssues.length) {
        console.error('  broken internal links:');
        for (const li of result.linkIssues) console.error(`    ${li.page} -> ${li.link}`);
      }
      break;
    case 'validate':
      if (result.ok) {
        console.log(`Document "${result.solution}" is valid.`);
      } else {
        console.error(`Document "${result.solution}" has ${result.issues.length} issue(s):`);
        for (const it of result.issues) {
          if (it.type === 'broken-link') console.error(`  broken-link: ${it.page} -> ${it.link}`);
          else console.error(`  ${it.type}: ${it.section}`);
        }
      }
      break;
    default:
      console.log(JSON.stringify(result, null, 2));
  }
}

function main() {
  const argv = process.argv.slice(2);
  const command = argv[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(usage());
    process.exit(command ? 0 : 1);
  }

  const handler = COMMANDS[command];
  if (!handler) {
    console.error(`Unknown command: ${command}\n`);
    console.error(usage());
    process.exit(1);
  }

  const args = parseArgs(argv.slice(1));
  const result = handler(args);

  if (args.json) console.log(JSON.stringify(result, null, 2));
  else printHuman(command, result);

  process.exit(result.ok ? 0 : 1);
}

main();
