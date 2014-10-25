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
        appId: { type: String, required: true },
        expired: { type: Number, required: true },
        context: { type: Schema.Types.Mixed }
    }, { collection: 'user.sessions' });

    UserSessionSchema.index({ userId: 1 });

    // #region model

    return mongoose.model('UserSession', UserSessionSchema);
}

// #region exports

module.exports = initModel();