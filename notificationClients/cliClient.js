const axios = require('axios')

module.exports.cliClient = api => ({
    sendMessage: (text, rawMessage) => console.log(text)
})
