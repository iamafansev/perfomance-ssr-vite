import { ClassNameConfigurator } from '@mui/base/utils';

import { Routing } from 'client/pages';
import { MainLayout } from 'client/shared/ui';

import './index.css';

export const App = () => {
  return (
    <ClassNameConfigurator disableDefaultClasses>
      <MainLayout>
        <Routing />
      </MainLayout>
    </ClassNameConfigurator>
  );
};
