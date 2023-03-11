import { Response } from 'express';
import { ReactNode } from 'react';
import { ssrExchange } from 'urql';

import { CollectTemplateOptions } from 'server/render/templateUtils';

export type RenderToStream = {
  jsx: ReactNode;
  ssrExchange: ReturnType<typeof ssrExchange>;
  response: Response;
  template: {
    full: string;
    beginTemplate: string;
    endTemplate: string;
  };
  onError: (error: Error) => void;
} & CollectTemplateOptions;
