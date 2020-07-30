const imap = require('imap-simple');

module.exports.getEmails = (scenario, subject, cb) => {
    let config = {
        imap: {
            host: scenario.protocol_host,
            port: scenario.protocol_port,
            tls: scenario.protocol_tls | false,
            tlsOptions: {
                rejectUnauthorized: false
            },
        }
    };

    if (scenario.protocol_user && scenario.protocol_password) {
        config.imap["user"] = scenario.protocol_user;
        config.imap["password"] = scenario.protocol_password;
    }

    return new Promise((resolve, reject) => {
        let startProtocolTime = new Date().getTime();
        imap.connect(config).then(connection => {
            if (global.debug) console.log('Getting IMAP email');
            connection.openBox(scenario.folder).then(() => {
                const searchCriteria = [
                    'UNSEEN',
                     ['SUBJECT', subject]
                ];
                return connection.search(searchCriteria, {bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)']});
            }).then(messages => {
                messages.forEach((message) => {
                    const {date, uid} = message.attributes;
                    resolve({receivedDate: date, startProtocolTime});
                    connection.deleteMessage([uid]);
                });
                connection.imap.closeBox(true, (err) => { //Pass in false to avoid delete-flagged messages being removed
                    if (err) {
                        reject(err);
                    }
                });
                connection.end();
            }).catch(err => {
                reject(err)
            })
        }).catch((err) => reject(err))
    })
};
