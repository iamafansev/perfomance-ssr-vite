import { Routes, Route } from 'react-router-dom';

import { Home } from 'client/Home/Home';
import { Pokemons } from 'client/Pokemons/Pokemons';
import 'client/index.css';

export const App = () => {
  return (
    <Routes>
      <Route path="/pokemons" element={<Pokemons />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
