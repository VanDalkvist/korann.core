/*
 *  AppSession model
 */

// #region dependents

var mongoose = require('mongoose');

// #region initialization

function initModel() {
    var Schema = mongoose.Schema;

    // #region schemas

    var AppSessionSchema = new Schema({
        appId: { type: String, required: true },
        token: { type: String, required: true },
        expired: { type: Date, required: true }
    });

    // #region model

    return mongoose.model('AppSession', AppSessionSchema);
}

// #region exports

module.exports = initModel();