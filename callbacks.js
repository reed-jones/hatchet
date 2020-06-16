const shouldNotify = (name, { notificationConditions = {} }, rawMsg) =>
  notificationConditions[name] && notificationConditions[name](rawMsg)
const notifyEach = (notifications, callback) =>
  Object.entries(notifications).forEach(callback)

const { hatchetClient } = require('./notificationClients/hatchetClient')

module.exports.successCallback = (file, { hatchet: hatchetConfig, drivers }) => data => {
  // run regex & parse groups
  const results = new RegExp(file.regex, 'gm').exec(data)

  /*
    const reg = new RegExp(file.regex, 'gm')
    let m;
    let results = [];
    while ((m = reg.exec(data)) != null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            reg.lastIndex++;
        }

        results.push(m)
    }

    // format the results array
    results.map(({ groups, input, index, ...rest }) => ({ groups, input, index, parts: Object.entries(rest).map(([index, part]) => part) }))
    */
  // Gather all data to be passed to e.g. the string formatter
  const rawMsg = {
    // An error in your regex could likely end you up with a message: undefined: [undefined] undefined undefined
    groups: results.groups || {},
    file: file,
    line: data,
  }

  // get formatted message. if no format function is found, the full line will be returned
  const message = (file.message && file.message(rawMsg)) || `${file.basename}: ${data}`

  let { hatchet, ...desiredNotifications } = file.notifications || {};

  if (hatchet) {
    let mergedHatchet = hatchetConfig.defaults
    for (let [name, options] of Object.entries(hatchet)) {
      mergedHatchet[name] = options
    }

    let enabledOptions = Object.fromEntries(Object.entries(mergedHatchet).filter(([client, options]) => {
      return typeof options.filter === 'undefined' || (typeof options.filter === 'function' && options.filter(rawMsg))
    }))

    const msgClient = hatchetClient({ token: hatchetConfig.key, notifications: enabledOptions })
    msgClient.sendMessage(message, rawMsg).catch(err => console.error(err.response.data.errors))
  }

  const customNotifications = Object.keys(desiredNotifications).filter(n => Object.keys(drivers).includes(n))

  for (let client of customNotifications) {
    const { filter, ...rest } = file.notifications[client]
    const msgClient = drivers[client](rest)

    if (typeof filter === 'function' && filter(rawMsg)) {
      msgClient.sendMessage(message, rawMsg)
    } else if (typeof filter === 'undefined') {
      msgClient.sendMessage(message, rawMsg)
    }
  }
  // if (Object.entries(file.notificationConditions || {}).length) {
  //   // Notify each client as per restrictions (if any)
  //   notifyEach(notifications, ([name, client]) => {
  //     if (
  //       shouldNotify(name, file, rawMsg) ||
  //       shouldNotify('all', file, rawMsg)
  //     ) {
  //       client.sendMessage(message, rawMsg)
  //     }
  //   })
  // } else {
  //   // default is notify all clients
  //   notifyEach(notifications, ([_, client]) =>
  //     client.sendMessage(message, rawMsg),
  //   )
  // }
}

module.exports.errorCallback = error => {
  console.log('ERROR: ', error)
}
