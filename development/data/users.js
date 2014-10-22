/*
 *  Users test series
 */

// #region dependents

var models = require('../../modules/db/app');
var logger = require('../../modules/log').getLogger(module);
var config = require('../config');
var q = require('q');

// #region initialization

function _test(users) {
    return q.all((users || []).map(function (user) {
            return _dropUser(user).then(function () {
                return _createUser(user);
            });
        })
    );
}

// #region private methods

function _dropUser(user) {
    var deferred = q.defer();

    models.UserModel.findOneAndRemove({ name: user.name }, {}, function (err) {
        if (err) return deferred.reject(err);

        logger.info("User '", user.name, "' was deleted.");
        deferred.resolve();
    });

    return deferred.promise;
}

function _createUser(user) {
    var deferred = q.defer();

    var userModel = new models.UserModel(user);
    userModel.save(function userSaved(err) {
        if (err) return deferred.reject(err);

        logger.info("User was saved successfully - ", user);

        deferred.resolve();
    });

    return deferred.promise;
}

// #region exports

exports.run = _test;