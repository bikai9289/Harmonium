import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function expectIncludes(source, value, label) {
  expect(source.includes(value), `${label} is missing ${value}`);
}

const notesPage = read('src/shared/blocks/harmonium/notes-page.tsx');
const tutorialPage = read('src/shared/blocks/harmonium/tutorial-page.tsx');
const blogPage = read('src/app/[locale]/(landing)/blog/page.tsx');
const keyboardPage = read('src/shared/blocks/harmonium/keyboard-page.tsx');
const homePage = read('src/shared/blocks/harmonium/home.tsx');
const layout = read('src/app/layout.tsx');
const organicSearchScript = read('scripts/check-organic-search-growth.mjs');

expectIncludes(notesPage, '/keyboard?practice=alankar', '/notes');
expectIncludes(notesPage, 'compact note map', '/notes');
expectIncludes(notesPage, 'Practice alankar', '/notes');

expectIncludes(tutorialPage, '/keyboard?practice=find-sa', '/tutorial');
expectIncludes(tutorialPage, '/keyboard?practice=riyaz', '/tutorial');
expectIncludes(tutorialPage, 'Set Sa', '/tutorial');

for (const action of [
  '/keyboard?practice=find-sa',
  '/keyboard?practice=riyaz',
  '/keyboard?practice=alankar',
  '/keyboard?practice=raga',
  '/keyboard?practice=bhajan',
]) {
  expectIncludes(blogPage, action, '/blog');
}

const guideIndex = keyboardPage.indexOf('Learning paths');
const loopIndex = keyboardPage.indexOf('data-practice-action="guided-riyaz-loop"');
expect(loopIndex >= 0, '/keyboard is missing guided riyaz loop marker');
expect(
  guideIndex > loopIndex,
  '/keyboard learning links should appear after the guided riyaz loop'
);
expectIncludes(keyboardPage, 'min-h-11', '/keyboard primary controls');
expectIncludes(keyboardPage, 'min-h-10', '/keyboard compact controls');
expectIncludes(homePage, 'min-h-10', 'homepage preview controls');

expect(
  !layout.includes('<link rel="preload" as="image" href="/preview.png" />'),
  'Root layout still preloads /preview.png even when it is not used above the fold'
);

for (const route of ['/notes', '/tutorial', '/blog']) {
  expectIncludes(organicSearchScript, route, 'organic search contract');
}

const activeReportPath =
  'openspec/changes/tighten-practice-funnel-and-seo-routes/completeness-report.md';
const archiveDir = 'openspec/changes/archive';
const archivedReportPath = existsSync(join(root, archiveDir))
  ? readdirSync(join(root, archiveDir))
      .filter((name) => name.endsWith('tighten-practice-funnel-and-seo-routes'))
      .sort()
      .reverse()
      .map((name) => `${archiveDir}/${name}/completeness-report.md`)
      .find((path) => existsSync(join(root, path)))
  : undefined;
const reportPath = existsSync(join(root, activeReportPath))
  ? activeReportPath
  : archivedReportPath;
expect(Boolean(reportPath), 'Missing OpenSpec completeness report');

if (reportPath) {
  const report = read(reportPath);
  for (const heading of [
    '接口参数完整性',
    '请求/响应结构完整性',
    '异常场景完整性',
    '错误码完整性',
    '业务逻辑完整性',
    '边界场景完整性',
    '规范代码一致性',
    '兼容性完整性',
  ]) {
    expectIncludes(report, heading, 'OpenSpec completeness report');
  }
  expectIncludes(report, '一键修复方案', 'OpenSpec completeness report');
}

if (failures.length) {
  console.error('Practice funnel quality contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Practice funnel quality contract passed.');
