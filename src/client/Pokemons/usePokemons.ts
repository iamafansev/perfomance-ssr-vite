import { useQuery } from 'urql';

import { PokemonsDocument } from './pokemons.graphql-generated';

export const usePokemons = () => {
  return useQuery({ query: PokemonsDocument });
};
