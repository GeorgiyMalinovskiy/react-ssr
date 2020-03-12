import React, { Fragment, FC } from 'react';
import { RouteProps } from 'react-router';
import { Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import { RouteComponentProps } from 'router/utils';

const App: FC<RouteComponentProps> = ({ route }) => (
  <>
    <div>App</div>
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
