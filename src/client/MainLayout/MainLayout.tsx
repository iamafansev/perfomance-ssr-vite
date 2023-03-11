import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { AppBar } from 'client/AppBar';

import classes from './MainLayout.module.css';

export const MainLayout: FC = () => {
  return (
    <>
      <header>
        <AppBar />
      </header>
      <main className={classes.mainContent}>
        <Outlet />
      </main>
      <footer className={classes.footer} />
    </>
  );
};
