import path from "node:path";
import { createRequire } from 'node:module';
import { fileURLToPath } from "node:url";
import express from "express";
import { resolveConfig } from "vite";

const require = createRequire(import.meta.url);

import { render } from "server/render";

type Asset = {
  src: string;
  file: string;
};

const PORT = process.env.PORT || 3000;

const dirname = path.dirname(fileURLToPath(import.meta.url));

const resolveFromRoot = (p: string) => path.resolve(dirname, "..", "..", p);

const CSS_EXT = '.css';
const manifest = require(resolveFromRoot('dist/client/manifest.json'));

const prepareStyleAssets = async () => {
  return Object
    .values<Asset>(manifest)
    .filter((value) => value.src.endsWith(CSS_EXT))
    .map((value) => ({fileName: value.file}));
};

export const createServer = async () => {
  const styleAssets = await prepareStyleAssets();
  const config = await resolveConfig({}, 'build');
  const entrySrc = config.build.rollupOptions.input as string;

  const app = express();

  app.use((await import("compression")).default());
  app.use(
    (await import("serve-static")).default(resolveFromRoot("dist/client"))
  );

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const renderResult = await render({url, styleAssets, entrySrc});
      res.status(renderResult.statusCode).set({ "Content-Type": "text/html" }).end(renderResult.html);
    } catch (e) {
      res.status(500).end((e as Error).stack);
    }
  });

  return { app };
};

createServer().then(({ app }) => app.listen(PORT));
