import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Typography, Button } from 'client/shared/ui';

import { ReactComponent as ReactLogo } from './react.svg';

import classes from './Home.module.css';

export const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className={classes.app}>
        <div>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className={classes.logo} alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank" rel="noreferrer">
            <ReactLogo className={classes.logo} />
          </a>
        </div>
        <Typography variant="h1">Vite + React</Typography>
        <div className={classes.card}>
          <Button
            component="button"
            type="button"
            onClick={() => setCount((prev) => prev + 1)}
          >
            count is {count}
          </Button>
        </div>
      </div>
    </>
  );
};
