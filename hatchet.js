const Tail = require('tail').Tail;
const { successCallback, errorCallback } = require('./callbacks')

// export notification clients
const { slackClient } = require("./notificationClients/slackClient");
module.exports.slack = api => slackClient(api)

const { emailClient } = require('./notificationClients/emailClient')
module.exports.email = config => emailClient(config)

const { webhookClient } = require('./notificationClients/webhookClient')
module.exports.webhook = config => webhookClient(config)


module.exports.Hatchet = function (files, config) {
    for (const file of files) {
        try {
            file.tail = new Tail(file.file)
            file.tail.on('line', successCallback(file, config.notifications))
            file.tail.on('error', errorCallback)
        } catch ({ context }) {
            console.error(context)
        }
    }
}
