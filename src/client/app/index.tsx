import { Routes, Route } from 'react-router-dom';

import { MainLayout } from 'client/MainLayout';
import { Home } from 'client/Home/Home';
import { Pokemons } from 'client/Pokemons/Pokemons';

import './index.css';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pokemons" element={<Pokemons />} />
      </Route>
    </Routes>
  );
};
