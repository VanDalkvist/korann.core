/*
 *  Users test series
 */

// #region dependents

var mongoose = require('mongoose');
var async = require('async');
var models = require('db/models');
var logger = require('log').getLogger(module);

// #region initialization

function test() {

    async.series([
        open,
        dropUsers,
        createUsers
    ], function (err) {
        console.log(arguments);
        mongoose.disconnect();
        process.exit(err ? 255 : 0);
    });

    function open(callback) {
        mongoose.connection.on('open', callback);
    }

    function dropUsers(callback) {
        models.UserModel.remove({}, function (err) {
            if (err) throw err;

            logger.debug("Client apps cleared");
            callback();
        });
    }

    function createUsers(callback) {
//        var users = [
//            {username: 'Вася', password: 'supervasya'},
//            {username: 'Петя', password: '123'},
//            {username: 'admin', password: 'thetruehero'}
//        ];
//
//        async.each(users, function (userData, callback) {
//            var user = new mongoose.models.User(userData);
//            user.save(callback);
//        }, callback);

        // todo: implement users test
    }

}

// #region private methods

// #region exports

exports.test = test();