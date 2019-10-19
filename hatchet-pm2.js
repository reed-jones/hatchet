#!/usr/bin/env node

// Import Hatchet
const { Hatchet } = require('./hatchetHelpers')

// import all notification clients
const { slack, email, webhook, cli, hatchet } = require('./notificationClients')

// Parse Command Line Arguments
const argv = require('yargs').argv

// load the configuration file
const configuration = require(argv.config)

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
