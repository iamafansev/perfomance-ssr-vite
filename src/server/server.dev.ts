import express from "express";
import { createServer as createViteServer } from "vite";
import { performance } from "perf_hooks";

import { printServerInfo } from "./utils/printServerInfo";

if (!globalThis.ssrStartTime) {
  globalThis.ssrStartTime = performance.now();
}

type Render = typeof import('./render');

export const createServer = async () => {
  const app = express();
  const vite = await createViteServer();

  app.use(vite.middlewares);
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const { render } = await vite!.ssrLoadModule("src/server/render.tsx") as Render;
      const fileName = vite.config.build.rollupOptions.input as string;

      const assets = {
        styles: [],
        scripts: [{ fileName }],
      };

      const markup = render(url, assets);

      res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .end(await vite.transformIndexHtml('/', markup));
    } catch (e) {
      vite!.ssrFixStacktrace(e as Error);
      res.status(500).end((e as Error).stack);
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
