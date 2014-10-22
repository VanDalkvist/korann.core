/*
 *  Client app model
 */

// #region dependents

var mongoose = require('mongoose');
var crypto = require('crypto');

// #region initialization

function initModel() {
    var Schema = mongoose.Schema;

    // #region schemas

    var ClientAppSchema = new Schema({
        appId: { type: String, required: true, unique: true },
        secretHash: { type: String, required: true },
        salt: { type: String, required: true },
        permissions: [
            { type: String, required: true }
        ],
        name: { type: String },
        createdAt: {type: Date, default: Date.now }
    }, { collection: 'apps' });

    // #region model

    ClientAppSchema.methods.encryptSecret = function (secret) {
        return crypto.createHmac('sha512', this.salt).update(secret).digest('hex');
    };

    ClientAppSchema.virtual('userId').get(function () {
        return this.id;
    });

    ClientAppSchema.virtual('secret')
        .set(function (secret) {
            this._plainSecret = secret;
            this.salt = crypto.randomBytes(128).toString('base64');
            this.secretHash = this.encryptSecret(secret);
        })
        .get(function () {
            return this._plainSecret;
        });

    ClientAppSchema.methods.checkSecret = function (secret) {
        return this.encryptSecret(secret) === this.secretHash;
    };

    return mongoose.model('ClientApp', ClientAppSchema);
}

// #region private methods

// #region exports

module.exports = initModel();