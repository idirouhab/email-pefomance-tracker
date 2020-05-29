const Client = require('node-poplib-gowhich').Client;

module.exports.getEmails = (scenario, subject) => {
    let config = {
        hostname: scenario.protocol_host,
        port: scenario.protocol_port,
        tls: scenario.protocol_tls | false,
        mailparser: true,
    };

    if (scenario.protocol_user && scenario.protocol_password) {
        config["username"] = scenario.protocol_user;
        config["password"] = scenario.protocol_password;
    }

    var client = new Client(config);

    let startProtocolTime = new Date().getTime();
    return new Promise((resolve, reject) => {
        client.connect((err) => {
            if (err) reject(err);
            if (global.debug) console.log('Getting POP3 email');
            client.retrieveAll(function (err, messages) {
                if (err) reject(err);
                messages.forEach(function (mail, num) {
                    if (mail.subject === subject) {
                        const {receivedDate} = mail;
                        resolve({receivedDate, startProtocolTime});
                        client.dele(num, (err, data) => {
                            if (err) reject(err);
                        });
                    }
                });
                client.quit();
            })
        })
    })
};
