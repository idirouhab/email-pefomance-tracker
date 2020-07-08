const axios = require("axios");

const InsightsBaseURL = {
    EU: "https://insights-collector.eu01.nr-data.net",
    US: "https://insights-collector.newrelic.com"
}

module.exports.sendToInsights = (payload, newRelic) => {
    const { insertKey, accountId, region } = newRelic;
    const proxy = global.proxy ? global.proxy : false;
    const axiosClient = axios.create({
        timeout: 3000,
        proxy: proxy
    });

    if (global.debug) console.log('Sending data to New Relic');
    payload['eventType'] = 'Email';
    if (global.debug) console.log(`Payload: ${JSON.stringify(payload)}`);
    return axiosClient
        .post(
          `${getInsightsBaseRegionUrl(region)}/v1/accounts/${accountId}/events`,
          payload,
          {
              headers: {
                  "content-type": "application/json",
                  "x-insert-key": insertKey,
              },
          },
        );
};



function getInsightsBaseRegionUrl (region) {
    return InsightsBaseURL[region];
}
