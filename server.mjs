import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.argv.includes('--prod');
const port = Number(process.env.PORT) || 3000;
const base = '/';

async function createAppServer() {
  const app = express();

  let template = '';
  let render = null;
  let vite = null;

  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);
  } else {
    app.use(base, express.static(path.resolve(__dirname, 'build/client'), { index: false }));
    template = await fs.readFile(path.resolve(__dirname, 'build/client/index.html'), 'utf-8');
    const serverEntryPath = path.resolve(__dirname, 'build/server/entry-server.mjs');
    ({ render } = await import(pathToFileURL(serverEntryPath).href));
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      let html = '';
      let renderFn = render;

      if (!isProd) {
        const indexPath = path.resolve(__dirname, 'index.html');
        const rawTemplate = await fs.readFile(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, rawTemplate);
        ({ render: renderFn } = await vite.ssrLoadModule('/src/entry-server.tsx'));
      }

      const appHtml = await renderFn(url);
      html = template.replace('<!--ssr-outlet-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      if (vite) {
        vite.ssrFixStacktrace(error);
      }

      const message = error instanceof Error ? error.stack ?? error.message : String(error);
      res.status(500).end(message);
    }
  });

  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`);
  });
}

createAppServer();
