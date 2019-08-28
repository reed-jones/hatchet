
// export notification clients
const { slackClient } = require("./slackClient");
module.exports.slack = api => slackClient(api)

const { emailClient } = require('./emailClient')
module.exports.email = config => emailClient(config)

const { webhookClient } = require('./webhookClient')
module.exports.webhook = config => webhookClient(config)

const { cliClient } = require('./cliClient')
module.exports.cli = config => cliClient(config)
