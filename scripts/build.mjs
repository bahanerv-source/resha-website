/**
 * Static build: renders every page to HTML (React on the server), bundles the small
 * client script that hydrates the interactive parts, and writes everything to dist/.
 *   npm run build   → dist/ (deploy this folder; Vercel does it automatically)
 */
import { build } from 'esbuild';
import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const finalDist = path.join(root, 'dist');
const tmp = path.join(root, '.build');
// Build into a staging folder, then swap it in, so a running preview never sees a half-written site.
const dist = path.join(tmp, 'out');
const t0 = Date.now();

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

/* 1. Image manifest: intrinsic sizes for every image + responsive WebP sizes for photographs. */
async function images() {
  const manifest = {};
  let sharp = null;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('! sharp not installed — photos are served at original size');
  }
  const pub = path.join(root, 'public');
  for (const file of await walk(path.join(pub, 'images'))) {
    const url = '/' + path.relative(pub, file).split(path.sep).join('/');
    const ext = path.extname(file).toLowerCase();
    if (ext === '.svg') {
      const src = await readFile(file, 'utf8');
      const vb = src.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
      if (vb) manifest[url] = { w: Math.round(+vb[1]), h: Math.round(+vb[2]) };
    } else if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext) && sharp && !url.startsWith('/images/brand/')) {
      const meta = await sharp(file).metadata();
      // Smaller copies for phones, plus the full-size picture for large and high-density (retina) screens.
      const MAX = 2400;
      const widths = [480, 960, 1600, MAX].filter((w) => w < meta.width).concat(meta.width <= MAX ? [meta.width] : []);
      const variants = [];
      for (const w of [...new Set(widths)]) {
        const outUrl = `/_img${url.replace(/\.[^.]+$/, '')}-${w}.webp`;
        const outFile = path.join(dist, outUrl);
        await mkdir(path.dirname(outFile), { recursive: true });
        if (w === meta.width && ext === '.webp') {
          // Already a WebP at full size: serve the original untouched (re-encoding would only lose detail).
          await cp(file, outFile);
        } else {
          // smartSubsample keeps thin coloured lines (burgundy text on banners) crisp.
          await sharp(file).resize({ width: w }).webp({ quality: 88, smartSubsample: true, effort: 5 }).toFile(outFile);
        }
        variants.push({ w, src: outUrl });
      }
      manifest[url] = { w: meta.width, h: meta.height, variants };
    }
  }
  await mkdir(path.join(root, 'src/generated'), { recursive: true });
  await writeFile(path.join(root, 'src/generated/images.json'), JSON.stringify(manifest, null, 1));
  return Object.keys(manifest).length;
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'public'), dist, { recursive: true });
const nImages = await images();

const common = { bundle: true, jsx: 'automatic', logLevel: 'warning', absWorkingDir: root, define: { 'process.env.NODE_ENV': '"production"' } };

/* 2. Client script + stylesheet (content-hashed, cache forever). */
const client = await build({
  ...common,
  entryPoints: { client: 'src/client.tsx', site: 'src/styles/index.css' },
  outdir: path.join(dist, 'assets'),
  entryNames: '[name]-[hash]',
  chunkNames: 'chunks/[name]-[hash]',
  splitting: true,
  format: 'esm',
  target: ['es2020'],
  minify: true,
  metafile: true,
  loader: { '.svg': 'file', '.woff2': 'file' },
});
const outs = Object.keys(client.metafile.outputs).map((f) => '/' + path.relative(dist, path.join(root, f)).split(path.sep).join('/'));
const assets = { js: outs.find((f) => /\/client-[^/]+\.js$/.test(f)), css: outs.find((f) => /\/site-[^/]+\.css$/.test(f)) };

/* 3. Server renderer → HTML for every route. */
await build({ ...common, entryPoints: ['src/render/server.tsx'], outfile: path.join(tmp, 'server.mjs'), platform: 'node', format: 'esm', packages: 'external' });
const { renderSite } = await import(pathToFileURL(path.join(tmp, 'server.mjs')).href + '?t=' + Date.now());
const files = renderSite(assets);
for (const f of files) {
  const out = path.join(dist, f.path);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, f.body);
}

await rm(finalDist, { recursive: true, force: true });
await rename(dist, finalDist);

const size = async (f) => ((await stat(path.join(finalDist, f))).size / 1024).toFixed(1) + ' KB';
console.log(`✓ ${files.length} files · ${nImages} images · js ${await size(assets.js)} · css ${await size(assets.css)} · ${Date.now() - t0} ms`);
