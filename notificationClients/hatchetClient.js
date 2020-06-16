const axios = require('axios')

module.exports.hatchetClient = ({ token, notifications }) => {
  return {
    sendMessage: async (text, raw) => {
      return axios({
        url: 'http://localhost:3000/graphql',
        // url: 'https://hatchet.log9.dev/graphql',
        method: 'post',
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          query: `
mutation addLog($input: NewLogInput!) {
  addLog(input: $input) {
    id
  }
}`,
          variables: {
            input: {
              message: text,
              raw: raw.line,
              name: raw.file.basename,
              path: raw.file.dirname,
              notifications: JSON.stringify(notifications),
            }
          },
        },
      })
    },
  }
}
