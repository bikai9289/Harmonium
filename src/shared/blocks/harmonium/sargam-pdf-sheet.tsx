'use client';

import { Download, Printer } from 'lucide-react';

import { NOTE_KEYS } from './constants';

const ALANKAR_PATTERNS = [
  {
    name: 'Alankar 1 (Basic Scale)',
    aroha: 'Sa Re Ga Ma Pa Dha Ni Sa′',
    avaroha: 'Sa′ Ni Dha Pa Ma Ga Re Sa',
  },
  {
    name: 'Alankar 2 (Double Notes)',
    aroha: 'SaSa ReRe GaGa MaMa PaPa DhaDha NiNi Sa′Sa′',
    avaroha: 'Sa′Sa′ NiNi DhaDha PaPa MaMa GaGa ReRe SaSa',
  },
  {
    name: 'Alankar 3 (3-Note Step)',
    aroha: 'SaReGa ReGaMa GaMaPa MaPaDha PaDhaNi DhaNiSa′',
    avaroha: 'Sa′NiDha NiDhaPa DhaPaMa PaMaGa MaGaRe GaReSa',
  },
  {
    name: 'Alankar 4 (4-Note Step)',
    aroha: 'SaReGaMa ReGaMaPa GaMaPaDha MaPaDhaNi PaDhaNiSa′',
    avaroha: 'Sa′NiDhaPa NiDhaPaMa DhaPaMaGa PaMaGaRe MaGaReSa',
  },
  {
    name: 'Alankar 5 (Skip One Note)',
    aroha: 'SaGa ReMa GaPa MaDha PaNi DhaSa′',
    avaroha: 'Sa′Dha NiPa DhaMa PaGa MaRe GaSa',
  },
];

const THAAT_REFERENCE = [
  { name: 'Bilawal', notes: 'Sa Re Ga Ma Pa Dha Ni (All Shuddha / C Major)' },
  { name: 'Kalyan', notes: 'Sa Re Ga Ma♯ Pa Dha Ni (Tivra Ma)' },
  { name: 'Khamaj', notes: 'Sa Re Ga Ma Pa Dha Ni♭ (Komal Ni)' },
  { name: 'Bhairav', notes: 'Sa Re♭ Ga Ma Pa Dha♭ Ni (Komal Re, Dha)' },
  { name: 'Kafi', notes: 'Sa Re Ga♭ Ma Pa Dha Ni♭ (Komal Ga, Ni)' },
  { name: 'Asavari', notes: 'Sa Re Ga♭ Ma Pa Dha♭ Ni♭ (Komal Ga, Dha, Ni)' },
];

export function SargamPdfSheet() {
  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const keyLines = NOTE_KEYS.map(
      (k) =>
        `${k.sargam.padEnd(6)} | Western: ${k.western.padEnd(3)} | Laptop Key: ${k.keycap} | MIDI: ${k.midi}`
    ).join('\n');

    const alankarLines = ALANKAR_PATTERNS.map(
      (a) => `${a.name}\n  Aroha:   ${a.aroha}\n  Avaroha: ${a.avaroha}`
    ).join('\n\n');

    const thaatLines = THAAT_REFERENCE.map(
      (t) => `${t.name.padEnd(10)}: ${t.notes}`
    ).join('\n');

    const content = [
      'PLAY HARMONIUM — FREE SARGAM NOTES & KEYBOARD CHEAT SHEET',
      'Website: https://playharmonium.com/harmonium-notes',
      '==========================================================',
      '',
      '1. 23-KEY HARMONIUM SARGAM + WESTERN + LAPTOP KEYBOARD MAP',
      '----------------------------------------------------------',
      keyLines,
      '',
      '2. ESSENTIAL DAILY ALANKAR PATTERNS (BILAWAL THAAT)',
      '----------------------------------------------------------',
      alankarLines,
      '',
      '3. POPULAR HINDUSTANI THAATS (SCALE FORMULAS)',
      '----------------------------------------------------------',
      thaatLines,
      '',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'harmonium-sargam-notes-cheat-sheet.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="sargam-pdf"
      className="border-t border-[#2a1f1a]/10 bg-white/85 px-4 py-14 sm:py-18"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-[#8b2e2e] uppercase">
              Free Printable Reference
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#2a1f1a] sm:text-4xl">
              Harmonium Sargam Notes PDF &amp; Keyboard Cheat Sheet
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6d5549]">
              Save or print this complete Sa Re Ga Ma harmonium notes chart with
              western note equivalents, laptop QWERTY shortcuts, daily Alankar
              drills, and major Thaat formulas.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8b2e2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f2424]"
              onClick={handlePrintPdf}
              type="button"
            >
              <Printer className="size-4" />
              Save / Print PDF
            </button>
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#8b2e2e]/25 bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#8b2e2e] transition hover:bg-[#fff4e8]"
              onClick={handleDownloadTxt}
              type="button"
            >
              <Download className="size-4" />
              Download Cheat Sheet (.txt)
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-x-auto rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#2a1f1a]">
              23-Key Sa Re Ga Ma to Western &amp; QWERTY Chart
            </h3>
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#2a1f1a]/12 text-xs font-semibold text-[#8b2e2e] uppercase">
                  <th className="py-2 pr-3">Sargam</th>
                  <th className="py-2 pr-3">Western</th>
                  <th className="py-2 pr-3">Key Type</th>
                  <th className="py-2">Laptop Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a1f1a]/8 text-[#5d4a40]">
                {NOTE_KEYS.map((note) => (
                  <tr key={note.id}>
                    <td className="py-2 pr-3 font-semibold text-[#2a1f1a]">
                      {note.sargam}
                    </td>
                    <td className="py-2 pr-3">{note.western}</td>
                    <td className="py-2 pr-3 capitalize">{note.kind}</td>
                    <td className="py-2 font-mono font-semibold text-[#8b2e2e]">
                      {note.keycap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-[#2a1f1a]">
                5 Daily Alankar Practice Patterns
              </h3>
              <div className="mt-4 space-y-3">
                {ALANKAR_PATTERNS.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl border border-[#8b2e2e]/12 bg-white p-3"
                  >
                    <p className="text-xs font-semibold text-[#8b2e2e]">
                      {item.name}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#2a1f1a]">
                      ↑ {item.aroha}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-[#6d5549]">
                      ↓ {item.avaroha}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#2a1f1a]/10 bg-[#fffdf8] p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-[#2a1f1a]">
                Essential Thaat Scale Reference
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#5d4a40]">
                {THAAT_REFERENCE.map((thaat) => (
                  <li key={thaat.name} className="leading-6">
                    <span className="font-semibold text-[#2a1f1a]">
                      {thaat.name}:{' '}
                    </span>
                    {thaat.notes}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
