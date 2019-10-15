const axios = require('axios')

module.exports.hatchetClient = TOKEN => ({
  sendMessage: async (text, raw) => {
    return axios({
      url: 'https://hatchet.log9.dev/graphql',
      method: 'post',
      headers: {
        Authorization: `bearer ${TOKEN}`,
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
                notifications: ["email"]
            }){ id }}`,
      },
    })
  },
})
