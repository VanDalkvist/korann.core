/*
 *  Generating test data in db
 */

// #region dependents

var logger = require('log').getLogger(module);
var models = require('db/app');
var crypto = require('utils/crypto');
var date = require('utils/date');
var uuid = require('node-uuid');
var async = require('async');


// #region initialization

function _init(endCallback) {
    logger.debug("client apps testing");

    async.parallel([
            function (callback) {
                _createClientApp('client', callback);
            },
            function (callback) {
                _createClientApp('admin', callback);
            },
            function (callback) {
                _createClientApp('manager', callback);
            }
        ],
        function (err, results) {
            if (err) {
                endCallback && endCallback(err);
                return;
            }
            endCallback && endCallback();
        }
    );
}

// #region private methods

function _createClientApp(role, callback) {
    var clientApp = new models.ClientAppModel({
        appId: uuid.v1(),
        name: "test" + date.timestamp(),
        secret: crypto.randomString(64),
        permissions: _getRoles(role)
    });
    clientApp.save(function (err, clientApp, affected) {
        if (err) {
            logger.error(err, clientApp, affected);
            callback && callback(err);
        }
        callback && callback(null, clientApp);
    });
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