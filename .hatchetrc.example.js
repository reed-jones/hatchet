/**
 * This is an example configuration file.
 * By default hatchet looks for the configuration file
 * saved in ~/.hatchetrc.js however this can be overridden
 * using the --config flag
 *
 * node hatchet --config /path/to/config/file.js
 */
module.exports = {
    /**
     * Notification Client Configuration
     */
    SLACK_API: null, // get url from here: https://api.slack.com/incoming-webhooks
    CONSOLE: false, // display output to command line

    /**
     * Log Files Configuration
     */
    logs: [
        {
            /**
             * parse the line into regex groups to be used in message & notificationConditions
             * (optional)
             *
             * without a regex, the advanced 'groups' features such as 'message', and 'notificationConditions' cannot
             * be used, and you can only be notified with the raw log line
             *
             * @var {RegExp} regex
             */
            regex: /^(?<date>[\d-]{10} \d{2}:\d{2}:\d{2},\d{3}) \[(?<status>[\w]*) *\] (?<message>.*)$/,

            /**
             * The desired message output
             * (optional)
             *
             * @param {Object} context the parent context object
             *
             * @param {Object} context.groups all named regex groups found using the regex above. named groups are made using the (?<groupname>[regexPattern]*) format
             *
             * @param {Object} context.file the formatted/normalized file instance. this object contains all the elements passed in 'this' file configuration as well as the following:
             * @param {String} context.file.basename
             * @param {String} context.file.full_path
             * @param {String} context.file.dirname
             * @param {fs.Stats} context.file.stat
             *
             * @param {String} line the raw line added to the log
             *
             * @return {String}
             */
            message: ({ groups, file, line }) => `${file}: ${groups.date} *[${groups.status}]* ${groups.message}`,

            /**
             * The File to be watched,
             * it is required to either supply this, or 'dir'
             *
             * @var {String} file
             */
            file: '/var/logs/example.log',

            /**
             * Notification Conditions help determine which notifications will get
             * triggered for which clients.
             * (optional)
             *
             * all clients are optional also
             *
             * Implemented clients include:
             *   - slack
             *   - cli
             *   - all*
             *
             * Coming Soon:
             *   - webhook
             *   - email
             *
             * 'all' is a special condition that triggers all configured clients
             * if no 'notificationConditions' key is present, then all lines will
             * be sent to all configured clients by default
             *
             * @var {Object} notificationConditions
             */
            notificationConditions: {
                /**
                 * Only send slack notifications if the regex group 'status' === 'INFO'
                 *
                 * All clients in notificationGroups adhere the same context API
                 *
                 *
                 * @param {Object} context the parent context object
                 *
                 * @param {Object} context.groups all named regex groups found using the regex above. named groups are made using the (?<groupname>[regexPattern]*) format
                 *
                 * @param {Object} context.file the formatted/normalized file instance. this object contains all the elements passed in 'this' file configuration as well as the following:
                 * @param {String} context.file.basename
                 * @param {String} context.file.full_path
                 * @param {String} context.file.dirname
                 * @param {fs.Stats} context.file.stat
                 *
                 * @param {String} line the raw line added to the log
                 *
                 * @return {String}
                 */
                slack: ({ groups }) => groups.status === 'INFO',

                /**
                 * Send all configured notifications if the regex group 'status' === 'ERROR'
                 *
                 * All clients in notificationGroups adhere the same context API
                 *
                 * @param {Object} context the parent context object
                 *
                 * @param {Object} context.groups all named regex groups found using the regex above. named groups are made using the (?<groupname>[regexPattern]*) format
                 *
                 * @param {Object} context.file the formatted/normalized file instance. this object contains all the elements passed in 'this' file configuration as well as the following:
                 * @param {String} context.file.basename
                 * @param {String} context.file.full_path
                 * @param {String} context.file.dirname
                 * @param {fs.Stats} context.file.stat
                 *
                 * @param {String} line the raw line added to the log
                 *
                 * @return {String}
                 */
                all: ({ groups }) => groups.status === 'ERROR',
            }
        }
    ]
}
