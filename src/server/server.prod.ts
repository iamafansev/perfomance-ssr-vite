import path from "node:path";
import { createRequire } from 'node:module';
import { fileURLToPath } from "node:url";
import express from "express";
import { resolveConfig } from "vite";

const require = createRequire(import.meta.url);

import { render } from "./render";

type Asset = {
  src: string;
  file: string;
};

const PORT = process.env.PORT || 3000;

const dirname = path.dirname(fileURLToPath(import.meta.url));

const resolveFromRoot = (p: string) => path.resolve(dirname, "..", "..", p);

const CSS_EXT = '.css';
const manifest = require(resolveFromRoot('dist/client/manifest.json'));

const prepareAssets = async () => {
  const config = await resolveConfig({}, 'build');

  const entrySrc = config.build.rollupOptions.input as string;
  const entry = manifest[entrySrc] as Asset;
  const entryFile = {fileName: entry.file};
  const stylesFiles = Object
    .values<Asset>(manifest)
    .filter((value) => value.src.endsWith(CSS_EXT))
    .map((value) => ({fileName: value.file}));

  return {styles: stylesFiles, scripts: [entryFile]};
}

export const createServer = async () => {
  const assets = await prepareAssets();

  const app = express();

  app.use((await import("compression")).default());
  app.use(
    (await import("serve-static")).default(resolveFromRoot("dist/client"))
  );

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const appHtml = render(url, assets);

      res.status(200).set({ "Content-Type": "text/html" }).end(appHtml);
    } catch (e) {
      res.status(500).end((e as Error).stack);
    }
  });

  return { app };
};

createServer().then(({ app }) => app.listen(PORT));