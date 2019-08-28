#!/usr/bin/env node


// Import Hatchet
const { Hatchet } = require('./hatchetHelpers')

// import all notification clients
const { slack, email, webhook, cli } = require('./notificationClients')

// cli argument parser.
const { meow } = require('./meow')

// load the configuration file
const configuration = require(meow.flags.config)

const config = {
    // Pass initialized clients here.
    // Notification Clients must provide a 'sendMessage(<string> message, <object> details)'
    // function in order to be functional
    notifications: {
        ...configuration.SLACK_API && { slack: slack(configuration.SLACK_API) },
        ...configuration.CONSOLE && { cli: cli() }
    }
}

new Hatchet(configuration.logs, config)
