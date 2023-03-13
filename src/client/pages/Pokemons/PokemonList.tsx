import { isNotNullable } from 'client/utils';

import { usePokemons } from './usePokemons';

export const PokemonList = () => {
  const [{ data, fetching, error }] = usePokemons();

  return (
    <div>
      {fetching && <p>Loading...</p>}
      {error && <p>Oh no... {error.message}</p>}
      {data && (
        <ul>
          {data.pokemons?.filter(isNotNullable).map((pokemon) => (
            <li key={pokemon.id}>{pokemon.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
