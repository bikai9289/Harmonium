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
    terms: ['online harmonium', 'play harmonium online', 'no download'],
  },
  {
    path: 'src/app/[locale]/(landing)/virtual-harmonium/page.tsx',
    route: '/virtual-harmonium',
    terms: ['virtual harmonium', 'browser', 'no sign-up'],
  },
  {
    path: 'src/app/[locale]/(landing)/harmonium-notes/page.tsx',
    route: '/harmonium-notes',
    terms: ['harmonium notes', 'Sargam', 'western note'],
  },
  {
    path: 'src/app/[locale]/(landing)/laptop-harmonium/page.tsx',
    route: '/laptop-harmonium',
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
  }
}

const home = read('src/app/[locale]/(landing)/page.tsx');
for (const term of [
  'online harmonium',
  'virtual harmonium',
  'no download',
  'no sign-up',
  'laptop keyboard',
]) {
  expect(
    home.toLowerCase().includes(term),
    `Homepage copy is missing: ${term}`
  );
}

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
