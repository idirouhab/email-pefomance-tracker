const request = require('request');

module.exports.sendToInsights = (payload, newRelic) => {
    if (global.debug) console.log('Sending data to New Relic');
    const options = {
        method: 'POST',
        url: `https://insights-collector.newrelic.com/v1/accounts/${newRelic.account_id}/events`,
        headers: {
            'content-type': 'application/json',
            'x-insert-key': newRelic.insert_key
        },
        json: true,
    };

    payload['eventType'] = 'Email';
    options['body'] = [payload];

    request(options, (error, response, body) => {
        if (error) throw new Error(error);
        if (global.debug) console.log(body);
    });
};