const nodePath =  require('path');
const dotenv = require('dotenv');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');

const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = dotenv.config();
if (env.error) throw env.error;

const {
  NODE_ENV,
  APP_PATHS: PATHS,
  APP_HOST,
  APP_PORT,
  API_HOST,
  API_PORT,
} = process.env;
const APP_PATHS = JSON.parse(PATHS);

const IS_PROD = NODE_ENV === 'production';

const getConfig = (target, config = {}) => {
  const baseConfig = {
    name: target,
    mode: NODE_ENV || 'development',
    target,
    devtool: !IS_PROD && target === 'web' && 'inline-source-map',
    entry: `${APP_PATHS.web}/index-${target}.ts`,
    output: {
      path: nodePath.join(APP_PATHS.distPublic, target),
      filename: IS_PROD ? '[name]_bundle_[chunkhash:8].js' : '[name].js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/',
      libraryTarget: target === 'node' ? 'commonjs2' : undefined,
    },
    resolve: {
      modules: [APP_PATHS.src, 'node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { caller: { target } },
          },
        },
        {
          test: /\.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            'css-loader',
          ],
        },
      ],
    },
    externals: target === 'node'
      ? ['@loadable/component', nodeExternals()]
      : undefined,
    plugins: [new Webpack.IgnorePlugin({ resourceRegExp: /__tests__/ })],
  };
  
  if (!IS_PROD && target === 'web') {
    baseConfig.devServer = {
      contentBase: APP_PATHS.distPublic,
      historyApiFallback: true,
      liveReload: false,
      hot: true,
      hotOnly: true,
      open: true,
      stats: { colors: true },
      host: APP_HOST,
      port: +APP_PORT,
      proxy: {
        '/api': {
          target: `http://${API_HOST}:${API_PORT}`,
          secure: false,
        },
      },
    };
  }

  return merge(baseConfig, config);
};

module.exports = getConfig;
