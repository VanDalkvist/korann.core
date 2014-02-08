var path = require('path');
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: path.join(__dirname, 'config.json') });

// #region private functions

var settings = {
    port: nconf.get('port'),
    db: nconf.get('korannDB'),
    session: nconf.get('session'),
    root: process.cwd(),
    env: nconf.get('env')
};

// #region exports

module.exports = settings;