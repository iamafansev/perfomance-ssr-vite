import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

import { PokemonListLazy } from './PockemonListLazy';

export const Pokemons: FC = () => {
  return (
    <>
      <Helmet>
        <title>Pockemons</title>
      </Helmet>
      <div style={{ textAlign: 'center' }}>
        <h1>Pokemons</h1>
        <PokemonListLazy />
      </div>
    </>
  );
};
