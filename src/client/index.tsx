import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import {
  Provider,
  createClient,
  dedupExchange,
  cacheExchange,
  ssrExchange,
  fetchExchange,
} from 'urql';

import { App } from 'client/App';

const ssr = ssrExchange({
  isClient: true,
  initialState: window.urqlData,
});

const client = createClient({
  url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
  suspense: true,
  exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
});

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider value={client}>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>
);
