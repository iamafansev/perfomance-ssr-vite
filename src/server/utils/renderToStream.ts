import { Writable } from 'node:stream';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { renderToPipeableStream } from 'react-dom/server';
import { ReactNode } from 'react';
import { HelmetServerState } from 'react-helmet-async';

import {
  collectTemplate,
  collectBeginTemplate,
  collectEndTemplate,
} from 'server/utils/collectTemplate';

type RenderToStremWhenAllReady = {
  app: ReactNode;
  response: Response;
  helmetContext: { helmet: HelmetServerState };
  template: string;
  onError: (error: Error) => void;
};

export const renderToStreamWhenAllReady = ({
  app,
  response,
  helmetContext,
  template,
  onError,
}: RenderToStremWhenAllReady) => {
  let contentHtml = '';
  let didError = false;

  const stream = new Writable({
    write(chunk: Buffer, _encoding) {
      contentHtml += chunk.toString();
    },
  });

  const { pipe } = renderToPipeableStream(app, {
    onAllReady() {
      if (didError) {
        return response.end('<h1>Something went wrong</h1>');
      }

      pipe(stream);

      const html = collectTemplate(template, {
        helmetState: helmetContext.helmet,
        content: contentHtml,
      });

      return response
        .status(StatusCodes.OK)
        .setHeader('content-type', 'text/html')
        .setHeader('Cache-Control', 'no-cache')
        .end(html);
    },
    onShellError() {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR);
    },
    onError(error) {
      didError = true;
      onError(error as Error);
    },
  });
};

export const renderToStreamWhenShellReady = ({
  app,
  response,
  helmetContext,
  template,
  onError,
}: RenderToStremWhenAllReady) => {
  let writedBeginHtml = false;
  let didError = false;

  const [beginTemplate, endTemplate] = template.split('<!-- CONTENT -->');

  const stream = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      if (!writedBeginHtml) {
        const chunkWithBeginHtml = collectBeginTemplate(beginTemplate, {
          helmetState: helmetContext.helmet,
        }).concat(chunk.toString());

        response.write(chunkWithBeginHtml, callback);
        writedBeginHtml = true;
      } else {
        response.write(chunk, callback);
      }
    },
    final() {
      response.end(collectEndTemplate(endTemplate, {}));
    },
  });

  const { pipe } = renderToPipeableStream(app, {
    onShellReady() {
      response
        .status(didError ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.OK)
        .setHeader('content-type', 'text/html');
      pipe(stream);
    },
    onShellError() {
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .setHeader('content-type', 'text/html')
        .end('<h1>Something went wrong</h1>');
    },
    onError(error) {
      didError = true;
      onError(error as Error);
    },
  });
};
