const request = require('request');

const InsightsBaseURL = {
    EU: "https://insights-collector.eu01.nr-data.net",
    US: "https://insights-collector.newrelic.com"
}

module.exports.sendToInsights = (payload, newRelic) => {
    if (global.debug) console.log('Sending data to New Relic');
    const {insertKey, accountId} = newRelic
    const options = {
        method: 'POST',
        url: `${getInsightsBaseRegionUrl(insertKey)}/v1/accounts/${accountId}/events`,
        headers: {
            'content-type': 'application/json',
            'x-insert-key': insertKey
        },
        json: true,
    };
    payload['eventType'] = 'Email';
    options['body'] = [payload];

    return request(options, (error, response, body) => {
        if (error) throw new Error(error);
        if (global.debug) console.log(body);
    });
};

function getInsightsBaseRegionUrl(insertKey) {
    return insertKey.startsWith("eu") ? InsightsBaseURL.EU : InsightsBaseURL.US;
}
