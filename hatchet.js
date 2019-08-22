#!/usr/bin/env node


// Import Hatchet
const { Hatchet } = require('./hatchetHelpers')

// import all notification clients
const { slack, email, webhook } = require('./notificationClients')

// cli argument parser.
const { cli } = require('./meow')

// load the configuration file
const configuration = require(cli.flags.config)

// TODO: merge the configuration above with default options

const config = {
    // Pass initialized clients here.
    // Notification Clients must provide a 'sendMessage(<string> message, <object> details)'
    // function in order to be functional
    notifications: {
        ...configuration.SLACK_API && { slack: slack(configuration.SLACK_API) }
    }
}

new Hatchet(configuration.logs, config)
