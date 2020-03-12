process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const cp = require('child_process');
const serialize = require('serialize-javascript');
const nodePath = require('path');

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

const getConfig = require('../../webpack.config');
const { compilerCb } = require('../utils');

const { APP_PATHS: PATHS, API_HOST, API_PORT } = process.env;
const APP_PATHS = JSON.parse(PATHS);
const SERVER_DIST = nodePath.resolve(
  __dirname,
  APP_PATHS.server.output,
);

const serverConfig = getConfig('node', {
  entry: APP_PATHS.server.entry,
  output: {
    filename: nodePath.parse(APP_PATHS.server.output).base,
    path: APP_PATHS.dist,
    library: '',
    libraryTarget: 'umd',
  },
});

const { devServer: devServerOptions, ...webConfig } = getConfig(
  'web',
  {
    plugins: [
      new LoadablePlugin(),
      new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        title: 'RSS app',
        template: APP_PATHS.html.entry,
        filename: APP_PATHS.html.output,
        templateParameters: {
          webpack: true,
          apiConfig: serialize({ API_HOST, API_PORT }),
        },
      }),
      new HtmlWebpackHarddiskPlugin(),
    ],
  },
);

let devServer = null;
let nodeProcess = null;
let nodeWatcher = null;

const webCompiler = Webpack(webConfig);
// TODO hook before generate routes if new domain added
webCompiler.hooks.done.tap('DevServer', (params) => {
  console.log('Web compiled');

  const reSpawn = (spawnedProcess) => {
    spawnedProcess.on('exit', (code) => {
      if (!!code) {
        if (devServer) devServer.close();
        process.exit();
      } else {
        nodeProcess = reSpawn(cp.spawn(
          'node',
          [SERVER_DIST],
          { stdio: 'inherit' },
        ));
      }
    });

    return spawnedProcess;
  }

  nodeWatcher = Webpack(serverConfig).watch({
    aggregateTimeout: 300,
    poll: undefined,
  }, compilerCb(() => {
    console.log('Node compiled');
  
    if (!nodeProcess) {
      nodeProcess = reSpawn(cp.spawn(
        'node',
        [SERVER_DIST],
        { stdio: 'inherit' },
      ));
    } else {
      nodeProcess.kill();
    }
  }));
});

const { port, host } = devServerOptions;
devServer = new WebpackDevServer(webCompiler, devServerOptions);
devServer.listen(port, host, () => {
  console.log(`Webpack dev server started on ${host}:${port}`);
});

['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(function(sig) {
  process.on(sig, async () => {
    if (devServer) devServer.close();
    if (nodeWatcher) nodeWatcher.close();
    process.exit();
  });
});
