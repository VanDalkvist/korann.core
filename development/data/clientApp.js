/*
 *  Generating test data in db
 */

// #region dependents

var logger = require('log').getLogger(module);
var models = require('db/app');
var crypto = require('utils/crypto');
var date = require('utils/date');
var uuid = require('node-uuid');
var q = require('q');

// #region initialization

function _init(appRoles) {
    logger.debug("client apps testing");

    return q.all((appRoles || []).map(function (role) {
        return _createClientApp(role);
    }));
}

// #region private methods

function _createClientApp(role) {
    var deferred = q.defer();

    var secret = crypto.randomString(64);

    // todo: remove logs with secret
    logger.debug('New secret have been created for ', role, ' - ', secret);

    var clientApp = new models.ClientAppModel({
        appId: uuid.v1(),
        name: "test" + date.timestamp(),
        secret: secret,
        permissions: _getRoles(role)
    });
    clientApp.save(function (err, clientApp, affected) {
        if (err) {
            logger.error(err, clientApp, affected);
            return deferred.reject(err);
        }
        deferred.resolve(clientApp);
    });

    return deferred.promise;
}

function _getRoles(type) {
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

// #region exports

exports.run = _init;