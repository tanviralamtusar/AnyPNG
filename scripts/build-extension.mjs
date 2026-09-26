// Builds a minified copy of extension/ into dist/extension/ for store upload.
// The source folder stays unminified and loadable via "Load unpacked".
// Usage: npm run build:ext            → dist/extension/
//        npm run build:ext -- --zip   → also dist/rightmate-<version>.zip (Windows)

import { transform } from 'esbuild';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const src = path.join(root, 'extension');
const distRoot = path.join(root, 'dist');
const out = path.join(distRoot, 'extension');

// Paths (relative to extension/, forward slashes) that never ship.
// inpaint/, assets/ and the orphan pages are unused by the extension (see CLAUDE.md).
const EXCLUDE = [
  /\.zip$/i,
  /(^|\/)\.DS_Store$/,
  /^inpaint(\/|$)/,
  /^assets(\/|$)/,
  /^pages\/(user_profile|processing_status|generate_icons)\.html$/,
  /^scripts\/generate_icons\.js$/,
];

// Our own sources get minified; vendored/generated code is copied as-is.
const isOwnScript = (rel) => /^scripts\/[^/]+\.js$/.test(rel) && rel !== 'scripts/avif_enc.js';
const isOwnStyle = (rel) => /^styles\/[^/]+\.css$/.test(rel);

// Loaded with <script type="module">: top-level names are module-scoped, so they may be renamed.
// Everything else is a classic script sharing globals (license.js via importScripts/<script>),
// so its top-level names must survive — esbuild leaves them alone when no format is set.
const MODULE_SCRIPTS = new Set(['scripts/offscreen.js', 'scripts/yt-relay.js']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  }));
  return files.flat();
}

async function main() {
  await fs.rm(out, { recursive: true, force: true });

  let before = 0;
  let after = 0;
  let minified = 0;

  for (const file of await walk(src)) {
    const rel = path.relative(src, file).split(path.sep).join('/');
    if (EXCLUDE.some((re) => re.test(rel))) continue;

    const dest = path.join(out, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });

    if (isOwnScript(rel) || isOwnStyle(rel)) {
      const code = await fs.readFile(file, 'utf8');
      const result = await transform(code, {
        loader: isOwnStyle(rel) ? 'css' : 'js',
        format: MODULE_SCRIPTS.has(rel) ? 'esm' : undefined,
        minify: true,
        target: 'chrome110',
        legalComments: 'none',
        drop: ['debugger'],
        sourcefile: rel,
      });
      await fs.writeFile(dest, result.code);
      before += Buffer.byteLength(code);
      after += Buffer.byteLength(result.code);
      minified++;
    } else {
      await fs.copyFile(file, dest);
    }
  }

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(`Minified ${minified} files: ${kb(before)} → ${kb(after)}`);
  console.log(`Output: ${path.relative(root, out)}`);

  if (process.argv.includes('--zip')) {
    const { version } = JSON.parse(await fs.readFile(path.join(src, 'manifest.json'), 'utf8'));
    const zip = path.join(distRoot, `rightmate-${version}.zip`);
    await fs.rm(zip, { force: true });
    execFileSync('powershell.exe', [
      '-NoProfile', '-Command',
      `Compress-Archive -Path '${out}\\*' -DestinationPath '${zip}'`,
    ], { stdio: 'inherit' });
    console.log(`Zip: ${path.relative(root, zip)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
