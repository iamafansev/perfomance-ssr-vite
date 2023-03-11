import { FC } from 'react';

import { PokemonListLazy } from './PockemonListLazy';

export const Pokemons: FC = () => {
  return (
    <main>
      <h1>Pokemons</h1>
      <PokemonListLazy />
    </main>
  );
};
