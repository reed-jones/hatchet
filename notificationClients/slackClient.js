const axios = require('axios')

module.exports.slackClient = ({ webhook }) => {
  return {
    // Custom clients _at minimum_ are required to provide a 'sendMessage' function
    sendMessage: (text, rawMessage) => axios.post(webhook, { text }),
  }
}
