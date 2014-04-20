/*
 *  Test module
 */

// #region dependents

var userTests = require('../data/users');
var appTests = require('../data/clientApp');

// #region initialization

function init() {
    var user = {
        name: 'admin',
        password: 'admin',
        roles: ['client', 'admin', 'manager']
    };
//    userTests.run(user);
    appTests.run();
}

// #region private methods 


// #region exports

exports.run = init;