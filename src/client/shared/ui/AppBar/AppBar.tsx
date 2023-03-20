import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Link } from 'client/shared/ui';

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
      <Link component={RouterLink} to="/">
        Home
      </Link>
      <Link component={RouterLink} to="/pokemons">
        Pokemons
      </Link>
    </nav>
  );
};
