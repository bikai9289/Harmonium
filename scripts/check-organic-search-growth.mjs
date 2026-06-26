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

const landingPages = [
  {
    path: 'src/app/[locale]/(landing)/online-harmonium/page.tsx',
    route: '/online-harmonium',
    practiceAction: '/keyboard?practice=riyaz',
    terms: [
      'online harmonium',
      'play harmonium online',
      'no download',
      'instant browser play',
    ],
  },
  {
    path: 'src/app/[locale]/(landing)/virtual-harmonium/page.tsx',
    route: '/virtual-harmonium',
    practiceAction: '/keyboard?practice=find-sa',
    terms: [
      'virtual harmonium',
      'browser',
      'no sign-up',
      'real harmonium',
    ],
  },
  {
    path: 'src/app/[locale]/(landing)/harmonium-notes/page.tsx',
    route: '/harmonium-notes',
    practiceAction: '/keyboard?practice=alankar',
    terms: ['harmonium notes', 'Sargam', 'western note', 'alankar'],
  },
  {
    path: 'src/app/[locale]/(landing)/laptop-harmonium/page.tsx',
    route: '/laptop-harmonium',
    practiceAction: '/keyboard?practice=sargam',
    terms: ['laptop harmonium', 'laptop keyboard', 'no emulator'],
  },
];

const landingContent = read(
  'src/shared/blocks/harmonium/seo-landing-content.ts'
);

for (const page of landingPages) {
  const exists = existsSync(join(root, page.path));
  expect(exists, `Missing landing page: ${page.route}`);
  if (exists) {
    const source = `${read(page.path)}\n${landingContent}`;
    expect(
      source.includes('generateMetadata') && source.includes('canonicalUrl'),
      `${page.route} is missing explicit metadata/canonical setup`
    );
    for (const term of page.terms) {
      expect(
        source.toLowerCase().includes(term.toLowerCase()),
        `${page.route} is missing term: ${term}`
      );
    }
    expect(
      source.includes(page.practiceAction) || landingContent.includes(page.practiceAction),
      `${page.route} is missing practice action link: ${page.practiceAction}`
    );
  }
}

const home = read('src/app/[locale]/(landing)/page.tsx');
for (const term of [
  'online harmonium',
  'virtual harmonium',
  'Indian music practice',
  'riyaz',
  'alankar',
  'Find Sa',
  'no download',
  'no sign-up',
  'laptop keyboard',
]) {
  expect(
    home.toLowerCase().includes(term.toLowerCase()),
    `Homepage copy is missing: ${term}`
  );
}

const homeBlock = read('src/shared/blocks/harmonium/home.tsx');
const homeSource = `${home}\n${homeBlock}`;
for (const term of [
  'practice map',
  'Open Practice Workbench',
  'Find Sa',
  'Start riyaz',
  'Practice alankar',
  'Try a raga phrase',
  'Rehearse bhajan or kirtan',
  '/keyboard?practice=',
]) {
  expect(
    homeSource.toLowerCase().includes(term.toLowerCase()),
    `Homepage block is missing practice positioning term: ${term}`
  );
}

const keyboardPage = read('src/app/[locale]/(landing)/keyboard/page.tsx');
const keyboardBlock = read('src/shared/blocks/harmonium/keyboard-page.tsx');
for (const term of [
  'practice workbench',
  'Guided riyaz loop',
  'Set Sa',
  'Start shruti',
  'Mark complete',
  'recording takes',
  'notation',
  'presets',
  'sessions',
  'Sa finding',
  'alankar',
]) {
  const source = `${keyboardPage}\n${keyboardBlock}`;
  expect(
    source.toLowerCase().includes(term.toLowerCase()),
    `Keyboard workbench is missing term: ${term}`
  );
}

const practiceActions = [
  '/keyboard?practice=find-sa',
  '/keyboard?practice=riyaz',
  '/keyboard?practice=alankar',
  '/keyboard?practice=raga',
  '/keyboard?practice=bhajan',
];
const routeClusterSource = `${home}\n${homeBlock}\n${landingContent}\n${keyboardBlock}`;
for (const action of practiceActions) {
  expect(
    routeClusterSource.includes(action),
    `Route cluster missing practice action: ${action}`
  );
}

const routeTitles = [
  ...landingContent.matchAll(/title:\s*'([^']+)'/g),
].map((match) => match[1]);
const duplicateRouteIntent = routeTitles.find(
  (title, index) => routeTitles.indexOf(title) !== index
);
expect(
  !duplicateRouteIntent,
  `Found duplicate route intent title: ${duplicateRouteIntent}`
);

for (const overclaim of ['real-time vocal scoring', 'full tanpura', 'AI feedback']) {
  expect(
    !routeClusterSource.toLowerCase().includes(overclaim.toLowerCase()),
    `Potential feature overclaim found: ${overclaim}`
  );
}

const riyazContract = read('scripts/check-riyaz-practice-loop.mjs');
expect(
  riyazContract.includes('Riyaz practice loop contract'),
  'Missing check-riyaz-practice-loop contract coverage'
);

const sitemap = read('src/app/sitemap.ts');
for (const route of landingPages.map((page) => page.route)) {
  expect(
    sitemap.includes(`path: '${route}'`),
    `Sitemap static routes missing ${route}`
  );
}

const layout = read('src/app/layout.tsx');
expect(
  !/<meta\s+name="viewport"/.test(layout),
  'Root layout still hard-codes viewport meta'
);
expect(
  /export\s+const\s+viewport/.test(layout),
  'Root layout must export viewport metadata'
);

const midiHook = read('src/shared/blocks/harmonium/use-midi-keyboard.ts');
expect(
  midiHook.includes("'not-requested'"),
  'MIDI hook is missing not-requested state'
);
expect(
  !/useEffect\(\(\)\s*=>\s*\{\s*void refreshMidi\(\)/m.test(midiHook),
  'MIDI hook still requests access on mount'
);
expect(
  midiHook.includes('requestMidiAccess'),
  'MIDI hook must expose explicit requestMidiAccess action'
);

if (failures.length) {
  console.error('Organic search growth contract failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Organic search growth contract passed.');
