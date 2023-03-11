import fetch from 'cross-fetch';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import prepass from 'react-ssr-prepass';
import { pipe } from 'wonka';
import {
  Provider,
  createClient,
  ssrExchange,
  dedupExchange,
  fetchExchange,
  cacheExchange,
  Exchange,
} from 'urql';

import { App } from 'client/App';

type Render = {
  url: string;
  withPrepass: boolean;
};

const delayExchange: Exchange = ({ forward }) => {
  return (ops$) => pipe(ops$, forward);
};

export const render = async ({ url, withPrepass }: Render) => {
  const helmetContext: { helmet: HelmetServerState } = {
    helmet: {} as HelmetServerState,
  };

  const ssr = ssrExchange({ isClient: false });
  const client = createClient({
    url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
    suspense: true,
    exchanges: withPrepass
      ? [dedupExchange, cacheExchange, ssr, fetchExchange]
      : [dedupExchange, ssr, delayExchange, fetchExchange],
    fetch,
  });

  const jsx = (
    <Provider value={client}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </Provider>
  );

  if (withPrepass) {
    await prepass(jsx);
  }

  return { jsx, ssr, helmetContext };
};
