import {Writable} from 'node:stream';
import {Response} from "express";
import {ViteDevServer} from "vite";

export const genPipeDestinationWithTransformHtml = (transformHtml: ViteDevServer['transformIndexHtml']) => (response: Response, url: string) => {
  let transformedBeginHtml = false;

  return new Writable({
    async write(chunk: Buffer, _encoding, callback) {
      let transformedChunk = chunk.toString();
      if (!transformedBeginHtml) {
        transformedChunk = await transformHtml(url, transformedChunk);
        transformedBeginHtml = true;
      }

      response.write(transformedChunk, callback);
    },
    final(callback) {
      response.end(callback);
    },
  });
};