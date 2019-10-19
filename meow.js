// Meow is the CLI helper
const meow = require('meow')
const pkg = require('./package.json')

// get users homedir for config finding
const homedir = require('os').homedir()

// Configure 'meow' cli client
module.exports.meow = meow(
  `
    Version: ${pkg.version}

    Usage
      $ hatchet

    CLI Options
      --help,     -h  Display Help
      --version,  -v  Display version information
      --config,   -c  Path to configuration file

    ENV_VAR Options
      HATCHET_CONFIG  Path to configuration file


    Examples
      $ hatchet --config /path/to/config.js
      $ HATCHET_CONFIG=/path/to/config.js hatchet

`,
  {
    flags: {
      config: {
        type: 'string',
        alias: 'c',
        // defaults to env var or home dir
        default: process.env.HATCHET_CONFIG || `${homedir}/.hatchetrc.js`,
      },
    },
  },
)
