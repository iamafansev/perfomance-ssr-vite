import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import { App } from "client/App";

type Asset = {fileName: string};

type Assets = {
  styles: Asset[];
  scripts: Asset[];
}

export const render = (url: string, assets: Assets) => {
  return ReactDOMServer.renderToString(
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
};
