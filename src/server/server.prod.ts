import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import {StatusCodes} from 'http-status-codes';
import {minify} from 'html-minifier';

import { render } from "server/render";

const PORT = process.env.PORT || 3000;

const dirname = path.dirname(fileURLToPath(import.meta.url));
const resolveFromRoot = (p: string) => path.resolve(dirname, "..", "..", p);

export const createServer = async () => {
  const template = fs.readFileSync(resolveFromRoot('dist/client/index.html'), 'utf-8');
  const minifiedTemplate = minify(template, {collapseWhitespace: true});

  const app = express();

  app.use((await import("compression")).default());
  app.use((await import("serve-static")).default(resolveFromRoot("dist/client")));

  app.use("*", async (request, response) => {
    try {
      const url = request.originalUrl;
      render({url, response, template: minifiedTemplate});
    } catch (e) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).end((e as Error).stack);
    }
  });

  return { app };
};

createServer().then(({ app }) => app.listen(PORT));
