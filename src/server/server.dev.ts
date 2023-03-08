import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from "node:url";
import express from "express";
import {StatusCodes} from 'http-status-codes';
import {createServer as createViteServer} from "vite";
import {performance} from "perf_hooks";
import {minify} from 'html-minifier';

import {printServerInfo} from "server/utils/printServerInfo";

if (!globalThis.ssrStartTime) {
  globalThis.ssrStartTime = performance.now();
}

type Render = typeof import('./render');

const dirname = path.dirname(fileURLToPath(import.meta.url));
const resolveFromRoot = (p: string) => path.resolve(dirname, "..", "..", p);

export const createServer = async () => {
  const app = express();
  const vite = await createViteServer();
  const template = fs.readFileSync(resolveFromRoot('index.html'), 'utf-8');
  const minifiedTemplate = minify(template, {collapseWhitespace: true});
  const [beginTemplate, endTemplate] = minifiedTemplate.split('<!-- CONTENT -->');

  app.use(vite.middlewares);
  app.use((await import("compression")).default({level: 0}));

  app.use("*", async (request, response) => {
    try {
      const url = request.originalUrl;
      const { render } = await vite!.ssrLoadModule("src/server/render.tsx") as Render;
      const entrySrc = vite.config.build.rollupOptions.input as string;

      const transformedBeginTemplate = await vite.transformIndexHtml(url, beginTemplate);

      render({
        url,
        entrySrc,
        response,
        beginTemplate: transformedBeginTemplate,
        endTemplate,
        onError: vite!.ssrFixStacktrace
      });
    } catch (e) {
      vite!.ssrFixStacktrace(e as Error);
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).end((e as Error).stack);
    }
  });

  return { app, vite };
};

createServer().then(({ app, vite }) => {
  const port = process.env.PORT || vite.config.server.port;
  app.listen(port, () =>
    printServerInfo({ viteServer: vite, port: Number(port) })
  )
});
