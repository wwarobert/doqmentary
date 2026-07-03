import path from 'node:path';

export const docDir = (root, solution) => path.join(root, 'documents', solution);
export const sectionsDir = (root, solution) => path.join(docDir(root, solution), 'sections');
export const sectionFile = (root, solution, id) =>
  path.join(sectionsDir(root, solution), `${id}.md`);
export const wikiDir = (root, solution, cfg) =>
  path.join(docDir(root, solution), cfg?.output?.dir || 'wiki');
