#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = resolve(__dirname, '..');
const root = resolve(projectRoot, 'src');
const port = Number(process.env.PORT || 8000);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function getContentType(filePath) {
  return mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
}

async function resolvePath(urlPath) {
  const sanitized = urlPath.split('?')[0].split('#')[0] || '/';

  if (sanitized === '/' || sanitized === '') {
    return resolve(root, 'index.html');
  }

  const bases = [root, projectRoot];

  for (const base of bases) {
    const candidate = resolve(base, '.' + sanitized);
    if (!candidate.startsWith(projectRoot)) {
      continue;
    }

    try {
      const stats = await stat(candidate);
      if (stats.isDirectory()) {
        const indexPath = join(candidate, 'index.html');
        try {
          await stat(indexPath);
          return indexPath;
        } catch (error) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
      } else {
        return candidate;
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        continue;
      }
      throw error;
    }
  }

  throw Object.assign(new Error('Not found'), { notFound: true });
}

const server = createServer(async (req, res) => {
  try {
    const filePath = await resolvePath(req.url === '/' ? '/index.html' : req.url);
    const contentType = getContentType(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    createReadStream(filePath).pipe(res);
  } catch (error) {
    if (error.statusCode === 403) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (error.notFound) {
      // fallback to index.html for SPA-like behaviour
      try {
        const fallback = join(root, 'index.html');
        const html = await readFile(fallback);
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        res.end(html);
      } catch (fallbackError) {
        res.writeHead(404);
        res.end('Not found');
      }
      return;
    }

    console.error(error);
    res.writeHead(500);
    res.end('Internal server error');
  }
});

server.listen(port, () => {
  console.log(`Static dev server running at http://localhost:${port}`);
  console.log(`App root: ${root}`);
  console.log(`Project root: ${projectRoot}`);
});
