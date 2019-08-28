const shouldNotify = (name, { notificationConditions = {} }, { groups }) => notificationConditions[name] && notificationConditions[name](groups)
const notifyEach = (notifications, callback) => Object.entries(notifications).forEach(callback)

module.exports.successCallback = (file, notifications = {}) => data => {

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
    if (results && results.length) {
        // Gather all data to be passed to e.g. the string formatter
        const rawMsg = {
            // An error in your regex could likely end you up with a message: undefined: [undefined] undefined undefined
            groups: results.groups || {},
            file: file,
            line: data
        }

        // get formatted message. if no format function is found, the full line will be returned
        const message = file.message && file.message(rawMsg) || `${file.basename}: ${data}`

        if (Object.entries(file.notificationConditions || {}).length) {

            // Notify each client as per restrictions (if any)
            notifyEach(notifications, ([name, client]) => {
                if (shouldNotify(name, file, results) || shouldNotify('all', file, results)) {
                    client.sendMessage(message, rawMsg)
                }
            })

        } else {
            // default is notify all clients
            notifyEach(notifications, ([_, client]) => client.sendMessage(message, rawMsg))
        }
    }
}

module.exports.errorCallback = error => {
    console.log('ERROR: ', error);
}
