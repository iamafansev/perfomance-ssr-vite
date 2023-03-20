import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Button } from 'client/shared/ui';

export const AppBar: FC = () => {
  return (
    <nav
      style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Button component={RouterLink} to="/">
        Home
      </Button>
      <Button component={RouterLink} to="/pokemons">
        Pokemons
      </Button>
    </nav>
  );
};
