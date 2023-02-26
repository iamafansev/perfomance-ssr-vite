import {Writable} from 'node:stream';
import {Request, Response} from "express";
import {renderToPipeableStream} from "react-dom/server";
import {StaticRouter} from "react-router-dom/server";

import {App} from "client/App";

type Asset = {fileName: string};

type Assets = {
  styles: Asset[];
  scripts: Asset[];
}

type RenderResult = {
  statusCode: number;
  html: string;
}

export const render = (req: Request, res: Response, assets: Assets) => {
  const url = req.originalUrl;

  const wrappedApp = (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>App</title>
        {assets.styles.map(({ fileName }) => <link key={fileName} rel="stylesheet" href={fileName} />)}
      </head>
      <body>
        <div id="root">
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </div>
        {assets.scripts.map(({ fileName }) => <script key={fileName} src={fileName} type="module" />)}
      </body>
    </html>
  );

  return new Promise<RenderResult>((resolve) => {
    let didError = false;
    let renderResult: RenderResult = {html: '', statusCode: 200};

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
      onAllReady() {
        renderResult.statusCode = 200;
        pipe(stream);
      },
      onShellError() {
        renderResult.statusCode = 500;
        renderResult.html = '<h1>Something went wrong</h1>'; 
      },
      onError(error) {
        didError = true;
        console.error(error);
      }
    });
  });
};
