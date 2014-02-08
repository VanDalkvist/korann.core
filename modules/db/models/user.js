/*
 *  User model
 */

// #region dependents

var mongoose = require('mongoose');
var crypto = require('crypto');

// #region initialization

function initModel() {
    var Schema = mongoose.Schema;

    // #region schemas

    var UserSchema = new Schema({
        name: {
            type: String,
            unique: true,
            required: true
        },
        hashedPassword: { type: String, required: true },
        salt: { type: String, required: true },
        created: { type: Date, default: Date.now }
    });

    // #region configuration functions

    User.methods.encryptPassword = function (password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
    };

    User.virtual('userId').get(function () {
        return this.id;
    });

    User.virtual('password')
        .set(function (password) {
            this._plainPassword = password;
            this.salt = crypto.randomBytes(32).toString('base64');
            //more secure - this.salt = crypto.randomBytes(128).toString('base64');
            this.hashedPassword = this.encryptPassword(password);
        })
        .get(function () {
            return this._plainPassword;
        });

    User.methods.checkPassword = function (password) {
        return this.encryptPassword(password) === this.hashedPassword;
    };

    // #region model

    return mongoose.model('User', UserSchema);
}

// #region private methods

// #region exports

module.exports = initModel();