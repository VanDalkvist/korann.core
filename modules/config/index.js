var path = require('path');
var nconf = require('nconf');
var _ = require('underscore');

nconf.argv()
    .env()
    .file({ file: path.join(__dirname, 'config.json') });

// #region private functions

var settings = _.extend(nconf.get(), {
    root: process.cwd(),
    env: nconf.get('env')
});

// #region exports

module.exports = settings;