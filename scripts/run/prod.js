process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const { spawn } = require('child_process');
const nodePath = require('path');

const { APP_PATHS: PATHS } = process.env;
const APP_PATHS = JSON.parse(PATHS);
const SERVER_DIST = nodePath.resolve(
  __dirname,
  APP_PATHS.server.output,
);

spawn('node', [SERVER_DIST], { stdio: 'inherit' });
