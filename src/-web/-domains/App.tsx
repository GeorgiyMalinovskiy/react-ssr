import React, { Fragment, FC, useEffect } from 'react';
import { RouteProps } from 'react-router';
import { Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import loadable from '@loadable/component';

import { RouteComponentProps } from 'router/utils';

const MUI = loadable.lib(() => import('@material-ui/core'));

const App: FC<RouteComponentProps> = ({ route }) => (
  <>
    <div>App</div>
    <MUI>{({ Button }) => <Button>Primary</Button>}</MUI>
    {
      route.routes!.map((r: RouteProps, i: number) => (
        <Fragment key={`route-link-${i}`}>
          <Link to={r.path as string}>{r.path}</Link>
          <br />
        </Fragment>
      ))
    }
    {renderRoutes(route.routes)}
  </>
);

export default App;
