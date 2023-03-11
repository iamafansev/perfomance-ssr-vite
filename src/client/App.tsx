import { Routes, Route } from 'react-router-dom';

import { AboutLazy } from 'client/About';
import { Home } from 'client/Home/Home';
import { Pokemons } from 'client/Pokemons/Pokemons';
import 'client/index.css';

export const App = () => {
  return (
    <Routes>
      <Route path="/about" element={<AboutLazy />} />
      <Route path="/pokemons" element={<Pokemons />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
