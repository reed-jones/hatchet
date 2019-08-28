
// Meow is the CLI helper
const meow = require('meow')

// get users homedir for config finding
const homedir = require('os').homedir()

// Configure 'meow' cli client
module.exports.meow = meow(`
    Usage
      $ hatchet

    Options
      --config, -c  Path to configuration file

    Examples
      $ hatchet --config /path/to/config.js
`, {
    flags: {
        config: {
            type: 'string',
            alias: 'c',
            // defaults to home dir
            default: `${homedir}/.hatchetrc.js`
        }
    }
});
