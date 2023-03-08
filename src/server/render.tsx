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
  endTemplate,
  response,
  onError = console.error,
}: RenderInput) => {
  const wrappedApp = (
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  let contentHtml = '';
  let didError = false;

  const stream =  new Writable({
    write(chunk: Buffer, _encoding, cb) {
      contentHtml += chunk.toString();
      response.write('', cb);
    },
  });

  const {pipe} = renderToPipeableStream(wrappedApp, {
    onAllReady() {
      response
        .status(didError ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.OK)
        .setHeader('content-type', 'text/html')
        .setHeader('Cache-Control', 'no-cache');

      pipe(stream);

      const transformedBedinHtml = beginTemplate
        .replace(
          '<!-- STYLES -->',
          styleAssets.map((src) => `<link rel="stylesheet" href=${src} />`).join('')
        );

      const transformedEndHtml = endTemplate
        .replace(
          '<!-- SCRIPTS -->',
          `<script type="module" src="${entrySrc}" async=""></script>`
        );

      const resultHtml = transformedBedinHtml.concat(contentHtml, transformedEndHtml);
      response.end(resultHtml);
    },
    onShellError() {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR);
      response.end('<h1>Something went wrong</h1>');
    },
    onError(error) {
      didError = true;
      onError(error as Error);
    }
  });
};
