import fs from 'node:fs';
import path from "node:path";
import { createRequire } from 'node:module';
import { fileURLToPath } from "node:url";
import express from "express";
import { resolveConfig } from "vite";
import {StatusCodes} from 'http-status-codes';
import {minify} from 'html-minifier';

const require = createRequire(import.meta.url);

import { render } from "server/render";

type ManifestAsset = {
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
    .values<ManifestAsset>(manifest)
    .filter((value) => value.src.endsWith(CSS_EXT))
    .map((value) => value.file);
};

export const createServer = async () => {
  const styleAssets = await prepareStyleAssets();
  const config = await resolveConfig({}, 'build');
  const entrySrc = (manifest[config.build.rollupOptions.input as string] as ManifestAsset).file;

  const template = fs.readFileSync(resolveFromRoot('index.html'), 'utf-8');
  const minifiedTemplate = minify(template, {collapseWhitespace: true});

  const app = express();

  app.use((await import("compression")).default());
  app.use((await import("serve-static")).default(resolveFromRoot("dist/client")));

  app.use("*", async (request, response) => {
    try {
      const url = request.originalUrl;
      render({
        url,
        styleAssets,
        entrySrc,
        response,
        template: minifiedTemplate,
      });
    } catch (e) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).end((e as Error).stack);
    }
  });

  return { app };
};

createServer().then(({ app }) => app.listen(PORT));
