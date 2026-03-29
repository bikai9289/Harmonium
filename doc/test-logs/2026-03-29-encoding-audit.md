# 2026-03-29 Encoding Audit

## Scope

Full project text-file audit across:
- `src/`
- `content/`
- `doc/`
- root text config files such as `.env`, `package.json`, `README.md`, and `next.config.mjs`

Excluded from the audit:
- `node_modules/`
- `.next/`
- binary assets under `public/`

## Audit Method

Two checks were used:
1. Search for common mojibake or replacement characters.
2. Byte-level UTF-8 validation using a strict UTF-8 decoder.

## Findings

Initial invalid UTF-8 files:
- `content/logs/v1.0.zh.mdx`
- `content/logs/v2.0.zh.mdx`

Cause:
- The files contained valid Chinese text content, but they were not saved with UTF-8 encoding.

## Fix Applied

Both files were rewritten and explicitly saved with UTF-8 encoding.

## Final Result

After the rewrite, the strict UTF-8 validation pass returned no invalid files and no replacement-character files in the audited scope.

## Recommendation

Continue saving all project text files with explicit UTF-8 encoding, especially when writing Chinese Markdown or MDX content from PowerShell.
