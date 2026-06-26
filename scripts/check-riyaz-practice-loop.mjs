import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function expectFile(path) {
  const exists = existsSync(join(root, path));
  expect(exists, `Missing file: ${path}`);
  return exists ? read(path) : '';
}

function expectAnyFile(paths, label) {
  const path = paths.find((candidate) => existsSync(join(root, candidate)));
  expect(Boolean(path), `Missing file: ${label}`);
  return path ? read(path) : '';
}

const loopModel = expectFile('src/shared/blocks/harmonium/practice-loop.ts');
const droneHook = expectFile('src/shared/blocks/harmonium/use-harmonium-drone.ts');
const keyboard = expectFile('src/shared/blocks/harmonium/keyboard-page.tsx');
const home = expectFile('src/app/[locale]/(landing)/page.tsx');
const homeBlock = expectFile('src/shared/blocks/harmonium/home.tsx');
const seoContent = expectFile(
  'src/shared/blocks/harmonium/seo-landing-content.ts'
);
const seoScript = expectFile('scripts/check-organic-search-growth.mjs');
const report = expectAnyFile(
  [
    'openspec/changes/build-riyaz-practice-loop/completeness-report.md',
    'openspec/changes/archive/2026-06-26-build-riyaz-practice-loop/completeness-report.md',
  ],
  'build-riyaz-practice-loop completeness report'
);

for (const term of [
  'RiyazPracticeExercise',
  'RIYAZ_PRACTICE_EXERCISES',
  'SA_TONIC_OPTIONS',
  'validateRiyazPracticeExercises',
  'invalid-sa-value',
  'missing-exercise-field',
]) {
  expect(loopModel.includes(term), `Practice loop model missing: ${term}`);
}

for (const exerciseId of [
  'sa-hold',
  'sargam-alankar',
  'raga-phrase',
  'bhajan-kirtan',
]) {
  expect(loopModel.includes(exerciseId), `Missing exercise: ${exerciseId}`);
}

for (const term of [
  'useHarmoniumDrone',
  'startDrone',
  'stopDrone',
  'audio-blocked',
  'oscillator',
]) {
  expect(droneHook.includes(term), `Drone hook missing: ${term}`);
}

for (const term of [
  'Guided riyaz loop',
  'Set Sa',
  'Start shruti',
  'Stop shruti',
  'Mark complete',
  'Repeat exercise',
  'data-practice-action',
  'selectedExercise',
  'selectedSa',
]) {
  expect(keyboard.includes(term), `Keyboard workbench missing: ${term}`);
}

for (const term of [
  'Find Sa',
  'Start riyaz',
  'Practice alankar',
  'Try a raga phrase',
  'Rehearse bhajan or kirtan',
  '/keyboard?practice=',
]) {
  const source = `${home}\n${homeBlock}\n${seoContent}`;
  expect(source.includes(term), `Entry/SEO content missing: ${term}`);
}

for (const term of [
  'check-riyaz-practice-loop',
  'practice action',
  'duplicate route intent',
  'overclaim',
]) {
  expect(seoScript.includes(term), `SEO verification missing: ${term}`);
}

for (const term of [
  '接口参数完整性',
  '请求/响应结构完整性',
  '异常场景完整性',
  '错误码完整性',
  '业务逻辑完整性',
  '边界场景完整性',
  '规范代码一致性',
  '兼容性完整性',
]) {
  expect(report.includes(term), `Completeness report missing: ${term}`);
}

if (failures.length) {
  console.error('Riyaz practice loop contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Riyaz practice loop contract passed.');
