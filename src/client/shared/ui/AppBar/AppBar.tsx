import { Link } from 'react-router-dom';

export const AppBar = () => {
  return (
    <nav
      style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/pokemons">Pokemons</Link>
    </nav>
  );
};
