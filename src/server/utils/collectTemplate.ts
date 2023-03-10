import { HelmetServerState } from 'react-helmet-async';

type CollectTemplateOptions = {
  helmetState: HelmetServerState;
  css?: string;
  scriptAssets?: string[];
  content: string;
};

const buildScriptTag = (src: string) =>
  `<script type="module" src="${src}"></script>`;

export const collectBeginTemplate = (
  beginTemplate: string,
  options: Pick<CollectTemplateOptions, 'css' | 'helmetState'>
) => {
  const { helmetState, css = '' } = options;

  const meta = [
    helmetState.meta.toString(),
    helmetState.title.toString(),
    helmetState.link.toString(),
  ].join('');

  return beginTemplate
    .replace('<!-- META -->', meta)
    .replace('<!-- CSS -->', css);
};

const collectContentTemplate = (
  contentTemplate: string,
  options: Pick<CollectTemplateOptions, 'content'>
) => {
  return contentTemplate.replace('<!-- CONTENT -->', options.content);
};

export const collectEndTemplate = (
  endTemplate: string,
  options: Pick<CollectTemplateOptions, 'scriptAssets'>
) => {
  const { scriptAssets = [] } = options;
  const scripts = scriptAssets.map(buildScriptTag).join('');
  return endTemplate.replace('<!-- SCRIPTS -->', scripts);
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
