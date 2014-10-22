/*
 *  User model
 */

// #region dependents

var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');

// #region initialization

function initModel() {
    return mongoose.model('User', UserSchema);
}

// #region exports

module.exports = initModel();