const compilerCb = (cb = null) => (err, stats) => {
  if (err) {
    console.error(err.stack || err);

    if (err.details) {
      console.error(err.details);
    }

    return;
  }

  const info = stats.toJson(true);

  if (stats.hasErrors()) {
    console.error(info.errors);
    return;
  }

  if (stats.hasWarnings()) console.warn(info.warnings);
  if (cb) cb();
}

const parseArgs = (args = []) => args.reduce(
  (acc, arg) => {
    let key, value;
    if (arg.includes('=')) {
      [key, value] = arg.split('=');
      if (['true', 'false'].includes(value)) {
        value = (value === 'true') ? true : false;
      }
    } else {
      key = arg;
      value = true;
    }

    acc[key] = value;
    return acc;
  },
  {},
);

module.exports = {
  parseArgs,
  compilerCb,
};
