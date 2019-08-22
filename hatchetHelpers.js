const Tail = require('tail').Tail;
const { successCallback, errorCallback } = require('./callbacks')

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
