const fs = require('fs')
const readline = require('readline')
const path = require('path')
const chalk = require('chalk')

const log = console.log
const error = msg => console.error(chalk.red(msg))

const askQuestion = query => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close()
      resolve(ans)
    })
  )
}

const findFile = async filePath => {
  const exists = fs.existsSync(filePath)
  const stat = exists
    ? await fs.promises.lstat(filePath)
    : await fs.promises.lstat(path.dirname(filePath))

  if (exists && stat.isDirectory()) {
    return path.join(filePath, '.hatchetrc.js')
  } else if ((!exists && stat.isDirectory()) || (exists && stat.isFile())) {
    // create
    return filePath
  } else {
    throw 'Could not create config file'
  }
}

// configuration initialization
const setInitOptions = yargs => {
  yargs.option('config', {
    alias: 'c',
    default: `${require('os').homedir()}/.hatchetrc.js`,
    describe: 'Path to configuration file',
  })
}

const initHatchet = async argv => {
  let destination = await findFile(argv.config)

  try {
    // throws error if access is unavailable
    await fs.promises.access(
      path.dirname(destination),
      fs.constants.R_OK | fs.constants.W_OK
    )

    if (fs.existsSync(destination)) {
      let ans

      do {
        ans = await askQuestion(
          chalk.blue(
            `Are you sure you want to overwrite ${chalk.green(destination)}? (y|n) `
          )
        )
      } while (!['y', 'n'].includes(ans))
      if (ans === 'n') {
        return error('Aborting...')
      }
    }

    log(chalk.yellow(`Saving`), chalk.green(destination))

    // copies file
    await fs.promises.copyFile(
      path.resolve('./.hatchetrc.example.js'),
      destination
    )
    log(chalk.green('Save Successful'))
  } catch (err) {
    error(err)
  }
}

module.exports = [
  'init',
  'Create hatchet config file',
  setInitOptions,
  initHatchet,
]
