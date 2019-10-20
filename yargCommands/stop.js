const pm2 = require('pm2')
const chalk = require('chalk')

const log = console.log
const error = msg => console.error(chalk.red(msg))

const stopHatchet = argv => {
  pm2.delete('Hatchet', pm2Delete)
}

const pm2Delete = (err, apps) => {
  pm2.disconnect()
  if (err) {
    error('Hatchet does not seem to be running...')
  } else {
    log(chalk.green('Hatchet has been stopped'))
  }
}

module.exports = ['stop', 'Stop monitoring logs', stopHatchet]
