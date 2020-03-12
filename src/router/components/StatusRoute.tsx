import React, { FC, ReactNode } from 'react';
import { Route, StaticContext } from 'react-router';

export interface OwnProps extends StaticContext {
  children: ReactNode;
}

const StatusRoute: FC<OwnProps> = ({ statusCode, children }) => (
  <Route
    render={({ staticContext }): ReactNode => {
      if (staticContext) staticContext.statusCode = statusCode;
      return children;
    }}
  />
);

export default StatusRoute;
