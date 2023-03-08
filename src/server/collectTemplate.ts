import { HelmetServerState } from 'react-helmet-async';

type CollectTemplateOptions = {
  helmetState: HelmetServerState;
  css?: string;
  scriptAssets?: string[];
  content: string;
};

const buildScriptTag = (src: string) =>
  `<script type="module" src="${src}"></script>`;

export const collectTemplate = (
  template: string,
  options: CollectTemplateOptions
) => {
  const { helmetState, css = '', scriptAssets = [], content } = options;

  const scripts = scriptAssets.map(buildScriptTag).join('');
  const meta = [
    helmetState.meta.toString(),
    helmetState.title.toString(),
    helmetState.link.toString(),
  ].join('');

  return template
    .replace('<!-- META -->', meta)
    .replace('<!-- CSS -->', css)
    .replace('<!-- SCRIPTS -->', scripts)
    .replace('<!-- CONTENT -->', content);
};
