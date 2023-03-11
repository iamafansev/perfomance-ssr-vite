import { FC, Suspense, lazy } from 'react';

const PokemonList = lazy(() =>
  import('./PokemonList').then((module) => ({ default: module.PokemonList }))
);

export const PokemonListLazy: FC = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PokemonList />
    </Suspense>
  );
};
