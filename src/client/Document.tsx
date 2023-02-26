import {FC, ReactNode} from 'react';

type Props = {
    styleAssets?: string[];
    children: ReactNode;
};

export const Document: FC<Props> = ({styleAssets = [], children}) => {
    return (
        <html>
        <head>
            <meta charSet="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>App</title>
            {styleAssets.map((src) => <link key={src} rel="stylesheet" href={src} />)}
        </head>
        <body>
            <div id="root">
                {children}
            </div>
        </body>
        </html>
    );
};
