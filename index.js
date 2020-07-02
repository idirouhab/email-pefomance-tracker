const SMTP = require("./smtp");
const IMAP = require("./imap");
const {sendToInsights} = require("./insights");
const POP3 = require('./pop3');
const Data = require("./load-data");
const {v4: uuidv4} = require('uuid');
const sp = require('synchronized-promise');
const sleep = require('atomic-sleep');
const cron = require("node-cron");

const retrieveMessage = (scenario, subject) => {
    let method;
    switch (scenario.protocol) {
        case "imap":
            method = IMAP.getEmails(scenario, subject)
            break;
        case "pop3":
            method = POP3.getEmails(scenario, subject);
            break;
        default:
            throw Error(`${scenario.protocol} not defined as a protocol, it must be imap or pop3`)
    }
    return (method);
};

const configuration = Data.getYaml();
global.debug = configuration.debug;
cron.schedule("* * * * *", function () {
    configuration.scenarios.forEach((scenario, index) => {
        const subject = `${configuration.subject} - {${uuidv4()}} - ${scenario.protocol}`;
        const sentTimeDate = new Date();
        const sentTime = sentTimeDate.getTime();
        try {
            let SMTPResponse;
            try {
                SMTPResponse = sp(SMTP.send)(scenario, subject);
            } catch (e) {
                throw new Error(e.message)
            }
            //Extract time that the message was sent
            const {messageTime, messageId} = SMTPResponse;
            sleep(1000);
            //Get the message that was sent previously
            //We will be passing the different scenario which contains the configuration details
            let protocolResponse = sp(retrieveMessage)(scenario, subject);

            const {startProtocolTime} = protocolResponse;
            const endProtocolTime = new Date().getTime();
            const protocolResponseTime = (endProtocolTime - startProtocolTime);
            const totalResponseTime = messageTime + protocolResponseTime;

            const payload = {
                subject: subject,
                messageId: messageId,
                sent_at: sentTime,
                total_response_time: totalResponseTime,
                smtp_response_time: messageTime,
                retrieval_response_time: protocolResponseTime,
                smtp_server: scenario.smtp_host,
                retrieval_server: scenario.protocol_host,
                protocol: scenario.protocol,
                smtp_error: SMTPResponse.rejected.length > 0,
                protocol_error: !!protocolResponse.rejected
            };
            if (global.debug) console.log(payload);
            sendToInsights(payload, configuration.newrelic);
        } catch (e) {
            console.log(e.message);

            let errorObject = removeSensitiveKeys(scenario);

            errorObject['error'] = true;
            errorObject['message'] = e.message;
            sendToInsights(errorObject, configuration.newrelic);
        }
    });

});

function removeSensitiveKeys(object) {
    Object.keys(object).forEach(key => {
        if (key.includes("password")) {
            delete object[key];
        }
    });

    return object;
}
