const { Hatchet, slack, email, webhook } = require('./hatchet')


new Hatchet([
    {
        // parse the line into regex groups
        regex: /^(?<date>[\d-]{10} \d{2}:\d{2}:\d{2},\d{3}) \[(?<status>[\w]*) *\] (?<message>.*)$/,

        // the formatted output
        message: ({ groups, file, line }) => `_${file}_: ${groups.date} *[${groups.status}]* ${groups.message}`,

        // the name of the file to be watched
        file: '/var/logs/test.log',

        // Custom Slack Notifications
        notificationConditions: {
            // only send slack notifications if 'status' === 'INFO'
            // 'slack' keyword identifies from the 'notifications'
            // section in the config object
            slack: ({ status }) => status === 'INFO',

            // send all notifications if 'status' === 'ERROR'
            // 'all' is a special keyword to notify all clients
            all: ({ status }) => status === 'ERROR',
        }
    }
], {
        // Pass initialized clients here.
        // Notification Clients must provide a 'sendMessage(<string> message, <object> details)'
        // function in order to be functional
        notifications: {
            slack: slack('https://hooks.slack.com/services/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'),
            email: email({ to: 'hatchet@reedjones.com', subject: 'Hatchet Alert!' }),
            webhook: webhook('https://www.example.com/api/v1/hatchet-endpoint')
        }
})
