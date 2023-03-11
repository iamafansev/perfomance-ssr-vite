import { Response } from 'express';
import { ReactNode } from 'react';

import { CollectTemplateOptions } from 'server/utils/template';

export type RenderToStremWhenAllReady = {
  app: ReactNode;
  response: Response;
  template: {
    full: string;
    beginTemplate: string;
    endTemplate: string;
  };
  onError: (error: Error) => void;
} & CollectTemplateOptions;
