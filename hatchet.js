#!/usr/bin/env node

const startHatchet = require('./yargCommands/start')
const stopHatchet = require('./yargCommands/stop')
const restartHatchet = require('./yargCommands/restart')
const statusHatchet = require('./yargCommands/status')
const initHatchet = require('./yargCommands/init')

require('yargs')
  .scriptName('Hatchet')
  .usage('$0 <cmd> [args]')
  .command(...startHatchet)
  .command(...stopHatchet)
  .command(...restartHatchet)
  .command(...statusHatchet)
  .command(...initHatchet)
  .help().argv
