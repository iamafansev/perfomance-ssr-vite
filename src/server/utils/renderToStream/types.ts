import { Response } from 'express';
import { ReactNode } from 'react';

import { CollectTemplateOptions } from './collectTemplate';

export type RenderToStremWhenAllReady = {
  app: ReactNode;
  response: Response;
  template: string;
  onError: (error: Error) => void;
} & CollectTemplateOptions;
