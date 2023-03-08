import {Writable} from 'node:stream';
import {Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {renderToPipeableStream} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';
import {HelmetProvider, HelmetServerState} from 'react-helmet-async';

import {App} from 'client/App';
import {collectTemplate} from 'server/collectTemplate';

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
  const helmetContext: {helmet: HelmetServerState} = {helmet: {} as HelmetServerState};

  const wrappedApp = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  let contentHtml = '';
  let didError = false;

  const stream =  new Writable({
    write(chunk: Buffer, _encoding) {
      contentHtml += chunk.toString();
    },
  });

  const {pipe} = renderToPipeableStream(wrappedApp, {
    onAllReady() {
      if (didError) {
        return response.end('<h1>Something went wrong</h1>');
      }

      pipe(stream);

      const html = collectTemplate(template, {
        helmetState: helmetContext.helmet,
        content: contentHtml,
      });

      response
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
    }
  });
};
