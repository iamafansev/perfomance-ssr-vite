import { Writable } from 'node:stream';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { renderToPipeableStream } from 'react-dom/server';
import { ReactNode } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';

import { App } from 'client/App';
import { collectTemplate } from 'server/collectTemplate';

type RenderToStremWhenAllReady = {
  app: ReactNode;
  response: Response;
  helmetContext: { helmet: HelmetServerState };
  template: string;
  onError: (error: Error) => void;
};

const renderToStreamWhenAllReady = ({
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

type RenderInput = {
  url: string;
  response: Response;
  template: string;
  onError?: (error: Error) => void;
};

export const render = ({
  url,
  template,
  response,
  onError = console.error,
}: RenderInput) => {
  const helmetContext: { helmet: HelmetServerState } = {
    helmet: {} as HelmetServerState,
  };

  const wrappedApp = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  renderToStreamWhenAllReady({
    template,
    response,
    app: wrappedApp,
    onError,
    helmetContext,
  });
};
