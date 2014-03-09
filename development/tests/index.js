/*
 *  Test module
 */

// #region dependents

var userTests = require('../data/users');

// #region initialization

function init() {
    var user = {
        name: 'admin',
        password: 'admin',
        roles: ['client', 'admin', 'manager']
    };
    userTests.run(user);
}

// #region private methods 


// #region exports

exports.run = init;