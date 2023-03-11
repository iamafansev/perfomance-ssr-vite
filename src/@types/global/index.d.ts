import { ssrExchange } from 'urql';

export {};

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var ssrStartTime: number;

  interface Window {
    urqlData: ReturnType<ReturnType<typeof ssrExchange>['extractData']>;
  }
}
