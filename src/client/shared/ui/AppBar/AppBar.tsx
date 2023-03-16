import { FC } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../Button/Button';

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
      <Button component={Link} to="/">
        Home
      </Button>
      <Button component={Link} to="/pokemons">
        Pokemons
      </Button>
    </nav>
  );
};
