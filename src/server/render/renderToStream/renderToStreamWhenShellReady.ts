import { Writable } from 'node:stream';
import { StatusCodes } from 'http-status-codes';
import { renderToPipeableStream } from 'react-dom/server';

import {
  collectBeginTemplate,
  collectEndTemplate,
} from 'server/render/templateUtils';

import { RenderToStream } from './types';

export const renderToStreamWhenShellReady = ({
  jsx,
  ssrExchange,
  response,
  helmetServerState,
  template,
  onError,
}: RenderToStream) => {
  let writedBeginHtml = false;
  let didError = false;

  const stream = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      if (!writedBeginHtml) {
        const collectedBeginTemplate = collectBeginTemplate(
          template.beginTemplate,
          { helmetServerState }
        );

        const concatedChunks = collectedBeginTemplate.concat(chunk.toString());
        response.write(concatedChunks, callback);
        writedBeginHtml = true;
      } else {
        response.write(chunk, callback);
      }
    },
    final() {
      response.end(collectEndTemplate(template.endTemplate, { ssrExchange }));
    },
  });

  const { pipe } = renderToPipeableStream(jsx, {
    onShellReady() {
      response.status(
        didError ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.OK
      );
      pipe(stream);
    },
    onShellError() {
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .end('<h1>Something went wrong</h1>');
    },
    onError(error) {
      didError = true;
      onError(error as Error);
    },
  });
};
