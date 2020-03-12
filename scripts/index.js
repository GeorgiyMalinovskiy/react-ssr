
const fs = require('fs');
const nodePath =  require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');

const env = dotenv.config();
if (env.error) throw env.error;

const [
  execPath,
  scriptPath,
  scriptFileName,
  ...scriptArgs
] = process.argv;

const SCRIPT_DIR = nodePath.resolve(__dirname, './run');
const SCRIPT_FILENAME = `${scriptFileName}`;
const SCRIPT = nodePath.join(SCRIPT_DIR, SCRIPT_FILENAME);

if(fs.existsSync(SCRIPT)) {
  process.env.APP_PATHS = (() => {
    const root = process.cwd();
    const dist = nodePath.join(root, 'dist');
    const distPublic = nodePath.join(dist, 'public');

    const src = nodePath.join(root, 'src');
    const web = nodePath.join(src, '-web');
    const html = {
      entry: nodePath.join(web, 'template.ejs'),
      output: nodePath.join(distPublic, 'index.html'),
    };
    const node = nodePath.join(src, '-node');
    const server = {
      entry: nodePath.join(node, 'index.ts'),
      output: nodePath.join(dist, 'server.js'),
    };

    return JSON.stringify({
      dist,
      distPublic,
      src,
      web,
      html,
      node,
      server,
    });
  })();
  
  spawn('node', [SCRIPT, ...scriptArgs], { stdio: 'inherit' });
} else {
  const scripts = fs.readdirSync(SCRIPT_DIR);
  console.warn(
    `
    File "${SCRIPT_FILENAME}" doesn't exist, provide one of the following:
    ${scripts}
    `,
  );
}
