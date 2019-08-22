const axios = require('axios')

module.exports.slackClient = api => ({
    sendMessage: (text, rawMessage) => axios.post(api, { text })
})
