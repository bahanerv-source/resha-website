/**
 * Local preview: builds, serves dist/ on http://localhost:3000, rebuilds when src/, public/ or scripts/ change,
 * and reloads open pages by itself after every build.
 *   npm run dev   → preview your own edits
 *   npm run live  → the same, plus it fetches new commits from GitHub every 15 seconds,
 *                   so changes pushed from elsewhere appear without typing anything
 */
import { execFile, spawn } from 'node:child_process';
import { createReadStream, existsSync, statSync, watch } from 'node:fs';
import { readFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT) || 3000;
const pull = process.argv.includes('--pull');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2' };

/* Open pages listen here and reload when a build finishes. */
const pages = new Set();
const RELOAD = '<script>new EventSource("/__reload").onmessage = () => location.reload();</script>';

let building = null;
let again = false;
const rebuild = () => {
  // A change during a build is not dropped: one more build runs right after.
  if (building) return void (again = true);
  building = spawn(process.execPath, [path.join(root, 'scripts/build.mjs')], { stdio: 'inherit' });
  building.on('exit', (code) => {
    building = null;
    if (again) {
      again = false;
      return rebuild();
    }
    if (code === 0) for (const res of pages) res.write('data: reload\n\n');
  });
};
rebuild();
let timer;
for (const dir of ['src', 'public', 'scripts'])
  watch(path.join(root, dir), { recursive: true }, (_, f) => {
    if (f && f.includes('generated')) return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });

/* npm run live: fast-forward to the latest commits on GitHub. Never overwrites local edits (git refuses instead). */
if (pull) {
  const git = (...args) => new Promise((ok) => execFile('git', args, { cwd: root }, (err, out) => ok(err ? null : out.trim())));
  const install = () =>
    new Promise((ok) => spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' }).on('exit', ok));
  let warned = false;
  const update = async () => {
    const before = await git('rev-parse', 'HEAD');
    if (before === null || (await git('fetch', '--quiet')) === null) return;
    if ((await git('merge', '--ff-only', '--quiet', '@{u}')) === null) {
      if (!warned) console.log('! New changes on GitHub could not be applied automatically (local edits in the way?). Run `git pull` to see why.');
      warned = true;
      return;
    }
    warned = false;
    const after = await git('rev-parse', 'HEAD');
    if (after === before) return;
    console.log('↓ New changes from GitHub — updating the preview…');
    if (/package(-lock)?\.json/.test((await git('diff', '--name-only', before, after)) ?? '')) await install();
    rebuild();
  };
  update();
  setInterval(update, 15000);
}

http
  .createServer(async (req, res) => {
    try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p === '/__reload') {
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' });
      res.write(': connected\n\n');
      pages.add(res);
      req.on('close', () => pages.delete(res));
      return;
    }
    let file = path.join(dist, p);
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
    const notFound = !existsSync(file);
    if (notFound) file = path.join(dist, '404.html');
    const head = { 'content-type': types[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-cache' };
    if (path.extname(file) === '.html') {
      const html = (await readFile(file, 'utf8')).replace('</body>', `${RELOAD}</body>`);
      res.writeHead(notFound ? 404 : 200, head);
      return res.end(html);
    }
    const stream = createReadStream(file);
    stream.on('error', () => {
      res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Building… refresh in a moment.');
    });
    stream.on('open', () => {
      res.writeHead(notFound ? 404 : 200, head);
      stream.pipe(res);
    });
    } catch {
      res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Building… refresh in a moment.');
    }
  })
  .listen(port, () => console.log(`ريشة → http://localhost:${port}${pull ? '  (updates from GitHub every 15 s)' : ''}`));
