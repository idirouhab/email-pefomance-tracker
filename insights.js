const axios = require("axios");

module.exports.sendToInsights = (payload, newRelic) => {
    const proxy = global.proxy ? global.proxy : false;
    const axiosClient = axios.create({
        timeout: 3000,
        proxy: proxy
    });

    if (global.debug) console.log('Sending data to New Relic');
    payload['eventType'] = 'Email';

    return axiosClient
        .post(
            `https://insights-collector.newrelic.com/v1/accounts/${newRelic.accountId}/events`,
            payload,
            {
                headers: {
                    'content-type': 'application/json',
                    'x-insert-key': newRelic.insertKey
                }
            }
        );
};
