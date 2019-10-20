const path = require('path')
const pm2 = require('pm2')
const chalk = require('chalk')

const log = console.log
const error = msg => console.error(chalk.red(msg))

// Import Hatchet
const { Hatchet } = require('../hatchetHelpers')

const setHatchetOptions = yargs => {
  yargs.option('config', {
    alias: 'c',
    default: `${require('os').homedir()}/.hatchetrc.js`,
    describe: 'Path to configuration file',
  })
  yargs.option('foreground', {
    alias: 'fg',
    default: false,
    type: 'boolean',
    describe: 'Run hatchet in the foreground (background by default)',
  })
}

const startHatchet = argv => {
  // collect pass through options
  const { config, foreground } = argv
  const passThroughArgs = Object.entries({ config })
    .flatMap(([a, b]) => ['--' + a, b])
    .join(' ')

  if (!foreground) {
    startDaemon(passThroughArgs)
  } else {
    new Hatchet(require(config))
    log(chalk.green('Hatchet has started in the foreground...'))
  }
}

const startDaemon = args => {
  return pm2.connect(err => {
    if (err) {
      error(err)
      process.exit(2)
    }

    pm2.start(
      {
        script: path.resolve(__dirname, `..`, `hatchet-pm2.js`), // Script to be run
        name: 'Hatchet',
        args,
        exec_mode: 'fork', // Allows your app to be clustered
        max_restarts: 1,
        instances: 1, // Optional: Scales your app by 4
        max_memory_restart: '100M', // Optional: Restarts your app if it reaches 100Mo
      },
      (err, apps) => {
        pm2.disconnect() // Disconnects from PM2
        log(chalk.green('Hatchet has started in the background using pm2...'))

          if (err) {
          throw err
        }
      }
    )
  })
}

module.exports = [
  'start',
  'Start monitoring logs',
  setHatchetOptions,
  startHatchet,
]
