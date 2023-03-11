import { Writable } from 'node:stream';
import { StatusCodes } from 'http-status-codes';
import { renderToPipeableStream } from 'react-dom/server';

import { collectTemplate } from 'server/render/templateUtils';

import { RenderToStream } from './types';

export const renderToStreamWhenAllReady = ({
  jsx,
  response,
  helmetServerState,
  template,
  ssrExchange,
  onError,
}: RenderToStream) => {
  let contentHtml = '';
  let didError = false;

  const stream = new Writable({
    write(chunk: Buffer, _encoding) {
      contentHtml += chunk.toString();
    },
  });

  const { pipe } = renderToPipeableStream(jsx, {
    onAllReady() {
      if (didError) {
        return response.end('<h1>Something went wrong</h1>');
      }

      pipe(stream);

      const html = collectTemplate(template.full, {
        ssrExchange,
        helmetServerState,
        content: contentHtml,
      });

      return response
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
    },
  });
};
