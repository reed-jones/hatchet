const axios = require('axios')

module.exports.hatchetClient = ({ token, notifications }) => {
  return {
    sendMessage: async (text, raw) => {
      return axios({
        url: 'https://hatchet.log9.dev/graphql',
        method: 'post',
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          query: `
        mutation AddLogFile {
            addLog(input: {
                message: "${text}"
                raw: "${raw.line}"
                name: "${raw.file.basename}"
                path: "${raw.file.dirname}"
                notifications: ${JSON.stringify(notifications)}
            }){ id }}`,
        },
      })
    },
  }
}
