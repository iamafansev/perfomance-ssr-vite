import {FC, Suspense, lazy} from 'react';

import {Skeleton} from './Skeleton';

const About = lazy(() => import('./About').then(({ About }) => ({default: About})));

export const AboutLazy: FC = () => {
    return (
        <Suspense fallback={<Skeleton />}>
            <About />
        </Suspense>
    );
};
