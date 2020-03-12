process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const { exec } = require('child_process');
const nodePath = require('path');

const Webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getConfig = require('../../webpack.config');
const { compilerCb, parseArgs } = require('../utils');

const { APP_PATHS: PATHS } = process.env;
const APP_PATHS = JSON.parse(PATHS);

const [
  execPath,
  scriptPath,
  ...scriptAtgs
] = process.argv;

const SCRIPT_ARGS = parseArgs(scriptAtgs);

// TODO check on win/linux
exec(`rm -rf ${APP_PATHS.dist}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Build cleanup ${error}`);
    return;
  }

  console.log(stdout, stderr);

  const serverConfig = getConfig('node', {
    entry: APP_PATHS.server.entry,
    output: {
      filename: nodePath.parse(APP_PATHS.server.output).base,
      path: APP_PATHS.dist,
      library: '',
      libraryTarget: 'umd',
    },
  });

  const nodePlugins = [new LoadablePlugin()];
  const nodeConfig = getConfig(
    'node',
    { plugins: nodePlugins },
  );

  const webPlugins = [
    new LoadablePlugin(),
    new MiniCssExtractPlugin(),
  ];

  if (SCRIPT_ARGS.analyze) webPlugins.push(new BundleAnalyzerPlugin());

  const webConfig = getConfig(
    'web',
    { plugins: webPlugins },
  );

  Webpack([
    serverConfig,
    nodeConfig,
    webConfig,
  ], compilerCb());
});
