import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

import { MainLayout } from 'client/shared/ui/templates/MainLayout';

import { PokemonListLazy } from './PockemonListLazy';

export const Pokemons: FC = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Pockemons</title>
      </Helmet>
      <div style={{ textAlign: 'center' }}>
        <h1>Pokemons</h1>
        <PokemonListLazy />
      </div>
    </MainLayout>
  );
};
