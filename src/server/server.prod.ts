import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { minify } from 'html-minifier';
import isbot from 'isbot';

import { render } from 'server/render';
import { splitTemplate } from 'server/render/templateUtils';

const PORT = process.env.PORT || 3000;

const dirname = path.dirname(fileURLToPath(import.meta.url));
const resolveFromRoot = (p: string) => path.resolve(dirname, '..', '..', p);

export const createServer = async () => {
  const template = fs.readFileSync(
    resolveFromRoot('dist/client/index.html'),
    'utf-8'
  );
  const minifiedTemplate = minify(template, { collapseWhitespace: true });
  const [beginTemplate, endTemplate] = splitTemplate(minifiedTemplate);

  const app = express();

  app.use((await import('compression')).default());
  app.use(
    (await import('serve-static')).default(resolveFromRoot('dist/client'), {
      index: false,
    })
  );

  app.use('*', async (request, response) => {
    try {
      const url = request.originalUrl;
      const withPrepass = isbot(request.get('user-agent'));

      render({
        url,
        response,
        withPrepass,
        template: {
          full: minifiedTemplate,
          beginTemplate,
          endTemplate,
        },
      });
    } catch (e) {
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end((e as Error).stack);
    }
  });

  return { app };
};

createServer().then(({ app }) => app.listen(PORT));
