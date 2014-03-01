/*
 *  UserSession model
 */

// #region dependents

var mongoose = require('mongoose');

// #region initialization

function initModel() {
    var Schema = mongoose.Schema;

    // #region schemas

    var UserSessionSchema = new Schema({
        userId: { type: String, required: true },
        token: { type: String, required: true },
        expired: { type: Date, required: true }
    });

    // #region model

    return mongoose.model('UserSession', UserSessionSchema);
}

// #region exports

module.exports = initModel();