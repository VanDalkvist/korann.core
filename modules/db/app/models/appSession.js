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
        expired: { type: Number, required: true }
    }, { collection: 'app.sessions' });

    AppSessionSchema.index({ appId: 1 });

    // #region model

    return mongoose.model('AppSession', AppSessionSchema);
}

// #region exports

module.exports = initModel();