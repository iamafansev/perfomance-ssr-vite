import { useState } from "react";
import { Helmet } from 'react-helmet-async';

import { AppBar } from "client/AppBar";

import reactLogo from "./react.svg";

import "./Home.css";

export const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Helmet>
          <title>Home</title>
      </Helmet>
      <div className="App">
        <AppBar />
        <div>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button type="button" onClick={() => setCount((prev) => prev + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  );
};
