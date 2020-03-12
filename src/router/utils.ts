import {
  RouteProps as RaRouteProps,
  RouteComponentProps as RrRouteComponentProps,
} from 'react-router';
import loadable from '@loadable/component';

import routesJSON from './routes.json';

export interface Route {
  componentName: string;
  resourceName?: string;
  routes?: Route[];
}

interface ResourceRoute extends Route {
  resourceName: string;
}

export interface RouteProps extends RaRouteProps {
  resourceName?: string;
  routes?: RouteProps[];
}

export interface RouteComponentProps extends RrRouteComponentProps {
  route: RouteProps;
}

export const getResourcesRoutes = (
  routes: Route[] = routesJSON,
  resourceRoutes: ResourceRoute[] = [],
): ResourceRoute[] => {
  let result = resourceRoutes;
  routes.forEach((route) => {
    if ('resourceName' in route) resourceRoutes.push(route as ResourceRoute);
    if (route.routes) {
      result = [
        ...resourceRoutes,
        ...getResourcesRoutes(resourceRoutes, route.routes as ResourceRoute[]),
      ];
    }
  });

  return result;
};

export const mapRouteToProps = (
  routes: Route[],
): RouteProps[] => routes.map(({ componentName, ...route }) => {
  const routeProps: RouteProps = {
    ...route,
    component: loadable(() => import(`-web/-domains/${componentName}`)),
  };

  if (route.routes) {
    routeProps.routes = mapRouteToProps(route.routes);
  }

  return routeProps;
});
