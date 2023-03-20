import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

import { Typography } from 'client/shared/ui';

import { PokemonListLazy } from './PockemonListLazy';

export const Pokemons: FC = () => {
  return (
    <>
      <Helmet>
        <title>Pockemons</title>
      </Helmet>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h1">Pokemons</Typography>
        <PokemonListLazy />
      </div>
    </>
  );
};
