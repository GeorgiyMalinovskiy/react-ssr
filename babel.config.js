'use strict';

const isWebTarget = (caller) => !!(caller && caller.target === 'web');
const isWebpack = (caller) => !!(caller && caller.name === 'babel-loader');

module.exports = (api) => {
  const web = api.caller(isWebTarget);
  const webpack = api.caller(isWebpack);

  return {
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          useBuiltIns: web ? 'entry' : undefined,
          corejs: web ? 'core-js@3' : false,
          targets: !web ? { node: 'current' } : undefined,
          modules: webpack ? false : 'commonjs',
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
        },
      ],
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import',
      '@loadable/babel-plugin',
    ],
  };
};
