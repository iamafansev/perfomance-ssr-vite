import {Writable} from 'node:stream';
import {StatusCodes} from 'http-status-codes';
import {renderToPipeableStream} from "react-dom/server";
import {StaticRouter} from "react-router-dom/server";

import {App} from "client/App";

type Asset = {fileName: string};

type RenderOutput = {
  statusCode: number;
  html: string;
}

type RenderInput = {
  url: string;
  styleAssets?: Asset[];
  entrySrc: string;
};

export const render = ({url, styleAssets = [], entrySrc}: RenderInput) => {
  const wrappedApp = (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>App</title>
        {styleAssets.map(({ fileName }) => <link key={fileName} rel="stylesheet" href={fileName} />)}
      </head>
      <body>
        <div id="root">
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </div>
      </body>
    </html>
  );

  return new Promise<RenderOutput>((resolve) => {
    let didError = false;
    let renderResult: RenderOutput = {html: '', statusCode: StatusCodes.OK};

    const stream = new Writable({
      write(chunk: Buffer, _encoding, callback) {
        renderResult.html += chunk.toString();
        callback();
      },
      final() {
        resolve(renderResult);
      },
    });

    const {pipe} = renderToPipeableStream(wrappedApp, {
      bootstrapModules: [entrySrc],
      onAllReady() {
        renderResult.statusCode = StatusCodes.OK;
        pipe(stream);
      },
      onShellError() {
        renderResult.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        renderResult.html = '<h1>Something went wrong</h1>'; 
      },
      onError(error) {
        didError = true;
        console.error(error);
      }
    });
  });
};
