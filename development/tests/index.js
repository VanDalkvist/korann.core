/*
 *  Test module
 */

// #region dependents

var userTests = require('../data/users');
var appTests = require('../data/clientApp');
var config = require('../config');
var logger = require('../../modules/log').getLogger(module);


// #region initialization

function init() {
    var db = require('../../modules/db');
    db.init(config, function () {

        var user = {
            name: 'admin',
            password: 'admin',
            roles: ['client', 'admin', 'manager']
        };
        userTests.run(user);
//        appTests.run();
    });
}

// #region private methods 


// #region exports

exports.run = init;