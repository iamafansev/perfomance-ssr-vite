import { ReactNode, FC } from 'react';

import { AppBar } from 'client/shared/ui/AppBar/AppBar';

import classes from './MainLayout.module.css';

type Props = {
  children: ReactNode;
};

export const MainLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <header>
        <AppBar />
      </header>
      <main className={classes.mainContent}>{children}</main>
      <footer className={classes.footer} />
    </>
  );
};
