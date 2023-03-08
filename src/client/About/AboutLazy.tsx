import { FC, Suspense, lazy } from 'react';

import { Skeleton } from './Skeleton';

const About = lazy(() =>
  import('./About').then((module) => ({ default: module.About }))
);

export const AboutLazy: FC = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <About />
    </Suspense>
  );
};
