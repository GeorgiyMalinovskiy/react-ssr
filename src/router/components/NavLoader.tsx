import React, {
  useState,
  useEffect,
  useMemo,
  FC,
  ReactNode,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useLocation, matchPath } from 'react-router';
import { matchRoutes } from 'react-router-config';
import { Location } from 'history';

import { useRequest } from 'store/state/network/hooks';
import { RouteProps } from '../utils';

export interface OwnProps {
  routes: RouteProps[];
  children: ReactNode;
}

// TODO implement and use on per route basis
const NavLoader: FC<OwnProps> = ({ routes, children }) => {
  const location = useLocation();
  const [nextLocation, setNextLocation] = useState<Location>(location);

  const [requestData] = useMemo(
    () => {
      const branch = matchRoutes(routes, location.pathname);
      if (branch.length) {
        return branch.reduce((acc, routeProps) => {
          const { route: { resourceName } } = routeProps;
          if (resourceName) {
            return [...acc, routeProps];
          }

          return acc;
        }, []);
      }

      return [];
    },
    [routes, location.pathname],
  );

  return <Route location={nextLocation}>{children}</Route>;
};

export default NavLoader;
