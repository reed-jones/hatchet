const Tail = require('tail').Tail;
const chokidar = require('chokidar');
const fs = require('fs');
const homedir = require('os').homedir()
const path = require('path');
const { successCallback, errorCallback } = require('./callbacks')

const absPath = p => p.replace(/^~\//, `${homedir}/`)

module.exports.Hatchet = function (logs, config) {

    /**
     * Starts a new 'tail' instance
     *
     * @param {Object} formatted
     *
     * @return {Object}
     */
    const initTail = formatted => {
        let tail = new Tail(absPath(formatted.full_path))
        tail.on('line', successCallback(formatted, config.notifications))
        tail.on('error', errorCallback)
        return tail
    }

    /**
     * Normalizes & Formats file information
     *
     * @param {String} fullPath
     * @param {Object} log
     *
     * @return {Object}
     */
    const formatFileInfo = (fullPath, log) => ({
        basename: path.basename(fullPath),
        full_path: fullPath,
        dirname: path.dirname(fullPath),
        stat: fs.statSync(fullPath),
        ...log
    })

    /**
     * Find the most recent file based on creation date
     *
     * @param {Object} newest
     * @param {Object} file
     *
     * @return {Object} file
     */
    const getMostRecent = (newest, file) => {
        return file.fileInfo.stat.ctimeMs > newest.fileInfo.stat.ctimeMs ? file : newest
    }

    for (const log of logs) {
        if (log.file) {

            try {
                const fullPath = absPath(log.file)
                const formatted = formatFileInfo(fullPath, log)

                initTail(formatted)

            } catch ({ context }) {
                console.error(context)
            }

        } else if (log.dir) {

            let tail = null;

            // Retrieve all files in the directory
            const files = fs.readdirSync(absPath(log.dir)).map(basename => {
                return formatFileInfo(path.join(absPath(log.dir), basename), log)
            })

            // find newest file and start monitoring
            if (files.length) {
                const formatted = files.reduce(getMostRecent, files[0])
                tail = initTail(formatted)
            }

            // setup the directory watcher
            const watcher = chokidar.watch(absPath(log.dir), {
                ignoreInitial: true,
                persistent: true
            });

            watcher
                .on('add', newFile => {
                    if (tail) {
                        // remove watcher if we are currently watching
                        tail.unwatch();
                        tail = null
                    }

                    const formatted = formatFileInfo(newFile, log)

                    // tail will miss the original write to the file, so we manually call our successCallback
                    successCallback(formatted, config.notifications)(fs.readFileSync(newFile, 'utf8').trim());

                    tail = initTail(formatted)
                })
                // on change is not currently being used (thats what tail is for)
                // .on('change', newFile => console.log(`File ${newFile} has been changed`))
                .on('unlink', newFile => {
                    if (tail && newFile === tail.filename) {
                        tail.unwatch()
                        tail = null
                    }
                });

        }
    }
}
