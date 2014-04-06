/*
 *  Client app model
 */

// #region dependents

var mongoose = require('mongoose');

// #region initialization

function initModel() {
    var Schema = mongoose.Schema;

    // #region schemas

    var ClientAppSchema = new Schema({
        appId: { type: String, required: true, unique: true },
        secret: { type: String, required: true },
        permissions: [
            { type: String, required: true }
        ],
        name: { type: String },
        createdAt: {type: Date, default: Date.now }
    }, { collection: 'apps' });

    // #region model

    return mongoose.model('ClientApp', ClientAppSchema);
}

// #region private methods

// #region exports

module.exports = initModel();