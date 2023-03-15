import { ClassNameConfigurator } from '@mui/base/utils';

import { Routing } from 'client/pages';

import './index.css';

export const App = () => {
  return (
    <ClassNameConfigurator disableDefaultClasses>
      <Routing />
    </ClassNameConfigurator>
  );
};
