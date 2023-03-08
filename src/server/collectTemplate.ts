import {HelmetServerState} from 'react-helmet-async';

type CollectTemplateOptions = {
    helmetState: HelmetServerState;
    styleAssets: string[];
    scriptAssets: string[];
    content: string;
};

const buildStyleTag = (src: string) => `<link rel="stylesheet" href=${src} />`;
const buildScriptTag = (src: string) => `<script type="module" src="${src}"></script>`;

export const collectTemplate = (template: string, options: CollectTemplateOptions) => {
    const {helmetState, styleAssets, scriptAssets, content} = options;

    const styles = styleAssets.map(buildStyleTag).join('');
    const scripts = scriptAssets.map(buildScriptTag).join('');
    const meta = [
        helmetState.meta.toString(),
        helmetState.title.toString(),
        helmetState.link.toString()
    ].join('');

    return template
        .replace('<!-- META -->', meta)
        .replace('<!-- STYLES -->', styles)
        .replace('<!-- SCRIPTS -->', scripts)
        .replace('<!-- CONTENT -->', content);
};
