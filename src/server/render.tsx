import {ComponentProps} from 'react';
import {Writable} from 'node:stream';
import {Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {renderToPipeableStream} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';

import {App} from 'client/App';
import {Document} from 'client/Document';

type DocumentProps = ComponentProps<typeof Document>;

type RenderInput = {
  url: string;
  styleAssets?: DocumentProps['styleAssets'];
  entrySrc: string;
  response: Response;
  isCrawler: boolean;
  genPipeDestination?: (response: Response, url: string) => Writable;
  onError?: (error: Error) => void;
};

const defaultGenPipeDestination = (response: Response) => response;

export const render = ({
  url,
  styleAssets,
  entrySrc,
  response,
  isCrawler,
  onError = console.error,
  genPipeDestination = defaultGenPipeDestination
}: RenderInput) => {
  const wrappedApp = (
    <Document styleAssets={styleAssets}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
    </Document>
  );

  let didError = false;

  const destination = genPipeDestination(response, url);

  const {pipe} = renderToPipeableStream(wrappedApp, {
    bootstrapModules: [entrySrc],
    onAllReady() {
      if (isCrawler) {
        response.statusCode = didError ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.OK;
        response.setHeader('content-type', 'text/html');
        pipe(destination);      
      }
    },
    onShellReady() {
      if (!isCrawler) {
        response.statusCode = didError ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.OK;
        response.setHeader('content-type', 'text/html');
        pipe(destination);
      }
    },
    onShellError() {
      response.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      response.end('<h1>Something went wrong</h1>');
    },
    onError(error) {
      didError = true;
      onError(error as Error)
    }
  });
};
