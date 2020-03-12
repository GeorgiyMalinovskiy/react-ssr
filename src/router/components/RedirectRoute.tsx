import React, { FC, ReactNode } from 'react';
import {
  Route,
  Redirect,
  RedirectProps,
  StaticContext,
} from 'react-router';

export type OwnProps = RedirectProps & StaticContext;

const RedirectRoute: FC<OwnProps> = ({ from, to, statusCode }) => (
  <Route
    render={({ staticContext }): ReactNode => {
      if (staticContext) staticContext.statusCode = statusCode;
      return <Redirect from={from} to={to} />;
    }}
  />
);

export default RedirectRoute;
