const pm2 = require('pm2')
const chalk = require('chalk')

const log = console.log
const error = msg => console.error(chalk.red(msg))

const pm2Restart = (err, apps) => {
  pm2.disconnect()
  if (err) {
    error('Hatchet does not seem to be running...')
  } else {
    log(chalk.green('Hatchet has been restarted'))
  }
}

const restartHatchet = argv => {
  pm2.restart('Hatchet', pm2Restart)
}

module.exports = ['restart', 'Restart Hatchet', restartHatchet]
