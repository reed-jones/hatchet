const pm2 = require('pm2')
const chalk = require('chalk')

const log = console.log
const error = msg => console.error(chalk.red(msg))

const pm2Describe = (err, app) => {
  pm2.disconnect()
  if (app.length && !err) {
    log(chalk.green(`${app[0].pm2_env.name}`))
    log(`Status: ${chalk.yellow(app[0].pm2_env.status)}`)
    log(
      `Config: ${chalk.yellow(
        Object.fromEntries([app[0].pm2_env.args])['--config']
      )}`
    )
  } else {
    error('Hatchet does not seem to be running...')
  }
}

const statusHatchet = argv => {
  pm2.describe('Hatchet', pm2Describe)
}

module.exports = ['status', 'Hatchet Status', statusHatchet]
