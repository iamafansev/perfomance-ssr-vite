import express from "express";
import {StatusCodes} from 'http-status-codes';
import { createServer as createViteServer } from "vite";
import { performance } from "perf_hooks";

import { printServerInfo } from "server/utils/printServerInfo";
import { genPipeDestinationWithTransformHtml } from "server/utils/genPipeDestinationWithTransformHtml";

if (!globalThis.ssrStartTime) {
  globalThis.ssrStartTime = performance.now();
}

type Render = typeof import('./render');

export const createServer = async () => {
  const app = express();
  const vite = await createViteServer();

  app.use(vite.middlewares);
  app.use("*", async (request, response) => {
    try {
      const url = request.originalUrl;
      const { render } = await vite!.ssrLoadModule("src/server/render.tsx") as Render;
      const entrySrc = vite.config.build.rollupOptions.input as string;

      render({
        url,
        entrySrc,
        response,
        genPipeDestination: genPipeDestinationWithTransformHtml(vite.transformIndexHtml),
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
