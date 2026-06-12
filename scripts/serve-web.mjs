import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createServer as createProbeServer } from 'node:net';
import { extname, join, normalize, resolve } from 'node:path';

const preferredPort = Number(process.env.PORT ?? 4173);
const root = resolve('dist');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function resolveFile(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const requested = resolve(join(root, cleanPath));

  if (!requested.startsWith(root)) {
    return null;
  }

  if (existsSync(requested) && statSync(requested).isFile()) {
    return requested;
  }

  return join(root, 'index.html');
}

function createSiteServer() {
  return createServer((request, response) => {
  const filePath = resolveFile(request.url ?? '/');

  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Run npm run build:web before npm run serve:web');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
  });
}

function isPortFree(port) {
  return new Promise((resolvePort) => {
    const probe = createProbeServer();

    probe.once('error', () => resolvePort(false));
    probe.once('listening', () => {
      probe.close(() => resolvePort(true));
    });
    probe.listen(port, '127.0.0.1');
  });
}

async function findPort() {
  for (let port = preferredPort; port < preferredPort + 20; port += 1) {
    if (await isPortFree(port)) {
      return port;
    }
  }

  throw new Error(`No free port found from ${preferredPort} to ${preferredPort + 19}`);
}

const port = await findPort();
createSiteServer().listen(port, '127.0.0.1', () => {
  console.log(`TET-2026 web site: http://localhost:${port}`);
});
