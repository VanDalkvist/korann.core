/*
 *  Test module
 */

// #region dependents

var userTests = require('../data/users');
var appTests = require('../data/clientApp');
var config = require('../config');
var logger = require('../../modules/log').getLogger(module);
var q = require('q');

// #region initialization

function init() {
    var db = require('../../modules/db');
    db.init(config, function () {

        var usersDeferred = q.defer();

        usersDeferred.promise.then(userTests.run).then(_onSuccess, _onError);

        var users = [
            {
                name: 'admin',
                password: 'admin',
                roles: ['client', 'admin', 'manager']
            },
            {
                name: 'client',
                password: 'client',
                roles: ['client']
            },
            {
                name: 'manager',
                password: 'manager',
                roles: ['client', 'manager']
            }
        ];
        usersDeferred.resolve(users);

        var appsDeferred = q.defer();

        appsDeferred.promise.then(appTests.run).then(_onSuccess, _onError);

        appsDeferred.resolve(['client', 'admin', 'manager']);
    });
}

// #region private methods 

function _onSuccess() {
    logger.info("Generating passed.");

    setTimeout(function () {
        process.exit();
    }, 200)
}

function _onError(err) {
    logger.error("Generating failed. ", err);

    setTimeout(function () {
        process.exit(1);
    }, 200)
}

// #region exports

exports.run = init;