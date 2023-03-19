import './global-styles.module.less';

import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

const App = () => (
  <Fragment>
    <Outlet />
  </Fragment>
);

export default App;
