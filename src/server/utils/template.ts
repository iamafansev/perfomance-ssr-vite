import { ssrExchange } from 'urql';
import { HelmetServerState } from 'react-helmet-async';

export type CollectTemplateOptions = {
  helmetServerState: { helmet: HelmetServerState };
  css?: string;
  scriptAssets?: string[];
  content?: string;
  ssrExchange: ReturnType<typeof ssrExchange>;
};

const META_SEARCH_VALUE = '<!-- META -->';
const CSS_SEARCH_VALUE = '<!-- CSS -->';
const SCRIPTS_SEARCH_VALUE = '<!-- SCRIPTS -->';
const URQL_DATA_SEARCH_VALUE = '<!-- URQL_DATA -->';
const CONTENT_SEARCH_VALUE = '<!-- CONTENT -->';

const buildScriptTag = (src: string) =>
  `<script type="module" src="${src}"></script>`;

export const splitTemplate = (template: string) =>
  template.split(CONTENT_SEARCH_VALUE);

export const collectBeginTemplate = (
  beginTemplate: string,
  options: Pick<CollectTemplateOptions, 'css' | 'helmetServerState'>
) => {
  const { helmetServerState, css = '' } = options;

  const meta = [
    helmetServerState.helmet.meta.toString(),
    helmetServerState.helmet.title.toString(),
    helmetServerState.helmet.link.toString(),
  ].join('');

  return beginTemplate
    .replace(META_SEARCH_VALUE, meta)
    .replace(CSS_SEARCH_VALUE, css);
};

const collectContentTemplate = (
  contentTemplate: string,
  { content = '' }: Pick<CollectTemplateOptions, 'content'>
) => {
  return contentTemplate.replace(CONTENT_SEARCH_VALUE, content);
};

export const collectEndTemplate = (
  endTemplate: string,
  options: Pick<CollectTemplateOptions, 'scriptAssets' | 'ssrExchange'>
) => {
  const { scriptAssets = [], ssrExchange: ssr } = options;
  const scripts = scriptAssets.map(buildScriptTag).join('');

  const urqlDataScript = `<script>window.urqlData=${JSON.stringify(
    ssr.extractData()
  )}</script>`;

  return endTemplate
    .replace(SCRIPTS_SEARCH_VALUE, scripts)
    .replace(URQL_DATA_SEARCH_VALUE, urqlDataScript);
};

export const collectTemplate = (
  template: string,
  options: CollectTemplateOptions
) => {
  return [
    collectBeginTemplate,
    collectContentTemplate,
    collectEndTemplate,
  ].reduce((acc, collect) => {
    return collect(acc, options);
  }, template);
};
