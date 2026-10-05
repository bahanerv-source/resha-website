/** Local preview: builds, serves dist/ on http://localhost:3000 and rebuilds when src/ or public/ change. */
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, statSync, watch } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT) || 3000;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' };

let building = null;
const rebuild = () => {
  if (building) return;
  building = spawn(process.execPath, [path.join(root, 'scripts/build.mjs')], { stdio: 'inherit' });
  building.on('exit', () => (building = null));
};
rebuild();
let timer;
for (const dir of ['src', 'public'])
  watch(path.join(root, dir), { recursive: true }, (_, f) => {
    if (f && f.includes('generated')) return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });

http
  .createServer((req, res) => {
    try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(dist, p);
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
    const notFound = !existsSync(file);
    if (notFound) file = path.join(dist, '404.html');
    const stream = createReadStream(file);
    stream.on('error', () => {
      res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Building… refresh in a moment.');
    });
    stream.on('open', () => {
      res.writeHead(notFound ? 404 : 200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-cache' });
      stream.pipe(res);
    });
    } catch {
      res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Building… refresh in a moment.');
    }
  })
  .listen(port, () => console.log(`ريشة → http://localhost:${port}`));
