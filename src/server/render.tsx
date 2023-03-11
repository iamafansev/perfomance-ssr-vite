import { Response } from 'express';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';

import { App } from 'client/App';
import { renderToStreamWhenAllReady } from 'server/utils/renderToStream';

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
    helmetServerState: helmetContext,
  });
};
