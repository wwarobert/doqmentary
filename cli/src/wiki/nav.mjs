/**
 * Pluggable navigation-manifest interface.
 *
 * Each target is a function `(pages, cfg) => { file, content } | null` where
 * `pages` is the ordered list of assembled pages ({ id, file, title, home }).
 * The v1 implementation is the `markdown` target (a portable `_sidebar.md`).
 * Additional targets (Azure DevOps `.order`, MkDocs `mkdocs.yml`, …) can be
 * registered with `registerTarget` without touching page bodies.
 */

const targets = {
  markdown(pages) {
    const lines = pages.map((p) => `- [${p.title}](${p.file})`);
    return { file: '_sidebar.md', content: lines.join('\n') + '\n' };
  },
};

export function registerTarget(name, fn) {
  targets[name] = fn;
}

export function availableTargets() {
  return Object.keys(targets);
}

export function buildNav(target, pages, cfg) {
  const fn = targets[target] || targets.markdown;
  return fn(pages, cfg);
}
