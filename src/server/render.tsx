import {Writable} from 'node:stream';
import {Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {renderToPipeableStream} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';

import {App} from 'client/App';

type RenderInput = {
  url: string;
  styleAssets?: string[];
  entrySrc: string;
  response: Response;
  beginTemplate: string;
  endTemplate: string;
  onError?: (error: Error) => void;
};

export const render = ({
  url,
  styleAssets = [],
  beginTemplate,
  entrySrc,
  response,
  onError = console.error,
}: RenderInput) => {
  const wrappedApp = (
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  let didError = false;
  let transformedBeginTemplate = false;

  const stream =  new Writable({
    write(chunk: Buffer, _encoding, callback) {
      const currentChunk = transformedBeginTemplate
        ? chunk.toString()
        : beginTemplate
            .replace(
              '<!-- STYLES -->',
              styleAssets.map((src) => `<link rel="stylesheet" href=${src} />`).join('')
            )
            .concat(chunk.toString());

      if (!transformedBeginTemplate) {
        transformedBeginTemplate = true;
      }

      response.write(currentChunk, callback);
    },
  });

  const {pipe} = renderToPipeableStream(wrappedApp, {
    bootstrapModules: [entrySrc],
    onAllReady() {
      response
        .status(didError ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.OK)
        .setHeader('content-type', 'text/html')
        .setHeader('Cache-Control', 'no-cache')
      pipe(stream);
      response.flush();
      response.end();
    },
    onShellError() {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR);
      response.flush();
      response.end('<h1>Something went wrong</h1>');
    },
    onError(error) {
      didError = true;
      onError(error as Error);
    }
  });
};
