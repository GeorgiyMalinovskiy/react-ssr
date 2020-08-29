import React, { FC, useEffect } from 'react';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

import { isPreloadedStatePresent } from 'store/state';
import routes from 'router/routes';

import { Root as OwnProps } from './utils';

const theme = createMuiTheme();

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
      <ThemeProvider theme={theme}>
        <Router>
          {renderRoutes(routes)}
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default Root;
