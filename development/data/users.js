/*
 *  Users test series
 */

// #region dependents

var models = require('../../modules/db/app');
var logger = require('../../modules/log').getLogger(module);
var config = require('../config');

// #region initialization

function test(user) {
    require('../../modules/db').init(config, function () {
        dropUsers(user, function () {
            createUser(user, function (err) {
                if (err) logger.error("Test failed.", err);

                logger.debug("Test passed.");

                process.exit(0)
            });
        });
    });
}

// #region private methods

function dropUsers(user, callback) {
    models.UserModel.remove({ name: user.name }, function (err) {
        if (err) throw err;

        logger.debug("User '", user.name, "' was deleted.");
        callback();
    });
}

function createUser(user, callback) {
    var userModel = new models.UserModel(user);
    userModel.save(function userSaved(err) {
        if (err) return callback(err);

        logger.info("User was saved successfully - ", user);

        callback();
    });
}

// #region exports

exports.run = test;