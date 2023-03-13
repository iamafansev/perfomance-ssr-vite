import { Route, Routes } from 'react-router-dom';

import { Home } from './Home/Home';
import { Pokemons } from './Pokemons/Pokemons';

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemons" element={<Pokemons />} />
    </Routes>
  );
};
