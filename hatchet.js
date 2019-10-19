#!/usr/bin/env node

const pm2 = require('pm2')
const chalk = require('chalk')

const log = console.log
const error = msg => console.error(chalk.red(msg))

// Import Hatchet
const { Hatchet } = require('./hatchetHelpers')
const { slack, email, webhook, cli, hatchet } = require('./notificationClients')

const startDaemon = (...args) => {
  return pm2.connect(err => {
    if (err) {
      error(err)
      process.exit(2)
    }

    pm2.start(
      {
        script: `hatchet-pm2.js`, // Script to be run
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
      },
    )
  })
}

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

const pm2Restart = (err, apps) => {
  pm2.disconnect()
  if (err) {
    error('Hatchet does not seem to be running...')
  } else {
    log(chalk.green('Hatchet has been restarted'))
  }
}

const pm2Delete = (err, apps) => {
  pm2.disconnect()
  if (err) {
    error('Hatchet does not seem to be running...')
  } else {
    log(chalk.green('Hatchet has been stopped'))
  }
}

const pm2Describe = (err, app) => {
  pm2.disconnect()
  if (app.length && !err) {
    log(chalk.green(`${app[0].pm2_env.name}`))
    log(`Status: ${chalk.yellow(app[0].pm2_env.status)}`)
    log(
      `Config: ${chalk.yellow(
        Object.fromEntries([app[0].pm2_env.args])['--config'],
      )}`,
    )
  } else {
    error('Hatchet does not seem to be running...')
  }
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

    const configuration = require(config)

    const options = {
      // Pass initialized clients here.
      // Notification Clients must provide a 'sendMessage(<string> message, <object> details)'
      // function in order to be functional
      notifications: {
        ...(configuration.HATCHET && {
          hatchet: hatchet(configuration.HATCHET),
        }),
        ...(configuration.SLACK_API && {
          slack: slack(configuration.SLACK_API),
        }),
        ...(configuration.CONSOLE && { cli: cli() }),
      },
    }
    new Hatchet(configuration.logs, options)
    log(chalk.green('Hatchet has started in the foreground...'))
  }
}

const stopHatchet = argv => {
  pm2.delete('Hatchet', pm2Delete)
}

const restartHatchet = argv => {
  pm2.restart('Hatchet', pm2Restart)
}

const statusHatchet = argv => {
  pm2.describe('Hatchet', pm2Describe)
}

require('yargs')
  .scriptName('Hatchet')
  .usage('$0 <cmd> [args]')
  .command('start', 'Start monitoring logs', setHatchetOptions, startHatchet)
  .command('stop', 'Stop monitoring logs', stopHatchet)
  .command('restart', 'Restart Hatchet', restartHatchet)
  .command('status', 'Hatchet Status', statusHatchet)
  .help().argv
