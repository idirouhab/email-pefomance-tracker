const yaml = require('js-yaml');
const fs = require('fs');

if (global.debug) console.log('Loading configuration file');
module.exports.getYaml = () => yaml.safeLoad(fs.readFileSync('config.yaml'));
