/*
 *  Generating test data in db
 */

// #region dependents

var logger = require('log').getLogger(module);
var models = require('db/appModels').init();
var crypto = require('utils/crypto');
var date = require('utils/date');
var uuid = require('node-uuid');

// #region initialization

function init() {
    require('db').init();

    logger.debug("hello");

    createClientApp('client');
    createClientApp('admin');
    createClientApp('manager');
}

// #region private methods

function createClientApp(role) {
    var clientApp = new models.ClientAppModel({
        appId: uuid.v1(),
        name: "test" + date.timestamp(),
        secret: crypto.randomString(64),
        permissions: getRoles(role)
    });
    saveClientApp(clientApp);
}

function getRoles(type) {
    switch (type) {
        case 'client':
            return ['client'];
            break;
        case 'admin':
            return ['client', 'manager', 'admin'];
            break;
        case 'manager':
            return ['client', 'manager'];
            break;
    }
    throw new Error("Wrong type");
}

function saveClientApp(clientApp) {
    clientApp.save(function (err, clientApp, affected) {
        if (err) throw err;

        logger.debug(err, clientApp, affected);
    });
}

// #region exports

module.exports = init();