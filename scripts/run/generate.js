const fs = require('fs');
const nodePath = require('path');

const generateMockDbSync = (outputPath) => {
  const db = {
    users: (() => {
      const data = [];
      for (let i = 0; i < 1000; i++) {
        data.push({ id: `${i}`, name: `user${i}` });
      }

      return data;
    })(),
  };

  fs.writeFileSync(
    nodePath.join(outputPath, 'mock_db.json'),
    JSON.stringify(db),
    { flag: 'w' },
  );

  return db;
};

const generateRoutesSync = (domainsPath, outputPath, endpoints = []) => {
  const domains = fs.readdirSync(domainsPath)
    .filter((name) => (
      fs.lstatSync(nodePath.join(domainsPath, name)).isDirectory()
      && /[A-Z]/.test(name[0])
    ));

  const routes = [{
    componentName: 'App',
    path: '/',
    routes: domains.map((componentName) => {
      const route = {
        componentName,
        path: `/${componentName.toLowerCase()}`,
      };

      const isResource = endpoints.includes(componentName.toLowerCase());
      if (isResource) {
        route.resourceName = componentName.toLowerCase();
      };

      return route
    }),
  }];

  fs.writeFileSync(
    nodePath.join(outputPath, 'routes.json'),
    JSON.stringify(routes),
    { flag: 'w' },
  );

  return routes;
};

const { APP_PATHS: PATHS } = process.env;
const APP_PATHS = JSON.parse(PATHS);
const DOMAINS_PATH = nodePath.join(APP_PATHS.web, '-domains');
const ROUTER_PATH = nodePath.join(APP_PATHS.src, 'router');

const endpoints = generateMockDbSync(APP_PATHS.node);
const routes = generateRoutesSync(DOMAINS_PATH, ROUTER_PATH, Object.keys(endpoints));
