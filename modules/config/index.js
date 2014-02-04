var path = require('path');
var nconf = require('nconf');

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'

nconf.argv()
    .env()
    .file({ file: path.join(__dirname, 'config.json') });

// #region private functions

var settings = {
    get port() {
        return nconf.get('port')
    }
};

// #region exports

module.exports = settings;