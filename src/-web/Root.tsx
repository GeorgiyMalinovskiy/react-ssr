import React, { FC, useEffect } from 'react';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import { isPreloadedStatePresent } from 'store/state';
import routes from 'router/routes';
import NavLoader from 'router/components/NavLoader';

import { Root as OwnProps } from './utils';

// TODO add https://fb.me/react-error-boundaries
const Root: FC<OwnProps> = ({
  store,
  Router,
}) => {
  useEffect(
    () => {
      if (isPreloadedStatePresent(window)) {
        delete window.__PRELOADED_STATE__;
      }
    },
    [],
  );

  return (
    <Provider store={store}>
      <Router>
        <NavLoader routes={routes}>
          {renderRoutes(routes)}
        </NavLoader>
      </Router>
    </Provider>
  );
};

export default Root;
