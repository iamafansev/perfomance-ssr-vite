import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import {AboutLazy} from 'client/About';
import {Home} from 'client/Home/Home';
import "client/index.css";

export const App = () => {
  return (
    <>
      <Helmet>
        <title>Default Title</title>
      </Helmet>
      <Routes>
        <Route path='/about' element={<AboutLazy />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </>
  );
};
